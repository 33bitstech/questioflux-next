import { notFound } from 'next/navigation'
import { getPublicQuiz, withoutQuestions } from '@/utils/publicQuiz'
import ExamReviewPage from '@/components/ExamReview/exam-review-page'
import GoogleAd from '@/components/Google/GoogleAd'

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

// mesmo bloco de anúncio da página de resultados
const RESULTS_AD_SLOT = '8751962602'

// Correção da prova. Os dados vêm do sessionStorage (gravados pelo taking), então a página
// em si só precisa do quiz; o layout já põe título, capa e a navegação.
export default async function Review({ params }: IProps) {
    const { quizId } = await params
    const quiz = await getPublicQuiz(quizId)

    if (!quiz) notFound()

    return (
        <>
            <ExamReviewPage quiz={withoutQuestions(quiz)} adSlot={RESULTS_AD_SLOT} />
            <GoogleAd slot={RESULTS_AD_SLOT} />
        </>
    )
}
