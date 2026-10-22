import { uploadPersonalityResultImage } from '@/app/[locale]/(quizGroup)/(createQuiz)/create/quiz/cover/actions'
import { ILocalPersonalityResult } from '@/utils/personalityResults'

// Depois de salvar a capa: sobe a imagem nova de cada resultado. Devolve quantas falharam.
export async function uploadResultImages(quizId: string, results: ILocalPersonalityResult[]): Promise<number> {
    let failed = 0

    for (const result of results) {
        if (!result.file) continue

        const formData = new FormData()
        formData.append('quizImg', result.file)

        const { ok } = await uploadPersonalityResultImage(quizId, result.resultId, formData)
        if (!ok) failed++
    }

    return failed
}
