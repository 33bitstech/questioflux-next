import IExamReviewQuestion from '@/interfaces/IExamReview'
import type { IQuizScore } from '@/components/TakingQuiz/taking'

export interface IStoredExamReview {
    score: IQuizScore
    review: IExamReviewQuestion[]
}

// A correção é grande demais para o cookie do resultado (4 KB): fica no sessionStorage da
// aba, que aguenta recarregar a página e voltar do ranking.
const storageKey = (quizId: string) => `examReview:${quizId}`

export function saveExamReview(quizId: string, data: IStoredExamReview): boolean {
    try {
        sessionStorage.setItem(storageKey(quizId), JSON.stringify(data))
        return true
    } catch {
        // aba anônima sem espaço, storage bloqueado...
        return false
    }
}

export function loadExamReview(quizId: string): IStoredExamReview | null {
    try {
        const raw = sessionStorage.getItem(storageKey(quizId))
        if (!raw) return null

        const data = JSON.parse(raw) as IStoredExamReview
        return Array.isArray(data?.review) && data?.score?.userForLeaderBoard ? data : null
    } catch {
        return null
    }
}
