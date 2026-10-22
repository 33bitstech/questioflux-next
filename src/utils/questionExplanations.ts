import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import { IAnswerExplanation } from '@/interfaces/IQuestion'

// Explicações da prova no formato do backend. A alternativa é identificada pelo texto
// no quiz de texto e pelo id no quiz de imagem (é o que fica salvo em "answers").
export function getLocalExplanations(question: ILocalQuestions, mode: 'text' | 'image'): IAnswerExplanation[] {
    return question.alternatives.flatMap(alternative => {
        const text = alternative.explanation?.trim()
        const answer = mode === 'text' ? alternative.answer : alternative.id

        return text && answer ? [{ answer, text }] : []
    })
}

// Explicação salva de uma alternativa, para carregar na edição.
export function savedExplanation(explanations: IAnswerExplanation[] | undefined, answer: string) {
    return explanations?.find(item => item.answer === answer)?.text ?? ''
}
