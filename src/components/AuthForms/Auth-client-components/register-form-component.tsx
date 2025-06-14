'use client'
import useErrors from '@/hooks/useErrors'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
import InputComponent from './input-component'
import ProfileSvg from '@/components/Icons/ProfileSvg'
import MailSvg from '@/components/Icons/MailSvg'
import PadlockSvg from '@/components/Icons/PadlockSvg'
import CheckboxComponent from './checkbox-component'
import UploadImageSvg from '@/components/Icons/UploadImageSvg'
import ProfileUploadComponent from './profile-upload'

interface IProps{
    handleRegisterAndFinishQuiz?: () => void,
    toLogin?: () => void,
    absolute: boolean
}

export default function RegisterFormComponent({handleRegisterAndFinishQuiz, toLogin, absolute, ...props}: IProps) {
    const {getError, setError} = useErrors(),
        [name, setName] = useState(''),
        [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        [confirmPassword, setConfirmPassword] = useState(''),
        [remember, setRemember] = useState(false),

        imageInput = useRef(null),
        [draftImage, setDraftImage] = useState(''),

        [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    
    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (handleRegisterAndFinishQuiz) handleRegisterAndFinishQuiz()
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
                />
                <InputComponent
                    type="email"
                    placeholder="email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={getError('email')}
                    icon={<MailSvg />}
                />
                <InputComponent
                    type='password'
                    placeholder='********'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    error={getError('password')}
                    icon={<PadlockSvg/>}
                />
                <InputComponent
                    type='password'
                    placeholder='repeat password'
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    error={getError('confirmPassword')}
                    icon={<PadlockSvg/>}
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
