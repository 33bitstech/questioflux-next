'use client'
import useGettingQuiz from "@/hooks/requests/quiz-requests/useGettingQuiz"
import styles from '../../../app/[locale]/(quizGroup)/profile/config/config.module.scss'
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useGlobalMessage } from "@/contexts/globalMessageContext"
import { useUser } from "@/contexts/userContext"
import { useRouter } from "@/i18n/navigation"
import { deleteQuiz } from "../delete-action"
import WarningReset from "@/components/widgets/warning-reset"
import LoadingReq from "@/components/Loading/loading-req"
import IQuizes from "@/interfaces/IQuizes"

interface IProps {
    quizzes: IQuizes[]
}

export default function DeleteContainer({quizzes}: IProps) {
    const t = useTranslations('deleteMultiple')
    const tW = useTranslations('deleteQuiz')

    const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false)
    const [wantDeleteQuizzes, setWantDeleteQuizzes] = useState(false)
    const [loading, setLoading] = useState(false)
    const {setSucess, setError} = useGlobalMessage()
    const {token} = useUser()
    const router = useRouter()

    const toggleDeleteMenu = () =>{
        setIsDeleteMenuOpen(state=>!state)
    }
    const closeAll = () =>{
        setIsDeleteMenuOpen(false)
        setWantDeleteQuizzes(false)
    }
    const handleDeleteQuizzes = async () =>{
        if(!quizzes) return
        setLoading(true)
        try {
            const deleteQuizPromises = quizzes.map((quiz:IQuizes)=> deleteQuiz(quiz.quizId, String(token)))

            await Promise.all(deleteQuizPromises)

            setSucess(t('sucess'))
            router.push('/')
            setLoading(false)
        } catch (err) {
            console.log(err)
            if (typeof(err) === 'string') setError(err)
            setLoading(false)
        }
    }
    if(!quizzes || quizzes?.length === 0) return null
    return (
        <>
            <div className={styles.delete_area}>
                <button className={styles.delete} onClick={()=>setWantDeleteQuizzes(true)}>{t('mainbutton')}</button>
                {wantDeleteQuizzes && (<>
                    <div className={styles.optionsDelete}>
                        <span>{t('message')}</span>
                        <div className={styles.actions}>
                            <button onClick={toggleDeleteMenu}>{t('confirm')}</button>
                            <button onClick={closeAll}>{t('cancel')}</button>
                        </div>
                    </div>
                </>)}
            </div>

            {isDeleteMenuOpen && (
                <WarningReset
                    cancelFunction={closeAll}
                    confirmFunction={handleDeleteQuizzes}
                    cancelValue={t('cancel')}
                    confirmValue={t('confirm')}
                    description={t('message')}
                    title={tW('menu.title')}
                />
            )}

            {loading && (
                <LoadingReq loading={loading}/>
            )}
        </>
    )
}