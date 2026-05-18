'use client'
import { useUser } from '@/contexts/userContext'
import { FormEvent, useState } from 'react'
import InputEdit from './input-edit'
import ProfileImgEdit from './profile-img-edit'
import useUpdate from '@/hooks/requests/auth-requests/useUpdate'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useTranslations } from 'next-intl'
import { TStyles } from '@/types/stylesType'
import LoadingReq from '../Loading/loading-req'

interface IProps {
    styles: TStyles
}

export default function FormsUpdataUser({ styles }: IProps) {
    const t = useTranslations('configPage.updateForm');

    const { user, fetchUser } = useUser(),
        { updateUser, updateUserProfile } = useUpdate(),
        { setSucess } = useGlobalMessage(),
        [username, setUsername] = useState<string>(''),
        [email, setEmail] = useState<string>(''),
        [password, setPassword] = useState<string>(''),
        [imageValue, setImageValue] = useState<File | null>(),
        [editUsername, setEditUsername] = useState<boolean>(false),
        [editEmail, setEditEmail] = useState<boolean>(false),
        [editPassword, setEditPassword] = useState<boolean>(false),
        [loading, setLoading] = useState(false)

    const preventSubmit = (e: FormEvent) => e.preventDefault(),
        onFileChange = (file: File | null) => setImageValue(file),
        handleResetInputs = () => {
            setUsername('')
            setEmail('')
            setPassword('')
            setEditUsername(false)
            setEditEmail(false)
            setEditPassword(false)
        },
        handleSaveConfig = async () => {
            setLoading(true)

            try {
                let updated = false

                if (username || email || password) {
                    const userObj = { userName: username, userEmail: email, password }

                    type UserKey = keyof typeof userObj

                    const userObject = Object.keys(userObj).reduce((prev, actual) => {
                        const key = actual as UserKey

                        if (userObj[key]) {
                            prev[key] = userObj[key]
                        }

                        return prev
                    }, {} as Partial<typeof userObj>)

                    await updateUser(JSON.stringify({ user: userObject }))

                    updated = true
                }

                if (imageValue) {
                    const formData = new FormData()
                    formData.append('profileImg', imageValue)

                    await updateUserProfile(formData)

                    updated = true
                    setImageValue(null)
                }

                if (updated) {
                    await fetchUser()
                    setSucess(t('successMessage'))
                    handleResetInputs()
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

    return (
        <>
            <div className={styles.configurations}>
                <span>
                    <h2>{t('mainTitle')}</h2>
                    <p>{t.rich('saveWarning', { bold: (chunks) => <span>{chunks}</span> })}</p>
                </span>
                {(username || password || email || imageValue) && <>
                    <button onClick={handleSaveConfig}>{t('saveButton')}</button>
                </>}
            </div>

            {loading && <LoadingReq loading={loading} />}

            <div className={styles.account_info}>
                <h2>{t('accountInfoTitle')}</h2>
                <form className={styles.form_account} onSubmit={preventSubmit}>
                    <InputEdit
                        styles={styles}
                        toggleEditing={() => setEditUsername(state => { setUsername(''); return !state })}
                        isEditing={editUsername}
                        label='username'
                        spanValue={user?.name}
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder={user?.name}
                        labelValue={t('labels.username')}
                        autoFocus
                    />
                    <InputEdit
                        styles={styles}
                        toggleEditing={() => setEditEmail(state => { setEmail(''); return !state })}
                        isEditing={editEmail}
                        label='email'
                        spanValue={user?.email}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={user?.email}
                        labelValue={t('labels.email')}
                        autoFocus
                    />
                    <InputEdit
                        styles={styles}
                        toggleEditing={() => setEditPassword(state => { setPassword(''); return !state })}
                        isEditing={editPassword}
                        label='password'
                        spanValue={'********'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={'********'}
                        labelValue={t('labels.password')}
                        autoFocus
                    />
                </form>
            </div>

            <div className={styles.profile_image}>
                <div className={styles.profile_image_header}>
                    <h2>{t('profileImageTitle')}</h2>
                    <p>{t('profileImageSubtitle')}</p>
                </div>
                <form onSubmit={preventSubmit}>
                    <ProfileImgEdit styles={styles} onFileChange={onFileChange} />
                </form>
            </div>
        </>
    )
}