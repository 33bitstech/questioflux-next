// Respostas de um quiz terminado guardadas quando a pessoa sai para o login com Google (no
// popup do fim do quiz). Na volta, a página do quiz envia as respostas (login certo) ou abre o
// popup de novo com elas (erro, ou a pessoa voltou sem entrar). O sessionStorage fica na aba,
// e a ida e volta pelo Google acontece na mesma aba.
const KEY = 'qf_pending_quiz_answers'
// o tempo do quiz fica num cookie de uma hora: depois disso o envio falharia de qualquer jeito
const MAX_AGE = 60 * 60 * 1000

interface IPendingAnswers {
    quizId: string
    quizAnswer: unknown
    savedAt: number
}

export function savePendingAnswers(quizId: string, quizAnswer: unknown): boolean {
    try {
        const value: IPendingAnswers = { quizId, quizAnswer, savedAt: Date.now() }
        sessionStorage.setItem(KEY, JSON.stringify(value))
        return true
    } catch {
        // sem armazenamento (modo restrito do navegador): o login segue, sem retomar
        return false
    }
}

export function clearPendingAnswers() {
    try {
        sessionStorage.removeItem(KEY)
    } catch {}
}

// Lê e apaga: as respostas só são retomadas uma vez, e só neste quiz
export function takePendingAnswers(quizId: string): unknown | undefined {
    let raw: string | null = null
    try {
        raw = sessionStorage.getItem(KEY)
    } catch {
        return undefined
    }
    if (!raw) return undefined

    try {
        const value = JSON.parse(raw) as Partial<IPendingAnswers>
        if (value.quizId !== quizId) return undefined
        clearPendingAnswers()
        if (typeof value.savedAt !== 'number' || Date.now() - value.savedAt > MAX_AGE) return undefined
        return Array.isArray(value.quizAnswer) && value.quizAnswer.length > 0 ? value.quizAnswer : undefined
    } catch {
        clearPendingAnswers()
        return undefined
    }
}
