import { TTypeQuiz } from '@/types/quizzesType'

// Filtro "Tipo de quiz" do Explorar -> parâmetro typeQuiz da busca no backend.
// Os tipos (prova, sobre mim, personalidade...) são o campo kind; "Imagem" é o formato
// (campo type). Os valores antigos (image/RW, default/RW) continuam valendo em links salvos.
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
    'image/RW': 'image/RW',
    'default/RW': 'default/RW',
}

export const getApiTypeQuiz = (typeQuiz?: TTypeQuiz | string) =>
    typeQuiz ? API_TYPE_BY_FILTER[typeQuiz] ?? '' : ''
