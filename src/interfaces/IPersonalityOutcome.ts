import { IPersonalityResult } from './IQuizes'

// Resultado de quem terminou um quiz de personalidade (vem do backend ao enviar as respostas).
export default interface IPersonalityOutcome {
    result: IPersonalityResult
    // quanto deu cada resultado nas respostas da pessoa, do maior para o menor
    breakdown: Array<{ resultId: string, title: string, image?: string, count: number, percent: number }>
    timing: number
    // quantas pessoas já fizeram e quantos % delas tiveram este mesmo resultado
    plays: number
    sameResultPercent: number
}
