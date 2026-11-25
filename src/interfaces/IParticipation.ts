// Uma conclusão gravada (GET /participation/:quizId/:participationId). Os campos do resultado
// mudam com o formato: personalidade traz results, os formatos com nota trazem score.
export type TNameStatus = 'account' | 'chosen' | 'anonymous' | 'unrecorded'

export interface IParticipationPlayer {
    userId?: string
    name?: string
    nameStatus: TNameStatus
    profileImg: string
    isGuest: boolean
}

export default interface IParticipationView {
    participationId: string
    quizId: string
    kind: string
    completedAt: string
    // registro recuperado de dados antigos (a data é aproximada)
    legacy?: boolean
    player: IParticipationPlayer
    // quem jogou está vendo (pela conta ou pela chave guardada no navegador)
    isOwner: boolean
    // personalidade
    results?: Array<{ resultId: string, title: string }>
    // trivia, prova, sobre mim
    score?: string
    [key: string]: unknown
}
