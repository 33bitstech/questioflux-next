import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import { IAnswerResult } from '@/interfaces/IQuestion'
import { IPersonalityResult } from '@/interfaces/IQuizes'
import { resultColor } from '@/utils/personalityResults'

export interface IResultOption {
    resultId: string
    title: string
    color: string
}

export const toResultOptions = (results: IPersonalityResult[] = []): IResultOption[] =>
    results.map((result, index) => ({ resultId: result.resultId, title: result.title, color: resultColor(index) }))

// Alternativa nova já vem ligada a um resultado (a 1ª ao 1º, a 2ª ao 2º...), que é o jeito
// mais comum de montar esse tipo de quiz. Ligação a um resultado apagado também volta ao padrão.
export function effectiveResultId(alternative: { resultId?: string }, index: number, options: IResultOption[]): string {
    if (alternative.resultId && options.some(option => option.resultId === alternative.resultId)) return alternative.resultId
    return options.length ? options[index % options.length].resultId : ''
}

// Formato do backend: texto da alternativa (texto) ou id (imagem) -> resultado.
export function getAnswerResults(question: ILocalQuestions, mode: 'text' | 'image', options: IResultOption[]): IAnswerResult[] {
    return question.alternatives.map((alternative, index) => ({
        answer: (mode === 'text' ? alternative.answer : alternative.id) ?? '',
        resultId: effectiveResultId(alternative, index, options),
    }))
}

export const savedResultId = (links: IAnswerResult[] | undefined, answer: string) =>
    links?.find(link => link.answer === answer)?.resultId
