'use client'
import MailSvg from '@/components/Icons/MailSvg'
import PadlockSvg from '@/components/Icons/PadlockSvg'
import useErrors, { ErrorsState } from '@/hooks/useErrors'
import {Link} from '@/i18n/navigation'
import {useRouter} from '@/i18n/navigation'
import React, { FormEvent, useEffect, useState } from 'react'
import CheckboxComponent from './checkbox-component'
import InputComponent from './input-component'
import { validEmail } from '@/utils/FormatText'
// @ts-ignore: SCSS side-effect import declaration
import '@/assets/styles/auth.scss'
import useLogin from '@/hooks/requests/auth-requests/useLogin'
import { useUser } from '@/contexts/userContext'
import { useTranslations } from 'next-intl'
import LoadingReq from '@/components/Loading/loading-req'
import GoogleAuthButton from './google-auth-button'
import { useGlobalMessage } from '@/contexts/globalMessageContext'

interface IProps{
    handleRegisterAndFinishQuiz?: () => void,
    locale: string,
    oauthError?: { code?: string; msgEN?: string; msgPT?: string }
}

export default function LoginFormComponent({handleRegisterAndFinishQuiz, oauthError, locale, ...props}: IProps) {
    const t = useTranslations('loginPage.form');
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)

    const {getError, setError, concatErrors, hasErrors} = useErrors()
    const [erroAuth, setErroAuth] = useState<ErrorsState>()
    const { fetchUser } = useUser()
    const {login} = useLogin()
    const router = useRouter()

    const { setError: setGlobalError } = useGlobalMessage()

    useEffect(() => {
        if (!oauthError?.code) return
        const msg = locale === 'pt' ? oauthError.msgPT : oauthError.msgEN
        if (msg) setGlobalError(decodeURIComponent(msg))
    }, [])

    useEffect(()=>{
        if (email){
            if (!validEmail(email)) return setError('email', t('errors.invalidEmail'));
            return setError('email', '')
        }
        return setError('email', '')
    }, [email, setError, t])

    useEffect(()=>{
        if (password) setError('password', '')
    },[password, setError])

    useEffect(()=>{
        if (erroAuth) {
            if (locale == 'en') {
                setError(erroAuth.type, erroAuth.message)
            }else{
                setError(erroAuth.type, erroAuth.messagePT)
            }
        }
    }, [erroAuth, setError])
    
    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setLoading(true)
        let errors: ErrorsState = {}

        if (!email) errors.email = t('errors.emailRequired');
        if (!password) errors.password = t('errors.passwordRequired');

        concatErrors(errors)
        if (hasErrors(errors)) return setLoading(false)

        const UserObject = { user:{ email, password } }
        
        login(JSON.stringify(UserObject))
            .then(async () => {
                await fetchUser()  // busca o user após cookie ser setado
                if (handleRegisterAndFinishQuiz) {
                    router.refresh()
                    return handleRegisterAndFinishQuiz()  // sem token
                }
                else router.push('/home')
            })
            .catch(err=>{
                setErroAuth(err)
            })
            .finally(()=>{
                setLoading(false)
            })
    }
    
    return (
        <form {...props} className='login-form' onSubmit={handleSubmit}>

            {loading && <LoadingReq loading={loading} />}

            <GoogleAuthButton locale={locale} separatorBelow />

            <div className="first-part-section">
                <InputComponent
                    type="email"
                    placeholder={t('placeholders.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={getError('email')}
                    icon={<MailSvg />}
                    autoFocus
                    autoComplete='email'
                    name='email'
                />
                <InputComponent
                    type={isPasswordHidden ? 'password' : 'text'}
                    placeholder={t('placeholders.password')}
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    error={getError('password')}
                    icon={<PadlockSvg/>}
                    autoComplete='current-password'
                    onToggleHidePassword={()=>setIsPasswordHidden(state=>!state)}
                    isPasswordHidden={isPasswordHidden}
                    name={locale === 'pt' ? 'senha' : 'password'}
                />
            </div>
            <div className="footer-form">
                <CheckboxComponent 
                    label={t('rememberMeLabel')}
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                />
                <Link href='/rescuepassword'>{t('forgotPasswordLink')}</Link>
            </div>
            
            <input type="submit" value={t('submitButton')} disabled={loading}/>
        </form>
    )
}