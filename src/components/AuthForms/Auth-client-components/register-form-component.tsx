'use client'
import useErrors, { ErrorsState } from '@/hooks/useErrors'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import InputComponent from './input-component'
import ProfileSvg from '@/components/Icons/ProfileSvg'
import MailSvg from '@/components/Icons/MailSvg'
import PadlockSvg from '@/components/Icons/PadlockSvg'
import CheckboxComponent from './checkbox-component'
import UploadImageSvg from '@/components/Icons/UploadImageSvg'
import ProfileUploadComponent from './profile-upload'
import { cleanString, validEmail } from '@/utils/FormatText'
import useRegister from '@/hooks/requests/auth-requests/useRegister'
import { useRouter } from 'next/navigation'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'

interface IProps{
    handleRegisterAndFinishQuiz?: () => void,
    toLogin?: () => void,
    absolute: boolean
}

export default function RegisterFormComponent({handleRegisterAndFinishQuiz, toLogin, absolute, ...props}: IProps) {
    const {getError, setError, concatErrors, hasErrors} = useErrors(),
        [name, setName] = useState(''),
        [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        [confirmPassword, setConfirmPassword] = useState(''),
        [remember, setRemember] = useState(false),

        [profileImageFile, setProfileImageFile] = useState<File | null>(null),
        [erroAuth, setErroAuth] = useState<ErrorsState>(),
        {register} = useRegister(),
        {setUserAccess} = useUser(),
        router = useRouter(),
        {setError:setGlobalError} = useGlobalMessage()
        
        
    useEffect(()=>{
        if (erroAuth) {
            setError(erroAuth.type, erroAuth.message)
        }
    }, [erroAuth])
    useEffect(()=>{
        if (confirmPassword && password) {
            if (confirmPassword !== password) return setError('confirmPassword', 'Passwords do not match')
            return setError('confirmPassword', '')
        }
        return setError('confirmPassword', '')
    },[confirmPassword, password])
    useEffect(()=>{
        if (email){
            if (!validEmail(email)) return setError('email', 'Enter a valid email address')
            return setError('email', '')
        }
        return setError('email', '')
    }, [email])
    useEffect(()=>{
        if (name) {
            setError('name', '')
        }
        if (password) {
            setError('password', '')
        }
    },[name, password])

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let errors: ErrorsState = {}

        if (!name) errors.name = 'name field is required'
        if (!email) errors.email = 'email is required'
        if (!password) errors.password = 'password field is required'
        if (!confirmPassword) errors.confirmPassword = 'confirm password is required'

        concatErrors(errors)
        if (hasErrors(errors)) return
 
        const UserObject = {
            user:{
                name, email: cleanString(email), password
            }
        }

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
    }


    return (
        <form onSubmit={handleSubmit} className='formularioAuth' {...props}>
            <div className="first-part-section">
                <InputComponent
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={getError('name')}
                    icon={<ProfileSvg />}
                    autoComplete='username'
                />
                <InputComponent
                    type="email"
                    placeholder="email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={getError('email')}
                    icon={<MailSvg />}
                    autoComplete='email'
                />
                <InputComponent
                    type='password'
                    placeholder='********'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    error={getError('password')}
                    icon={<PadlockSvg/>}
                    autoComplete='current-password'
                />
                <InputComponent
                    type='password'
                    placeholder='repeat password'
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    error={getError('confirmPassword')}
                    icon={<PadlockSvg/>}
                    autoComplete='current-password'
                />
                
                <div className='footer-form'>
                    <CheckboxComponent 
                        label="Remember me"
                        checked={remember}
                        onChange={() => setRemember(!remember)}
                    />

                    {!absolute 
                        ? <p>Already have an Account? <Link href='/login'>Login</Link></p> 
                        : <p>Already have an Account? <button type='button' onClick={toLogin}>Login</button></p>
                    }
                    
                </div>

                <input type="submit" value='Register' />
            </div>
            <div className='second-part-section'>
                <ProfileUploadComponent
                    onFileChange={setProfileImageFile}
                />
            </div>
        </form>
    )
}
