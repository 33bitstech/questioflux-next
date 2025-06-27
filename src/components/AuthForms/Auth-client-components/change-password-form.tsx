'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import InputComponent from './input-component'
import ProfileSvg from '@/components/Icons/ProfileSvg'
import useErrors, { ErrorsState } from '@/hooks/useErrors'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { validEmail } from '@/utils/FormatText'
import { changePasswordByToken } from '@/app/(auth)/login/recovery/[token]/action'
import { useRouter } from 'next/navigation'

interface IProps{
    token: string
}

export default function ChangePassworForm({token}:IProps) {
    const {setError, getError, concatErrors,hasErrors} = useErrors(),
        [email, setEmail] = useState<string>(''),
        [password, setPassword] = useState<string>(''),
        [confirmPassword, setConfirmPassword] = useState<string>(''),
        [loading, setLoading] = useState<boolean>(false),

        [erroAuth, setErroAuth] = useState<ErrorsState>(),
        {setSucess, setError: setGlobalError} = useGlobalMessage(),
        route = useRouter()
    


    useEffect(()=>{
        if (email){
            if (!validEmail(email)) return setError('email', 'Enter a valid email address')
            return setError('email', '')
        }
        return setError('email', '')
    }, [email])
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


    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()
        setLoading(true)

        let errors: ErrorsState = {}
                
        if (!email) errors.email = "Email is required"
        if (!password) errors.password = "Password is required"
        if (!confirmPassword) errors.confirmPassword = "Repeat your password"

        concatErrors(errors)
        if (hasErrors(errors)) return setLoading(false)

        changePasswordByToken(email, token, password).then(res=>{
            if (res.err) return setGlobalError(res.err.message)
            if(res.ok) {
                setSucess('Password changed!')
                setTimeout(() => {
                    setLoading(false)
                    route.push('/login')
                }, 2000);
            }
        }).finally(()=>setLoading(false))

    }
    return (
        <form onSubmit={handleSubmit} className='forgotpass-form'>
            <div className="first-part-section">

                <label htmlFor="email-id">Enter your email.</label>
                <InputComponent 
                    icon={<ProfileSvg/>}
                    type='email'
                    placeholder='email@gmail.com'
                    onChange={e=>setEmail(e.target.value)}
                    value={email}
                    id='email-id'
                    autoFocus
                    error={getError('email')}
                />

                <label htmlFor="password-id">Enter your new password.</label>
                <InputComponent 
                    icon={<ProfileSvg/>}
                    type='password'
                    value={password}
                    placeholder='*********'
                    onChange={e=>setPassword(e.target.value)}
                    id='password-id'
                    error={getError('password')}
                />
                
                <label htmlFor="confirmPassword-id">Confirm your password.</label>
                <InputComponent 
                    icon={<ProfileSvg/>}
                    type='password'
                    value={confirmPassword}
                    placeholder='*********'
                    onChange={e=>setConfirmPassword(e.target.value)}
                    id='confirmPassword-id'
                    error={getError('confirmPassword')}
                />

            </div>
            <input type="submit" value={loading ? 'Loading' : 'Send'} disabled={loading} />
        </form>
    )
}
