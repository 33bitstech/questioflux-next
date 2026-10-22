export interface IExamReviewAnswer {
    // texto da alternativa (quiz de texto) ou id dela (quiz de imagem)
    answer: string
    text?: string
    thumbnail?: string
    explanation?: string
    correct: boolean
}

// Correção de uma questão da prova. O backend só manda depois que a pessoa responde.
export default interface IExamReviewQuestion {
    questionId: string
    question: string
    image?: string
    answers: IExamReviewAnswer[]
    userAnswer: string
    correct: boolean
}
