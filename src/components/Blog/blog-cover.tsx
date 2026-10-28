import { GraduationCap, Heart, LayoutGrid, Sparkles } from 'lucide-react'
import { QuizKind } from '@/utils/quizKind'
import styles from '@/app/[locale]/(quizGroup)/blog/blog.module.scss'

const ICONS: Record<QuizKind, typeof Sparkles> = {
    personality: Sparkles,
    exam: GraduationCap,
    quiz: LayoutGrid,
    aboutMe: Heart,
}

interface IProps {
    kind: QuizKind
    size?: 'card' | 'featured' | 'hero'
}

// Capa ilustrada do artigo: gradiente e ícone do tipo de quiz do assunto (sem foto para manter)
export default function BlogCover({ kind, size = 'card' }: IProps) {
    const Icon = ICONS[kind]

    return (
        <div className={`${styles.cover} ${styles[`cover_${kind}`]} ${styles[`cover_${size}`]}`} aria-hidden="true">
            <span className={styles.cover_ring} />
            <span className={styles.cover_dot} />
            <Icon />
        </div>
    )
}
