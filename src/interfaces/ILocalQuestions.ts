export interface ILocalQuestions{
    id: string
    type: 'text' | 'image'
    title: string
    errorMessage?: string
    image?: File | string
    alternatives: Array<{
        id: string,
        answer?: string,
        thumbnail?: File | string
    }>
}