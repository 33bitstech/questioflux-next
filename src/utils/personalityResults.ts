import { IPersonalityResult } from '@/interfaces/IQuizes'

// Resultado do quiz de personalidade enquanto é editado na capa. A imagem nova (file)
// sobe depois de salvar a capa, pelo upload próprio do resultado.
export interface ILocalPersonalityResult {
    resultId: string
    title: string
    description: string
    image?: string
    file?: File
    removeImage?: boolean
}

export const MIN_PERSONALITY_RESULTS = 2
export const MAX_PERSONALITY_RESULTS = 12

// uma cor por resultado, para ligar visualmente as alternativas das perguntas ao perfil.
// Verde e vermelho ficam por último: nos outros tipos eles significam certa e errada.
export const RESULT_COLORS = [
    '#0047FF', '#7A5AF8', '#F79009', '#EE46BC', '#06AED4', '#66C61C',
    '#FF692E', '#2E90FA', '#B54708', '#9E77ED', '#039855', '#D92D20',
]

export const resultColor = (index: number) => RESULT_COLORS[index % RESULT_COLORS.length]

let sequence = 0
export const newResultId = () => `r-${Date.now().toString(36)}-${(sequence++).toString(36)}`

export const emptyResult = (): ILocalPersonalityResult => ({ resultId: newResultId(), title: '', description: '' })

export const initialResults = () => [emptyResult(), emptyResult()]

export const toLocalResults = (results: IPersonalityResult[] = []): ILocalPersonalityResult[] =>
    results.map(({ resultId, title, description, image }) => ({ resultId, title, description: description ?? '', image }))

// o que vai no quizData: texto e ids (a imagem nunca vai por aqui)
export const toApiResults = (results: ILocalPersonalityResult[]) =>
    results.map(({ resultId, title, description, removeImage }) => ({
        resultId,
        title,
        description,
        ...(removeImage ? { removeImage: true } : {}),
    }))

// para saber se a capa tem alteração não salva
export const resultsSnapshot = (results: ILocalPersonalityResult[]) =>
    results.map(({ resultId, title, description, image, file, removeImage }) =>
        [resultId, title, description, removeImage ? '' : image ?? '', file?.name ?? ''].join('|'))
