// Cada conclusão devolve participationId (o link do resultado) e ownerKey (segredo de quem
// jogou). A chave fica só neste navegador: abre a parte privada da página do resultado
// (no teste de compatibilidade, o convite e as comparações). Sem localStorage (aba anônima,
// bloqueio), a página continua funcionando só com a parte pública.
export interface IParticipationRef {
    participationId: string
    ownerKey: string
}

const STORAGE_KEY = 'qf_participations'
const MAX_ENTRIES = 50

interface IStoredRef extends IParticipationRef {
    quizId: string
    savedAt: number
}

function readAll(): IStoredRef[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        return Array.isArray(parsed) ? parsed.filter(item => item?.participationId && item?.ownerKey && item?.quizId) : []
    } catch {
        return []
    }
}

export const isParticipationRef = (value: unknown): value is IParticipationRef =>
    typeof (value as IParticipationRef)?.participationId === 'string' && typeof (value as IParticipationRef)?.ownerKey === 'string'

export function saveParticipationRef(quizId: string, ref: unknown): void {
    if (!isParticipationRef(ref)) return
    try {
        const others = readAll().filter(item => item.participationId !== ref.participationId)
        const next = [{ quizId, participationId: ref.participationId, ownerKey: ref.ownerKey, savedAt: Date.now() }, ...others].slice(0, MAX_ENTRIES)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
        // sem armazenamento: o link do resultado continua valendo, só sem a parte privada
    }
}

export function ownerKeyFor(participationId: string): string | undefined {
    return readAll().find(item => item.participationId === participationId)?.ownerKey
}

// todas as conclusões deste navegador num quiz, a mais recente primeiro ("Seus convites")
export function participationRefsFor(quizId: string): IParticipationRef[] {
    return readAll().filter(item => item.quizId === quizId).map(({ participationId, ownerKey }) => ({ participationId, ownerKey }))
}

// a conclusão mais recente deste navegador num quiz (ex.: o convite da compatibilidade)
export function latestParticipationFor(quizId: string): IParticipationRef | undefined {
    const found = readAll().find(item => item.quizId === quizId)
    return found ? { participationId: found.participationId, ownerKey: found.ownerKey } : undefined
}

// Chave de uma partida, criada ao começar: reenviar a mesma conclusão não conta de novo.
export function newAttemptKey(): string {
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
    } catch { /* contexto sem crypto.randomUUID */ }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
}
