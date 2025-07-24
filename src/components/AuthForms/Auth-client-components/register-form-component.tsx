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
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import LoadingReq from '@/components/Loading/loading-req'

interface IProps{
    handleRegisterAndFinishQuiz?: (token:string) => void,
    toLogin?: () => void,
    absolute: boolean
}

export default function RegisterFormComponent({handleRegisterAndFinishQuiz, toLogin, absolute, ...props}: IProps) {
    const locale = useLocale()
    const t = useTranslations('registerForm');

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
        [isPasswordHidden, setIsPasswordHidden] = useState(true),
        [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true),
        {setError:setGlobalError} = useGlobalMessage()
        
    useEffect(()=>{
        if (erroAuth) {
            if (locale === 'en'){
                setError(erroAuth.type, erroAuth.message)
            }else{
                setError(erroAuth.type, erroAuth.messagePT)
            }
        }
    }, [erroAuth])

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
                if (handleRegisterAndFinishQuiz){
                    router.refresh()
                    return handleRegisterAndFinishQuiz(res.token || res.res.token)
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
        <form onSubmit={handleSubmit} className='formularioAuth' {...props}>

            {loading && <LoadingReq loading={loading} />}
            
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
                <InputComponent
                    type={isConfirmPasswordHidden ? 'password' : 'text'}
                    placeholder={t('placeholders.confirmPassword')}
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    error={getError('confirmPassword')}
                    icon={<PadlockSvg/>}
                    autoComplete='current-password'
                    onToggleHidePassword={()=>setIsConfirmPasswordHidden(state=>!state)}
                    isPasswordHidden={isConfirmPasswordHidden}
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