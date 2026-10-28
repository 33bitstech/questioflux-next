// Resultado da última tentativa para a página /quiz/[id]/results, que lê o cookie no servidor.
// Leva só o que a página mostra e o quiz a que pertence. Antes ia a resposta inteira, com
// todas as perguntas e respostas: em quizzes maiores passava de 4 KB, o navegador não gravava
// e a página mostrava o cookie de uma tentativa anterior, às vezes de outro quiz.
export const RESULT_COOKIE = 'quizResults'

// abaixo dos 4 KB por cookie, com folga para nome e atributos
const MAX_ENCODED_LENGTH = 3500

export interface IQuizResultCookie {
    quizId: string
    message: string
    // "acertos/total"
    score: string
    timing: number
}

interface IScoreResponse {
    message?: string
    userForLeaderBoard?: { score?: string, timing?: number }
}

export function makeResultCookie(quizId: string, res: IScoreResponse): string {
    const encode = (message: string) => encodeURIComponent(JSON.stringify({
        quizId,
        message,
        score: String(res?.userForLeaderBoard?.score ?? ''),
        timing: Number(res?.userForLeaderBoard?.timing ?? 0),
    } satisfies IQuizResultCookie))

    // a mensagem final é escrita por quem criou o quiz e não tem limite de tamanho
    let message = String(res?.message ?? '')
    let encoded = encode(message)
    while (encoded.length > MAX_ENCODED_LENGTH && message) {
        message = message.slice(0, Math.floor(message.length * 0.8))
        encoded = encode(`${message}…`)
    }
    return encoded
}

export function readResultCookie(raw: string | undefined, quizId: string): IQuizResultCookie | null {
    if (!raw) return null
    try {
        const value = JSON.parse(decodeURIComponent(raw))
        return value?.quizId === quizId && typeof value.score === 'string' ? value : null
    } catch {
        return null
    }
}
