import { env } from '@/env'
import { IUser } from '@/interfaces/IUser'
import { TLeaderboard } from '@/types/leaderboardTypes'

export { isGuestEntry } from './leaderboardEntry'

export interface ILeaderboardData {
    scoreBoard: TLeaderboard
    // participações gravadas, inclusive de quem ocultou a atividade
    total: number
    // trivia: só as 10 primeiras contas e os 10 primeiros visitantes (mais a entrada de quem pediu)
    limited?: boolean
    // quantas entradas visíveis existem em cada grupo
    users?: number
    guests?: number
}

// cookieHeader: o login de quem vê. Sem ele, o ranking vem como para um visitante (sem a
// própria entrada, se ela estiver oculta, e sem respostas).
export async function getLeaderboardData(quizId: string, cookieHeader = ''): Promise<ILeaderboardData | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/leaderboard/${quizId}`, {
            method: 'GET',
            headers: { cookie: cookieHeader },
            cache: 'no-store',
        })
        if (!response.ok) return undefined

        const res = await response.json()
        return { ...res, scoreBoard: res.scoreBoard ?? [] }
    } catch (err) {
        console.log(err)
    }
}

export async function getViewer(cookieHeader: string): Promise<IUser | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user`, {
            method: 'GET',
            headers: { cookie: cookieHeader },
        })
        const res = await response.json()
        return res.user
    } catch (err) {
        console.log(err)
    }
}
