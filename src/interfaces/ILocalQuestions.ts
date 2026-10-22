export interface ILocalQuestions {
    id: string
    type: 'text' | 'image'
    title: string
    errorMessage?: string
    image?: File | string
    isNew: boolean
    alternatives: Array<{
        id: string,
        answer?: string,
        thumbnail?: File | string
        text?: string
        // explicação da alternativa, mostrada na correção da prova
        explanation?: string
        // quiz de personalidade: o resultado a que a alternativa leva
        resultId?: string
        isNew: boolean
    }>
}
