import { TExperienceAnswer } from '@/interfaces/IExperience'

// Guardado no navegador pelos formatos de experiência. Sem armazenamento (aba anônima,
// bloqueio), tudo continua funcionando: só não retoma a partida nem reconhece o próprio convite.

// ── partida terminada, à espera do login com Google (ida e volta na mesma aba) ──

const PENDING_KEY = 'qf_pending_experience'
const PENDING_MAX_AGE = 60 * 60 * 1000

interface IPendingExperience {
    quizId: string
    answer: TExperienceAnswer
    attemptKey?: string
    savedAt: number
}

export function savePendingExperience(quizId: string, answer: TExperienceAnswer, attemptKey?: string) {
    try {
        const value: IPendingExperience = { quizId, answer, attemptKey, savedAt: Date.now() }
        sessionStorage.setItem(PENDING_KEY, JSON.stringify(value))
    } catch {
        // sem armazenamento: o login segue, sem retomar a partida
    }
}

export function clearPendingExperience() {
    try {
        sessionStorage.removeItem(PENDING_KEY)
    } catch {}
}

// Lê e apaga: a partida só é retomada uma vez, e só neste quiz
export function takePendingExperience(quizId: string): { answer: TExperienceAnswer, attemptKey?: string } | undefined {
    let raw: string | null = null
    try {
        raw = sessionStorage.getItem(PENDING_KEY)
    } catch {
        return undefined
    }
    if (!raw) return undefined

    try {
        const value = JSON.parse(raw) as Partial<IPendingExperience>
        if (value.quizId !== quizId) return undefined
        clearPendingExperience()
        if (typeof value.savedAt !== 'number' || Date.now() - value.savedAt > PENDING_MAX_AGE) return undefined
        if (typeof value.answer !== 'object' || value.answer === null) return undefined
        return { answer: value.answer, attemptKey: typeof value.attemptKey === 'string' ? value.attemptKey : undefined }
    } catch {
        clearPendingExperience()
        return undefined
    }
}

// ── convites da compatibilidade feitos neste navegador ──
// Quem abre o próprio link é avisado antes de jogar (com conta, o backend também recusa).

const INVITES_KEY = 'qf_invites'
const MAX_INVITES = 50

interface IStoredInvite {
    quizId: string
    inviteCode: string
}

function readInvites(): IStoredInvite[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(INVITES_KEY) || '[]')
        return Array.isArray(parsed) ? parsed.filter(item => typeof item?.quizId === 'string' && typeof item?.inviteCode === 'string') : []
    } catch {
        return []
    }
}

export function saveOwnInvite(quizId: string, inviteCode: string) {
    try {
        const others = readInvites().filter(item => item.inviteCode !== inviteCode)
        localStorage.setItem(INVITES_KEY, JSON.stringify([{ quizId, inviteCode }, ...others].slice(0, MAX_INVITES)))
    } catch {}
}

export const isOwnInvite = (quizId: string, inviteCode: string) =>
    readInvites().some(item => item.quizId === quizId && item.inviteCode === inviteCode)
