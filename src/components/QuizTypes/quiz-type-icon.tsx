import { BookOpen, Brain, Gauge, GraduationCap, HeartHandshake, ListChecks, LucideIcon, Swords, UserRound } from 'lucide-react'
import { QuizKind } from '@/utils/quizKind'

// O mesmo ícone de cada tipo nos filtros do Explorar, na home, em /create/quiz e nas páginas
// de cada tipo: ícone de traço (lucide) dentro de um círculo com borda fina.
export const QUIZ_KIND_ICONS: Record<QuizKind, LucideIcon> = {
    quiz: ListChecks,
    exam: GraduationCap,
    aboutMe: UserRound,
    personality: Brain,
    tournament: Swords,
    story: BookOpen,
    compatibility: HeartHandshake,
    scored: Gauge,
}

export default function QuizTypeIcon({ kind }: { kind: QuizKind }) {
    const Icon = QUIZ_KIND_ICONS[kind] ?? ListChecks
    return <Icon aria-hidden="true" />
}
