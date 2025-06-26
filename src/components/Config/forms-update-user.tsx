'use client'
import { useUser } from '@/contexts/userContext'
import { IUser } from '@/interfaces/IUser'
import { TStyles } from '@/types/stylesType'
import { FormEvent, useState } from 'react'
import InputEdit from './input-edit'
import ProfileImgEdit from './profile-img-edit'
import useUpdate from '@/hooks/requests/auth-requests/useUpdate'
import { useGlobalMessage } from '@/contexts/globalMessageContext'

interface IProps{
    styles: TStyles
}

export default function FormsUpdataUser({styles}: IProps) {
    const {user, token, setUserAccess} = useUser(),
        {updateUser, updateUserProfile} = useUpdate(),
        {setSucess} = useGlobalMessage(),

        [username, setUsername] = useState<string>(''),
        [email, setEmail] = useState<string>(''),
        [password, setPassword] = useState<string>(''),

        [imageValue, setImageValue] = useState<File | null>(),

        [editUsername, setEditUsername] = useState<boolean>(false),
        [editEmail, setEditEmail] = useState<boolean>(false),
        [editPassword, setEditPassword] = useState<boolean>(false)

    const preventSubmit = (e:FormEvent) => {
        e.preventDefault()
    },
    onFileChange = (file: File | null) => {
        setImageValue(file)
    },
    handleResetInputs = ()=>{
        setEditUsername(false)
        setEditEmail(false)
        setEditPassword(false)
    },
    handleSaveConfig = () => {
        if(!token) return
        if(username || email || password) {
            const user = {
                userName: username,
                userEmail: email,
                password
            }
    
            type UserKey = keyof typeof user;
            const userObject = Object.keys(user).reduce((prev, actual) => {
                const key = actual as UserKey;
                if (user[key]) prev[key] = user[key];
    
                return prev;
    
            }, {} as Partial<typeof user>);
    
            
            updateUser(JSON.stringify({user:userObject}), token).then(res=>{
                setUserAccess(res.token)
                setSucess('Saved successfully !')
            })
            .finally(()=>{
                handleResetInputs()
            })
        }

        if(!imageValue) return

        const formData = new FormData()
        formData.append('profileImg', imageValue)

        updateUserProfile(formData, token).then(res=>{
            setUserAccess(res.token)
            setSucess('Saved successfully !')
        })

    }

    return (
        <>
            <div className={styles.configurations}>
                <span>
                    <h2>Configurations</h2>
                    <p>Don’t forget to <span>save</span> before leaving the page.</p>
                </span>
                <button onClick={handleSaveConfig}>Save</button>
            </div>

            <div className={styles.account_info}>
                <h2>Account Info</h2>
                <form className={styles.form_account} onSubmit={preventSubmit}>
                    <InputEdit 
                        styles={styles}
                        toggleEditing={()=>setEditUsername(state=>!state)}
                        isEditing={editUsername}
                        label='username'
                        spanValue={user?.name}
                        value={username}
                        onChange={e=>setUsername(e.target.value)}
                        placeholder={user?.name}
                        labelValue='Username'
                        autoFocus
                    />
                    <InputEdit 
                        styles={styles}
                        toggleEditing={()=>setEditEmail(state=>!state)}
                        isEditing={editEmail}
                        label='email'
                        spanValue={user?.email}
                        value={email}
                        onChange={e=>setEmail(e.target.value)}
                        placeholder={user?.email}
                        labelValue='Email Address'
                        autoFocus
                    />
                    <InputEdit 
                        styles={styles}
                        toggleEditing={()=>setEditPassword(state=>!state)}
                        isEditing={editPassword}
                        label='password'
                        spanValue={'********'}
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                        placeholder={'********'}
                        labelValue='Password'
                        autoFocus
                    />
                </form>
            </div>

            <div className={styles.profile_image}>
                <div className={styles.profile_image_header}>
                    <h2>Profile Image</h2>
                    <p>Update your profile image</p>
                </div>
                <form onSubmit={preventSubmit}>
                    <ProfileImgEdit 
                        styles={styles}
                        onFileChange={onFileChange}
                    />
                </form>
            </div>
        </>
    )
}
