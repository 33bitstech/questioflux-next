import { IPersonalityResult } from './IQuizes'

// Resultado de quem terminou um quiz de personalidade (vem do backend ao enviar as respostas).
export default interface IPersonalityOutcome {
    // o resultado principal (o primeiro dos empatados, quando combinado)
    result: IPersonalityResult
    // um resultado, ou os empatados quando o quiz não tem pergunta de desempate.
    // Resultados guardados antes do desempate não têm o campo: vale [result].
    results?: IPersonalityResult[]
    combined?: boolean
    // quanto deu cada resultado nas respostas da pessoa, do maior para o menor
    breakdown: Array<{ resultId: string, title: string, image?: string, count: number, percent: number }>
    // quantas pessoas já fizeram e quantos % delas tiveram este mesmo resultado (não vem no combinado)
    plays: number
    sameResultPercent?: number
}

// Empate com pergunta de desempate: só as alternativas dos resultados empatados
export interface IPersonalityTie {
    question: string
    options: Array<{ resultId: string, text: string }>
}

export const outcomeResults = (outcome: IPersonalityOutcome): IPersonalityResult[] =>
    outcome.results?.length ? outcome.results : [outcome.result]
