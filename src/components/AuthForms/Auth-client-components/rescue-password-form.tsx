'use client'
import ProfileSvg from '@/components/Icons/ProfileSvg'
import useErrors, { ErrorsState } from '@/hooks/useErrors'
import React, { FormEvent, useEffect, useState } from 'react'
import InputComponent from './input-component'
import { validEmail } from '@/utils/FormatText'
import { sendRecoveryEmail } from '@/app/(auth)/rescuepassword/action'
import { useGlobalMessage } from '@/contexts/globalMessageContext'

export default function RescuePasswordForm() {
    const {getError, setError, concatErrors, hasErrors} = useErrors(),
        [email, setEmail] = useState<string>(''),
        [loading, setLoading] = useState<boolean>(false),
        [erroAuth, setErroAuth] = useState<ErrorsState>(),
        {setSucess} = useGlobalMessage()


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
    
    const handleSubmit = (e:FormEvent) =>{
        e.preventDefault()
        setLoading(true)

        let errors: ErrorsState = {}
        
        if (!email) errors.email = "Email is required"

        concatErrors(errors)
        if (hasErrors(errors)) return setLoading(false)

        sendRecoveryEmail({email}).then(res=>{
            if(res.err) return setErroAuth(res.err)
            if(res.ok) return setSucess('Check your email in a few moments, check your email to obtain the password reset token.')
        }).finally(()=>setLoading(false))
    }
    return (
        <form onSubmit={handleSubmit} className='forgotpass-form'>
            <div className="first-part-section">
                <label htmlFor="email-id">Enter your email to reset your password.</label>
                <InputComponent 
                    icon={<ProfileSvg/>}
                    type='email'
                    placeholder='email@gmail.com'
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    id='email-id'
                    autoFocus
                    error={getError('email')}
                />
            </div>
            <input type="submit" value={loading ? 'Loading' : 'Send'} disabled={loading} />
        </form>
    )
}
