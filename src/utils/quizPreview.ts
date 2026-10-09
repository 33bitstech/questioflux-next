import IQuizes from '@/interfaces/IQuizes'

export interface IPreviewOption {
    text: string
    image?: string
}

export interface IPreviewQuestion {
    id: string
    text: string
    image?: string
    options: IPreviewOption[]
}

const clean = (text?: string) => (text ?? '').replace(/\s+/g, ' ').trim()

const imageUrl = (src?: string) => (src && /^https?:\/\//.test(src) ? src : undefined)

// Número estável para uma string: serve para embaralhar sempre do mesmo jeito.
export function stableHash(value: string) {
    let h = 2166136261
    for (let i = 0; i < value.length; i++) {
        h ^= value.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

// Perguntas e alternativas para o HTML indexável e para o JSON-LD. Só lê texto e imagem:
// qual alternativa é a certa não entra aqui. A ordem das alternativas é embaralhada de
// forma estável (sempre igual para o mesmo quiz), porque a ordem salva pode entregar a certa.
export function buildQuestionsPreview(quiz: Pick<IQuizes, 'questions'>): IPreviewQuestion[] {
    return (quiz.questions ?? []).flatMap((question, index) => {
        const id = question.questionId || String(index)
        const text = clean(question.question || question.title)
        const image = imageUrl(question.image)
        const answers = Array.isArray(question.answers) ? question.answers : []
        const alternatives = answers.filter(answer => typeof answer === 'object' && answer !== null)

        const options: IPreviewOption[] = alternatives.length > 0
            ? alternatives.map(answer => {
                const alternative = answer as { text?: string; thumbnail?: string }
                return { text: clean(alternative.text), image: imageUrl(alternative.thumbnail) }
            })
            : answers
                .filter((answer): answer is string => typeof answer === 'string')
                .map(answer => ({ text: clean(answer) }))

        const seen = new Set<string>()
        const unique = options.filter(option => {
            const key = `${option.text.toLowerCase()}|${option.image ?? ''}`
            if ((!option.text && !option.image) || seen.has(key)) return false
            seen.add(key)
            return true
        })

        if (!text && !image) return []

        unique.sort((a, b) =>
            stableHash(`${id}:${a.text}${a.image ?? ''}`) - stableHash(`${id}:${b.text}${b.image ?? ''}`)
        )

        return [{ id, text, image, options: unique }]
    })
}
