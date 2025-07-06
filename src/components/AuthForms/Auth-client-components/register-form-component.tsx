'use client'
import useErrors, { ErrorsState } from '@/hooks/useErrors'
import {Link} from '@/i18n/navigation'
import React, { FormEvent, useEffect, useState } from 'react'
import InputComponent from './input-component'
import ProfileSvg from '@/components/Icons/ProfileSvg'
import MailSvg from '@/components/Icons/MailSvg'
import PadlockSvg from '@/components/Icons/PadlockSvg'
import CheckboxComponent from './checkbox-component'
import ProfileUploadComponent from './profile-upload'
import { cleanString, validEmail } from '@/utils/FormatText'
import useRegister from '@/hooks/requests/auth-requests/useRegister'
import { useRouter } from '@/i18n/navigation'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import { useTranslations } from 'next-intl' // 1. Importar o hook
import { useLocale } from 'next-intl'

interface IProps{
    handleRegisterAndFinishQuiz?: () => void,
    toLogin?: () => void,
    absolute: boolean
}

export default function RegisterFormComponent({handleRegisterAndFinishQuiz, toLogin, absolute, ...props}: IProps) {
    const locale = useLocale()
    const t = useTranslations('registerForm'); // 2. Inicializar o hook com o nosso namespace

    const {getError, setError, concatErrors, hasErrors} = useErrors(),
        [name, setName] = useState(''),
        [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        [confirmPassword, setConfirmPassword] = useState(''),
        [remember, setRemember] = useState(false),
        [loading, setLoading] = useState<boolean>(false),
        [profileImageFile, setProfileImageFile] = useState<File | null>(null),
        [erroAuth, setErroAuth] = useState<ErrorsState>(),
        {register} = useRegister(),
        {setUserAccess} = useUser(),
        router = useRouter(),
        {setError:setGlobalError} = useGlobalMessage()
        
    useEffect(()=>{
        if (erroAuth) {
            if (locale === 'en'){
                setError(erroAuth.type, erroAuth.message)
            }else{
                setError(erroAuth.type, erroAuth.messagePt)
            }
        }
    }, [erroAuth])

    // 3. Traduzir as mensagens de erro na lógica
    useEffect(()=>{
        if (confirmPassword && password) {
            if (confirmPassword !== password) return setError('confirmPassword', t('errors.passwordsDoNotMatch'));
            return setError('confirmPassword', '')
        }
        return setError('confirmPassword', '')
    },[confirmPassword, password])

    useEffect(()=>{
        if (email){
            if (!validEmail(email)) return setError('email', t('errors.invalidEmail'));
            return setError('email', '')
        }
        return setError('email', '')
    }, [email])
    
    useEffect(()=>{
        if (name) setError('name', '')
        if (password) setError('password', '')
    },[name, password])

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        let errors: ErrorsState = {}

        if (!name) errors.name = t('errors.nameRequired');
        if (!email) errors.email = t('errors.emailRequired');
        if (!password) errors.password = t('errors.passwordRequired');
        if (!confirmPassword) errors.confirmPassword = t('errors.confirmPasswordRequired');

        concatErrors(errors)
        if (hasErrors(errors)) return setLoading(false)

        const UserObject = { user:{ name, email: cleanString(email), password } }
        const formData = new FormData()
        formData.append('register', JSON.stringify(UserObject))
        if (profileImageFile) formData.append('image', profileImageFile)

        register(formData)
            .then(res=>{
                setUserAccess(res.token || res.res.token)
                if (res.errImage) setGlobalError(res.errImage.message)
                if (handleRegisterAndFinishQuiz) return handleRegisterAndFinishQuiz()
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
        // 4. Traduzir os textos no JSX
        <form onSubmit={handleSubmit} className='formularioAuth' {...props}>
            <div className="first-part-section">
                <InputComponent
                    type="text"
                    placeholder={t('placeholders.username')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={getError('name')}
                    icon={<ProfileSvg />}
                    autoComplete='username'
                />
                <InputComponent
                    type="email"
                    placeholder={t('placeholders.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={getError('email')}
                    icon={<MailSvg />}
                    autoComplete='email'
                />
                <InputComponent
                    type='password'
                    placeholder={t('placeholders.password')}
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    error={getError('password')}
                    icon={<PadlockSvg/>}
                    autoComplete='current-password'
                />
                <InputComponent
                    type='password'
                    placeholder={t('placeholders.confirmPassword')}
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    error={getError('confirmPassword')}
                    icon={<PadlockSvg/>}
                    autoComplete='current-password'
                />
                
                <div className='footer-form'>
                    <CheckboxComponent 
                        label={t('rememberMeLabel')}
                        checked={remember}
                        onChange={() => setRemember(!remember)}
                    />

                    {!absolute 
                        ? <p>{t('loginPrompt')} <Link href='/login'>{t('loginLink')}</Link></p> 
                        : <p>{t('loginPrompt')} <button type='button' onClick={toLogin}>{t('loginLink')}</button></p>
                    }
                </div>

                <input type="submit" value={t('submitButton')} disabled={loading} />
            </div>
            <div className='second-part-section'>
                <ProfileUploadComponent
                    onFileChange={setProfileImageFile}
                />
            </div>
        </form>
    )
}