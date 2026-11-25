// Valores antigos do filtro de tipo do Explorar (?typeQuiz=Personality, image/RW...) ->
// parâmetro typeQuiz da busca no backend. O filtro hoje usa ?type= (utils/exploreFilters);
// estes continuam valendo em links salvos. Os tipos são o campo kind; "Imagem" é o formato
// (campo type).
const API_TYPE_BY_FILTER: Record<string, string> = {
    'Right and Wrong': 'quiz',
    'Exam': 'exam',
    'About me': 'aboutMe',
    'Personality': 'personality',
    'Image': 'image/RW',
    'quiz': 'quiz',
    'exam': 'exam',
    'aboutMe': 'aboutMe',
    'personality': 'personality',
    'tournament': 'tournament',
    'story': 'story',
    'compatibility': 'compatibility',
    'scored': 'scored',
    'image/RW': 'image/RW',
    'default/RW': 'default/RW',
}

export const getApiTypeQuiz = (typeQuiz?: string) =>
    typeQuiz ? API_TYPE_BY_FILTER[typeQuiz] ?? '' : ''
