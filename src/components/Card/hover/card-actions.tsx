'use client'
import styles from './card-actions.module.scss'
import { Link } from '@/i18n/navigation'
import SaveQuizWidget from '@/components/widgets/save-quiz-widget'
import LinkEdit from './link-edit'
import { useTranslations } from 'next-intl'

interface IProps {
    userCreatorId: string,
    quizId: string
}

export default function CardActions({ userCreatorId, quizId }: IProps) {
    const t = useTranslations('quizCard.actions');

    return (
        <nav className={`${styles.navQuizHover} `}>
            <ul>
                <li><Link href={`/quiz/${quizId}`}>{t('quizPage')}</Link></li>
                <li><Link href={`/quiz/${quizId}/taking`}>{t('takeQuiz')}</Link></li>
                <li>
                    <SaveQuizWidget quizId={quizId} />
                </li>
                <LinkEdit quizId={quizId} userCreatorId={userCreatorId} />
            </ul>
        </nav>
    )
}