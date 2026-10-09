import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import ApiData from '@/utils/ApiData'
import IQuizes from '@/interfaces/IQuizes'
import IQuestion from '@/interfaces/IQuestion'
import { idiomToLocale } from '@/utils/seo'
import { isQuizIndexable } from '@/utils/quizQuality'
import { stableHash } from '@/utils/quizPreview'

export const QUIZ_REVALIDATE = 300

// Quem altera um quiz chama updateTag(quizTag(id)) para a página pública não ficar velha.
export const quizTag = (quizId: string) => `quiz-${quizId}`

const isAlternative = (answer: unknown) => typeof answer === 'object' && answer !== null

// Nada de gabarito sai daqui, mesmo que o backend mande: o quiz vai para client
// components (o /taking) e tudo que é prop acaba dentro do HTML.
function stripAnswerKey(question: IQuestion): IQuestion {
    const { correctAnswer, correctAnswerThumbnal, ...safe } = question as IQuestion & Record<string, unknown>
    const answers = Array.isArray(safe.answers) ? safe.answers : []

    return {
        ...safe,
        // em quiz de imagem, string solta entre as alternativas é o id da correta
        answers: answers.some(isAlternative) ? answers.filter(isAlternative) : answers,
    } as IQuestion
}

// Uma chamada ao backend por renderização: layout, metadata e página dividem o resultado.
// null = o quiz não existe. Qualquer outra falha (429, 5xx, rede) estoura de propósito:
// responder 200 em branco ou 404 por um erro passageiro faria o Google descartar a URL.
export const getPublicQuiz = cache(async (quizId: string): Promise<IQuizes | null> => {
    const response = await ApiData({
        path: `quiz/${encodeURIComponent(quizId)}`,
        method: 'GET',
        cache: { next: { revalidate: QUIZ_REVALIDATE, tags: [quizTag(quizId)] } },
    })

    if (response.status === 404) return null
    if (!response.ok) throw new Error(`[getPublicQuiz] ${quizId}: API respondeu ${response.status}`)

    const res = await response.json()
    const quiz: IQuizes | undefined = res?.quiz

    if (!quiz) return null

    return { ...quiz, questions: quiz.questions?.map(stripAnswerKey) }
})

export interface IIndexableQuiz {
    quizId: string
    title: string
    idiom: string
    category: string
    qtdQuestions: number
    updated_at: string
    images: string[]
}

const MAX_SITEMAP_PAGES = 50
const RETRY_AFTER_FAILURE_MS = 5 * 60 * 1000

let lastFailure = 0

const loadIndexableQuizzes = unstable_cache(async (): Promise<IIndexableQuiz[]> => {
    const quizzes: IQuizes[] = []

    for (let page = 1; page <= MAX_SITEMAP_PAGES; page++) {
        const response = await ApiData({
            path: `v2/sitemap-quizzes?page=${page}`,
            method: 'GET',
            cache: { cache: 'no-store' },
        })

        if (!response.ok) throw new Error(`[getIndexableQuizzes] v2/sitemap-quizzes respondeu ${response.status}`)

        const res = await response.json()
        quizzes.push(...(res.quizzes ?? []))

        if (page >= (res.totalPages ?? 1)) break
    }

    return quizzes.filter(isQuizIndexable).map(quiz => ({
        quizId: quiz.quizId,
        title: quiz.title,
        idiom: quiz.idiom,
        category: quiz.category,
        qtdQuestions: quiz.qtdQuestions,
        updated_at: String(quiz.updated_at || quiz.created_at),
        // capa + imagens das perguntas, para o Google Imagens
        images: [quiz.quizThumbnail, ...(quiz.questions ?? []).map(question => question.image)]
            .filter((src): src is string => !!src && /^https?:\/\//.test(src))
            .slice(0, 20),
    }))
}, ['indexable-quizzes'], { revalidate: 60 * 60 })

// Todos os quizzes que passam na regra de indexação, já enxutos. É a lista do sitemap e
// a fonte dos links de "mais quizzes". O backend entrega 100 quizzes por requisição com
// as questões (sem gabarito); buscar quiz a quiz estouraria o rate limit da API.
// Depois de uma falha espera alguns minutos antes de tentar de novo: toda página de quiz
// passa por aqui e não pode ficar batendo numa API que está fora.
export async function getIndexableQuizzes(): Promise<IIndexableQuiz[]> {
    if (Date.now() - lastFailure < RETRY_AFTER_FAILURE_MS) {
        throw new Error('[getIndexableQuizzes] aguardando para tentar de novo após falha')
    }

    try {
        return await loadIndexableQuizzes()
    } catch (err) {
        lastFailure = Date.now()
        throw err
    }
}

// Links internos de um quiz para outros: mesmo idioma primeiro, depois mesma categoria. A escolha
// varia de página para página (mas é fixa em cada uma), assim todo quiz indexável recebe
// links em vez de só os mais novos. Sem a lista (API fora), a página segue sem a seção.
export async function getRelatedQuizzes(quiz: IQuizes, limit = 6): Promise<IIndexableQuiz[]> {
    try {
        const sameIdiom = (other: IIndexableQuiz) => idiomToLocale(other.idiom) === idiomToLocale(quiz.idiom)
        const sameCategory = (other: IIndexableQuiz) => other.category === quiz.category
        const rank = (other: IIndexableQuiz) => (sameIdiom(other) ? 0 : 2) + (sameCategory(other) ? 0 : 1)

        return (await getIndexableQuizzes())
            .filter(other => other.quizId !== quiz.quizId && (sameCategory(other) || sameIdiom(other)))
            .sort((a, b) => rank(a) - rank(b) || stableHash(quiz.quizId + a.quizId) - stableHash(quiz.quizId + b.quizId))
            .slice(0, limit)
    } catch {
        return []
    }
}

// Para client components que só mostram dados do quiz: sem as questões no payload.
export function withoutQuestions(quiz: IQuizes): IQuizes {
    const { questions, ...info } = quiz
    return info
}
