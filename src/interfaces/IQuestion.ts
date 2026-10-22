export interface IAnswerExplanation {
    // texto da alternativa no quiz de texto, id dela no quiz de imagem
    answer: string
    text: string
}

export interface IAnswerResult {
    // alternativa (texto ou id) e o resultado de personalidade a que ela leva
    answer: string
    resultId: string
}

export default interface IQuestion {
    questionId: string
    question: string
    answers: Array<string | { answer: string, thumbnail: string, text: string }>
    correctAnswer: string,
    correctAnswerThumbnal?: string,
    image?: string,
    title?: string,
    // só chega na edição (dono do quiz) e na correção da prova
    explanations?: IAnswerExplanation[],
    // só chega na edição (dono do quiz)
    answerResults?: IAnswerResult[],
    created_at: Date,
    updated_at: Date
}
