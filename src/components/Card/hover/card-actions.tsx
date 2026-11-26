'use client'
import styles from './card-actions.module.scss'
import { Link } from '@/i18n/navigation'
import SaveQuizWidget from '@/components/widgets/save-quiz-widget'
import LinkEdit from './link-edit'
import { useTranslations } from 'next-intl'
import { QuizKind } from '@/utils/quizKind'

interface IProps {
    userCreatorId: string,
    quizId: string,
    // torneio, história e teste: os textos usam o nome do formato, não "quiz"
    kind?: QuizKind
}

export default function CardActions({ userCreatorId, quizId, kind = 'quiz' }: IProps) {
    const t = useTranslations('quizCard.actions');

    return (
        <nav className={`${styles.navQuizHover} `}>
            <ul>
                <li><Link href={`/quiz/${quizId}`}>{t('quizPage', { kind })}</Link></li>
                <li><Link href={`/quiz/${quizId}/taking`}>{t('takeQuiz', { kind })}</Link></li>
                <li>
                    <SaveQuizWidget quizId={quizId} />
                </li>
                <LinkEdit quizId={quizId} userCreatorId={userCreatorId} kind={kind} />
            </ul>
        </nav>
    )
}