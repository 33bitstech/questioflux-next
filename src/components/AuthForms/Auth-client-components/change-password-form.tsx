'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import InputComponent from './input-component'
import ProfileSvg from '@/components/Icons/ProfileSvg'
import useErrors, { ErrorsState } from '@/hooks/useErrors'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { validEmail } from '@/utils/FormatText'
import { changePasswordByToken } from '@/app/[locale]/(auth)/login/recovery/[token]/action'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface IProps{
    token: string,
    locale: string
}

export default function ChangePasswordForm({token,locale}:IProps) {
    const t = useTranslations('rescuePasswordFlow');

    const {setError, getError, concatErrors, hasErrors} = useErrors(),
        [email, setEmail] = useState<string>(''),
        [password, setPassword] = useState<string>(''),
        [confirmPassword, setConfirmPassword] = useState<string>(''),
        [loading, setLoading] = useState<boolean>(false),
        [erroAuth, setErroAuth] = useState<ErrorsState>(),
        {setSucess, setError: setGlobalError} = useGlobalMessage(),
        route = useRouter()

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

    useEffect(()=>{
        if (confirmPassword && password) {
            if (confirmPassword !== password) return setError('confirmPassword', t('shared.errors.passwordsDoNotMatch'));
            return setError('confirmPassword', '')
        }
        return setError('confirmPassword', '')
    },[confirmPassword, password, setError, t])

    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()
        setLoading(true)
        let errors: ErrorsState = {}
        if (!email) errors.email = t('shared.errors.emailRequired');
        if (!password) errors.password = t('shared.errors.passwordRequired');
        if (!confirmPassword) errors.confirmPassword = t('shared.errors.confirmPasswordRequired');

        concatErrors(errors)
        if (hasErrors(errors)) return setLoading(false)

        changePasswordByToken(email, token, password).then(res=>{
            if (res.err) return setGlobalError(res.err.message)
            if(res.ok) {
                setSucess(t('changePasswordPage.successMessage'))
                setTimeout(() => {
                    setLoading(false)
                    route.push('/login')
                }, 2000);
            }
        }).catch(()=>setLoading(false)) // Changed finally to catch to avoid issues
    }
    
    return (
        <form onSubmit={handleSubmit} className='forgotpass-form'>
            <div className="first-part-section">
                <label htmlFor="email-id">{t('changePasswordPage.labels.email')}</label>
                <InputComponent 
                    icon={<ProfileSvg/>}
                    type='email'
                    placeholder={t('shared.placeholderEmail')}
                    onChange={e=>setEmail(e.target.value)}
                    value={email}
                    id='email-id'
                    autoFocus
                    error={getError('email')}
                />

                <label htmlFor="password-id">{t('changePasswordPage.labels.newPassword')}</label>
                <InputComponent 
                    icon={<ProfileSvg/>}
                    type='password'
                    value={password}
                    placeholder={t('shared.placeholderPassword')}
                    onChange={e=>setPassword(e.target.value)}
                    id='password-id'
                    error={getError('password')}
                />
                
                <label htmlFor="confirmPassword-id">{t('changePasswordPage.labels.confirmPassword')}</label>
                <InputComponent 
                    icon={<ProfileSvg/>}
                    type='password'
                    value={confirmPassword}
                    placeholder={t('shared.placeholderConfirmPassword')}
                    onChange={e=>setConfirmPassword(e.target.value)}
                    id='confirmPassword-id'
                    error={getError('confirmPassword')}
                />
            </div>
            <input type="submit" value={loading ? t('shared.buttonLoading') : t('shared.buttonSend')} disabled={loading} />
        </form>
    )
}