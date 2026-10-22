import { notFound } from 'next/navigation'
import { getPublicQuiz, withoutQuestions } from '@/utils/publicQuiz'
import { quizCanonicalUrl } from '@/utils/seo'
import PersonalityResultPage from '@/components/PersonalityResult/personality-result-page'
import GoogleAd from '@/components/Google/GoogleAd'

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

// mesmo bloco de anúncio da página de resultados
const RESULTS_AD_SLOT = '8751962602'

// Resultado do quiz de personalidade. O perfil vem do sessionStorage (gravado pelo taking);
// o layout já põe título, capa e a navegação.
export default async function PersonalityResult({ params }: IProps) {
    const { quizId } = await params
    const quiz = await getPublicQuiz(quizId)

    if (!quiz) notFound()

    return (
        <>
            <PersonalityResultPage quiz={withoutQuestions(quiz)} shareUrl={quizCanonicalUrl(quiz)} />
            <GoogleAd slot={RESULTS_AD_SLOT} />
        </>
    )
}
