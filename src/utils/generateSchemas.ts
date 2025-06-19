import IQuizes from "@/interfaces/IQuizes";

export function generateQuizSchema(quiz:IQuizes, baseUrl:string) {
    return {
        '@type': 'Quiz',
        'name': quiz.title,
        'description': quiz.description,
        'url': `${baseUrl}/quiz/${quiz.quizId}`,
        'potentialAction': [
        {
            '@type': 'ViewAction',
            'name': 'Quiz Page',
            'target': `${baseUrl}/quiz/${quiz.quizId}`
        },
        {
            '@type': 'TakeAction',
            'name': 'Take The Quiz',
            'target': `${baseUrl}/quiz/${quiz.quizId}/taking`
        }
        ]
    }
}