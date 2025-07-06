'use client'
import ProfileSvg from '@/components/Icons/ProfileSvg'
import useErrors, { ErrorsState } from '@/hooks/useErrors'
import React, { FormEvent, useEffect, useState } from 'react'
import InputComponent from './input-component'
import { validEmail } from '@/utils/FormatText'
import { sendRecoveryEmail } from '@/app/[locale]/(auth)/rescuepassword/action'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useTranslations } from 'next-intl'

export default function RescuePasswordForm({locale}:{locale:string}) {
    const t = useTranslations('rescuePasswordFlow');
    
    const {getError, setError, concatErrors, hasErrors} = useErrors(),
        [email, setEmail] = useState<string>(''),
        [loading, setLoading] = useState<boolean>(false),
        [erroAuth, setErroAuth] = useState<ErrorsState>(),
        {setSucess} = useGlobalMessage()

    useEffect(()=>{
        if (email){
            if (!validEmail(email)) return setError('email', t('shared.errors.invalidEmail'));
            return setError('email', '')
        }
        return setError('email', '')
    }, [email, setError, t])

    useEffect(()=>{
        if (erroAuth) {
            if (locale === 'en'){
                setError(erroAuth.type, erroAuth.message)
            }else{
                setError(erroAuth.type, erroAuth.messagePT)
            }
        }
    }, [erroAuth, setError])
    
    const handleSubmit = (e:FormEvent) =>{
        e.preventDefault()
        setLoading(true)
        let errors: ErrorsState = {}
        if (!email) errors.email = t('shared.errors.emailRequired');
        concatErrors(errors)
        if (hasErrors(errors)) return setLoading(false)

        sendRecoveryEmail({email}).then(res=>{
            if(res.err) return setErroAuth(res.err)
            if(res.ok) return setSucess(t('rescueForm.successMessage'))
        }).finally(()=>setLoading(false))
    }

    return (
        <form onSubmit={handleSubmit} className='forgotpass-form'>
            <div className="first-part-section">
                <label htmlFor="email-id">{t('rescueForm.label')}</label>
                <InputComponent 
                    icon={<ProfileSvg/>}
                    type='email'
                    placeholder={t('shared.placeholderEmail')}
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    id='email-id'
                    autoFocus
                    error={getError('email')}
                />
            </div>
            <input type="submit" value={loading ? t('shared.buttonLoading') : t('shared.buttonSend')} disabled={loading} />
        </form>
    )
}