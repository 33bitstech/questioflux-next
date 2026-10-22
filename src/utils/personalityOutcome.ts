import IPersonalityOutcome from '@/interfaces/IPersonalityOutcome'

// Como a correção da prova: o resultado fica no sessionStorage da aba e a página
// /quiz/[id]/personality lê de lá (aguenta recarregar).
const storageKey = (quizId: string) => `personalityResult:${quizId}`

export function savePersonalityOutcome(quizId: string, outcome: IPersonalityOutcome): boolean {
    try {
        sessionStorage.setItem(storageKey(quizId), JSON.stringify(outcome))
        return true
    } catch {
        return false
    }
}

export function loadPersonalityOutcome(quizId: string): IPersonalityOutcome | null {
    try {
        const raw = sessionStorage.getItem(storageKey(quizId))
        if (!raw) return null

        const outcome = JSON.parse(raw) as IPersonalityOutcome
        return outcome?.result?.resultId && Array.isArray(outcome.breakdown) ? outcome : null
    } catch {
        return null
    }
}
