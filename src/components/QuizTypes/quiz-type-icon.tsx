import CloverSvg from '@/components/Icons/CloverSvg'
import ExamSvg from '@/components/Icons/ExamSvg'
import SmileSvg from '@/components/Icons/SmileSvg'
import StrokeProfileSvg from '@/components/Icons/StrokeProfileSvg'
import { QuizKind } from '@/utils/quizKind'

// O mesmo ícone de cada tipo na home, em /create/quiz e nas páginas de cada tipo.
export default function QuizTypeIcon({ kind }: { kind: QuizKind | 'personality' }) {
    if (kind === 'exam') return <ExamSvg />
    if (kind === 'aboutMe') return <StrokeProfileSvg />
    if (kind === 'personality') return <SmileSvg />
    return <CloverSvg />
}
