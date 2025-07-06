'use client'
import { deleteUser } from '@/app/[locale]/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import { TStyles } from '@/types/stylesType'
import { useRouter } from '@/i18n/navigation'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

interface IProps{
    styles: TStyles
}

export default function AccountWidgetContainer({styles}:IProps) {
    const t = useTranslations('configPage.accountWidget');
    const [verifyDeleteAcc, setVerifyDeleteAcc] = useState<boolean>(false),
        {token, logout} = useUser(),
        {setError} = useGlobalMessage(),
        router = useRouter()

    const handleDeleteAccount = () =>{
        deleteUser(`${token}`).then(res=>{
            if(res?.err) return setError(res.err)
            logout()
            router.push('/')
        })
    }

    return (
        <div className={styles.delete_area}>
            <button className={styles.delete} onClick={()=>setVerifyDeleteAcc(true)}>{t('deleteButton')}</button>
            {verifyDeleteAcc && (<>
                <div className={styles.optionsDelete}>
                    <span>{t('confirmation.title')}</span>
                    <div className={styles.actions}>
                        <button onClick={handleDeleteAccount}>{t('confirmation.confirmButton')}</button>
                        <button onClick={()=>setVerifyDeleteAcc(false)}>{t('confirmation.cancelButton')}</button>
                    </div>
                </div>
            </>)}
        </div>
    )
}