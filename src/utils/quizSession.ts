import { createHmac, timingSafeEqual } from 'crypto'
import { env } from '@/env'

// Sessão do quiz sem cookie, para o embed: dentro de um iframe em outro site os cookies do
// QuestioFlux são de terceiros e o navegador pode descartá-los (o Safari sempre descarta).
// O início e o tempo decorrido vão num token que o client guarda e devolve; a assinatura
// impede que o número seja trocado no caminho.

type TSessionKind = 'start' | 'elapsed'

// mesma validade dos cookies de sessão do /taking
const MAX_AGE_MS = 60 * 60 * 1000

const sign = (payload: string) =>
    createHmac('sha256', env.OWN_API_KEY).update(`quiz-session:${payload}`).digest('base64url')

export function sealQuizSession(quizId: string, kind: TSessionKind, value: number) {
    const payload = `${kind}.${value}.${Date.now()}`

    return `${payload}.${sign(`${quizId}.${payload}`)}`
}

// null = o token não é deste quiz, não é do tipo pedido, foi alterado ou venceu.
export function openQuizSession(quizId: string, kind: TSessionKind, token: string): number | null {
    const [tokenKind, value, issuedAt, signature = ''] = token.split('.')
    const expected = Buffer.from(sign(`${quizId}.${tokenKind}.${value}.${issuedAt}`))
    const received = Buffer.from(signature)

    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null
    if (tokenKind !== kind || Date.now() - Number(issuedAt) > MAX_AGE_MS) return null

    return Number(value)
}
