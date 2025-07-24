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
import '@/assets/styles/auth.scss'
import useLogin from '@/hooks/requests/auth-requests/useLogin'
import { useUser } from '@/contexts/userContext'
import { useTranslations } from 'next-intl'
import LoadingReq from '@/components/Loading/loading-req'

interface IProps{
    handleRegisterAndFinishQuiz?: (token:string) => void,
    locale: string
}

export default function LoginFormComponent({handleRegisterAndFinishQuiz, locale, ...props}: IProps) {
    const t = useTranslations('loginPage.form');
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)

    const {getError, setError, concatErrors, hasErrors} = useErrors()
    const [erroAuth, setErroAuth] = useState<ErrorsState>()
    const {setUserAccess} = useUser()
    const {login} = useLogin()
    const router = useRouter()

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
            .then(res=>{
                setUserAccess(res.token)
                if (handleRegisterAndFinishQuiz)  {
                    router.refresh()
                    return handleRegisterAndFinishQuiz(res.token)
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