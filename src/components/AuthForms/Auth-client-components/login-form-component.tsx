'use client'
import MailSvg from '@/components/Icons/MailSvg'
import PadlockSvg from '@/components/Icons/PadlockSvg'
import useErrors, { ErrorsState } from '@/hooks/useErrors'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import React, { FormEvent, useEffect, useState } from 'react'
import CheckboxComponent from './checkbox-component'
import InputComponent from './input-component'

import { validEmail } from '@/utils/FormatText'
import '@/assets/styles/auth.scss'
import useLogin from '@/hooks/requests/auth-requests/useLogin'
import { useUser } from '@/contexts/userContext'

interface IProps{
    handleRegisterAndFinishQuiz?: () => void,
}

export default function LoginFormComponent({handleRegisterAndFinishQuiz, ...props}: IProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)

    const {getError, setError, concatErrors, hasErrors, resetErrors, inputsErrors} = useErrors()
    const [erroAuth, setErroAuth] = useState<ErrorsState>()
    const {setUserAccess} = useUser()

    const {login} = useLogin()

    const router = useRouter()

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
    useEffect(()=>{
        if (erroAuth) {
            setError(erroAuth.type, erroAuth.message)
        }
    }, [erroAuth])
    
    
    
    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        let errors: ErrorsState = {}

        if (!email) errors.email = "Email is required"
        if (!password) errors.password = 'Password is required'

        concatErrors(errors)
        if (hasErrors(errors)) return

        const UserObject = {
            user:{
                email, password
            }
        }
        
        login(JSON.stringify(UserObject))
            .then(res=>{
                setUserAccess(res.token)
                
                if (handleRegisterAndFinishQuiz) return handleRegisterAndFinishQuiz()
                else router.push('/home')
            })
            .catch(err=>{
                setErroAuth(err)
            })

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
