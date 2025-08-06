'use client'

import { useState } from "react"
import WarningReset from "../widgets/warning-reset"
import styles from './delete-quiz.module.scss'
import { useTranslations } from "next-intl"
import { deleteQuiz } from "./delete-action"
import { useUser } from "@/contexts/userContext"
import { useRouter } from "@/i18n/navigation"
import LoadingReq from "../Loading/loading-req"
import { useGlobalMessage } from "@/contexts/globalMessageContext"

interface IProps {
    quizId: string
}

export default function DeleteQuiz({quizId}: IProps) {
    const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const {setSucess, setError} = useGlobalMessage()
    const t = useTranslations('deleteQuiz'),
        {token} = useUser(),
        router = useRouter()

    const toggleDeleteMenu = () =>{
        setIsDeleteMenuOpen(state=>!state)
    }
    const handleDeleteQuiz = () =>{
        setLoading(true)
        deleteQuiz(quizId, String(token))
            .then(res=>{
                setSucess(t('sucess'))
                router.push('/')
            })
            .catch((err)=>{
                setError(err.message)
            })
            .finally(()=>{
                setLoading(false)
            })
    }

    return (
        <>
            <button className={styles.delete_button} type="button" onClick={toggleDeleteMenu}>
                {t('button')}
            </button>

            {loading && (
                <LoadingReq loading={loading}/>
            )}

            {isDeleteMenuOpen && (
                <WarningReset
                    cancelFunction={()=>setIsDeleteMenuOpen(false)}
                    confirmFunction={handleDeleteQuiz}
                    cancelValue={t('menu.cancel')}
                    confirmValue={t('menu.confirm')}
                    description={t('menu.desc')}
                    title={t('menu.title')}
                />
            )}
        </>
    )
}