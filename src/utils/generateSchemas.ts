import IQuizes from "@/interfaces/IQuizes";

export function generateExploreQuizSchema(quiz:IQuizes, baseUrl:string,domain:string) {
    return {
        '@type': 'Quiz',
        'name': quiz.title,
        'description': quiz.description,
        'url': `${baseUrl}/quiz/${quiz.quizId}`,
        "author": { "@type": "Person", "name": quiz.userCreatorName },
        "publisher": { "@id": `${domain}/#organization` },
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