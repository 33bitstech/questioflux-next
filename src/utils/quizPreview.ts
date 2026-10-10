import IQuizes from '@/interfaces/IQuizes'

export interface IPreviewQuestion {
    id: string
    text: string
    image?: string
    optionsCount: number
}

export interface IQuizPreview {
    // as perguntas que aparecem na página, na ordem do quiz
    questions: IPreviewQuestion[]
    // quantas perguntas o quiz tem ao todo
    total: number
}

// Amostra pequena de propósito: quem lê as perguntas antes joga com vantagem no tempo.
// Uma pergunta, ou duas quando o quiz tem mais de 7.
const LONG_QUIZ = 7
const previewSize = (total: number) => (total > LONG_QUIZ ? 2 : 1)

const clean = (text?: string) => (text ?? '').replace(/\s+/g, ' ').trim()

const imageUrl = (src?: string) => (src && /^https?:\/\//.test(src) ? src : undefined)

// O que a página do quiz mostra das perguntas (HTML e JSON-LD): o enunciado, a imagem e
// quantas alternativas existem. As alternativas em si e qual é a certa não saem daqui.
export function buildQuizPreview(quiz: Pick<IQuizes, 'questions'>): IQuizPreview {
    const all = (quiz.questions ?? []).flatMap((question, index) => {
        const text = clean(question.question || question.title)
        const image = imageUrl(question.image)

        if (!text && !image) return []

        const answers = Array.isArray(question.answers) ? question.answers : []
        // em quiz de imagem as alternativas são objetos; string solta ali é id, não alternativa
        const alternatives = answers.filter(answer => typeof answer === 'object' && answer !== null)
        const optionsCount = alternatives.length > 0
            ? alternatives.length
            : new Set(answers.filter((answer): answer is string => typeof answer === 'string').map(clean).filter(Boolean)).size

        return [{ id: question.questionId || String(index), text, image, optionsCount }]
    })

    return { questions: all.slice(0, previewSize(all.length)), total: all.length }
}
