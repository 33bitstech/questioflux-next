'use client'

import { useState } from "react"
import WarningReset from "../widgets/warning-reset"
import styles from './delete-quiz.module.scss'
import { useTranslations } from "next-intl"
import { deleteQuiz } from "./delete-action"
import { useRouter } from "@/i18n/navigation"
import LoadingReq from "../Loading/loading-req"
import { useGlobalMessage } from "@/contexts/globalMessageContext"
import { QuizKind } from "@/utils/quizKind"

interface IProps {
    quizId: string
    // torneio, história e teste: os textos usam o nome do formato, não "quiz"
    kind?: QuizKind
}

export default function DeleteQuiz({ quizId, kind = 'quiz' }: IProps) {
    const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setSucess, setError } = useGlobalMessage()
    const t = useTranslations('deleteQuiz'),
        router = useRouter()

    const toggleDeleteMenu = () => setIsDeleteMenuOpen(state => !state)

    const handleDeleteQuiz = () => {
        setLoading(true)
        deleteQuiz(quizId)
            .then(() => {
                setSucess(t('sucess', { kind }))
                router.push('/')
            })
            .catch((err) => {
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }

    return (
        <>
            <button className={styles.delete_button} type="button" onClick={toggleDeleteMenu}>
                {t('button', { kind })}
            </button>

            {loading && <LoadingReq loading={loading} />}

            {isDeleteMenuOpen && (
                <WarningReset
                    cancelFunction={() => setIsDeleteMenuOpen(false)}
                    confirmFunction={handleDeleteQuiz}
                    cancelValue={t('menu.cancel')}
                    confirmValue={t('menu.confirm')}
                    description={t('menu.desc', { kind })}
                    title={t('menu.title')}
                />
            )}
        </>
    )
}