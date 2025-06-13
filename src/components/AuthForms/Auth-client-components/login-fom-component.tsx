'use client'
import MailSvg from '@/components/Icons/MailSvg'
import PadlockSvg from '@/components/Icons/PadlockSvg'
import useCustomCookies from '@/hooks/useCustomCookies'
import useErrors from '@/hooks/useErrors'
import Link from 'next/link'
import React, { FormEvent, useEffect, useState } from 'react'
import CheckboxComponent from './checkbox-component'
import InputComponent from './input-component'

import { validEmail } from '@/utils/FormatText'

interface IProps{
    handleRegisterAndFinishQuiz: () => void,
}

export default function LoginFormComponent({handleRegisterAndFinishQuiz, ...props}: IProps) {
    const [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        [remember, setRemember] = useState(false),

        {getError, setError, concatErrors, hasErrors, resetErrors, inputsErrors} = useErrors(),
        {cookie, setToken} = useCustomCookies('user')

    useEffect(()=>{
        if (email){
            if (!validEmail(email)) return setError('email', 'Enter a valid email address')
            return setError('email', '')
        }
        return setError('email', '')
    }, [email, setError])
    useEffect(()=>{
        if (password) setError('password', '')
    },[password, setError])



    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        handleRegisterAndFinishQuiz()
    }

    return (
        <form {...props} className='login-form' onSubmit={handleSubmit}>
            <div className="first-part-section">
                <InputComponent
                    type="email"
                    placeholder="email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={getError('email')}
                    icon={<MailSvg />}
                    autoFocus
                />
                <InputComponent
                    type='password'
                    placeholder='********'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    error={getError('password')}
                    icon={<PadlockSvg/>}
                />
            </div>
            <div className="footer-form">
                <CheckboxComponent 
                    label="Remember me"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                />
                <Link href='/rescuepassword'>Forgot Password?</Link>
            </div>
            
            <input type="submit" value="Login" />
        </form>
    )
}
