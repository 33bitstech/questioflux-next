'use client'
import { deleteUser } from '@/app/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import { TStyles } from '@/types/stylesType'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface IProps{
    styles: TStyles
}

export default function AccountWidgetContainer({styles}:IProps) {
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
            <button className={styles.delete} onClick={()=>setVerifyDeleteAcc(true)}>Delete Account</button>
            {verifyDeleteAcc && (<>
                <div className={styles.optionsDelete}>
                    <span>Are you sure?</span>
                    <div className={styles.actions}>
                        <button onClick={handleDeleteAccount}>Yes, delete my account</button>
                        <button onClick={()=>setVerifyDeleteAcc(false)}>No, don’t delete my account</button>
                    </div>
                </div>
            </>)}
        </div>
    )
}
