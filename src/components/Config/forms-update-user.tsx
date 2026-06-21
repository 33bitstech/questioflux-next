'use client'
import { useUser } from '@/contexts/userContext'
import { FormEvent, useState } from 'react'
import InputEdit from './input-edit'
import ProfileImgEdit from './profile-img-edit'
import useUpdate from '@/hooks/requests/auth-requests/useUpdate'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useLocale, useTranslations } from 'next-intl'
import { TStyles } from '@/types/stylesType'
import LoadingReq from '../Loading/loading-req'
import { validateEmailCode } from '@/app/[locale]/(quizGroup)/profile/config/actions'

interface IProps {
    styles: TStyles
}

export default function FormsUpdataUser({ styles }: IProps) {
    const t = useTranslations('configPage.updateForm');
    const locale = useLocale()

    const { user, fetchUser } = useUser(),
        { updateUser, updateUserProfile } = useUpdate(),
        { setSucess, setError, setWarning } = useGlobalMessage(),
        [username, setUsername] = useState<string>(''),
        [email, setEmail] = useState<string>(''),
        [password, setPassword] = useState<string>(''),
        [imageValue, setImageValue] = useState<File | null>(),
        [editUsername, setEditUsername] = useState<boolean>(false),
        [editEmail, setEditEmail] = useState<boolean>(false),
        [editPassword, setEditPassword] = useState<boolean>(false),
        [loading, setLoading] = useState(false)

    const [showCodePopup, setShowCodePopup] = useState<boolean>(false)
    const [emailCode, setEmailCode] = useState<string>('')
    const [loadingCode, setLoadingCode] = useState<boolean>(false)

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
                let emailRequiresValidation = false

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

                    const res: any = await updateUser(JSON.stringify({ user: userObject }))

                    if (res?.emailEdited) {
                        emailRequiresValidation = true
                    }

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

                    if (emailRequiresValidation) {
                        setShowCodePopup(true)
                    } else {
                        setSucess(t('successMessage'))
                        handleResetInputs()
                    }

                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

    const handleValidateCode = async () => {
        if (emailCode.length < 6) return

        try {
            setLoadingCode(true)
            const res = await validateEmailCode(emailCode, locale, email)

            if (res.err) {
                setError(res.err)
                return
            }

            setWarning(t('emailValidationSent'))
            setShowCodePopup(false)
            setEmailCode('')
            handleResetInputs()
        } catch (error) {
            setError(t('emailValidationSentError'))
        } finally {
            setLoadingCode(false)
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

            {showCodePopup && (
                <div className={styles['cancel-subscription-popup-overlay']}>
                    <div className={styles['cancel-subscription-popup']}>
                        <h3>{t('emailCodePopup.title')}</h3>
                        <p>{t('emailCodePopup.description')}</p>

                        <input
                            type="text"
                            maxLength={6}
                            value={emailCode}
                            onChange={(e) => setEmailCode(e.target.value)}
                            placeholder="000000"
                            className={styles.email_code_input}
                        />

                        <div className={styles['cancel-subscription-popup-actions']}>
                            <button
                                onClick={() => setShowCodePopup(false)}
                                disabled={loadingCode}
                                className={styles['cancel-subscription-popup-secondary']}
                            >
                                {t('emailCodePopup.cancel')}
                            </button>
                            <button
                                onClick={handleValidateCode}
                                disabled={loadingCode || emailCode.length < 6}
                                className={styles.email_code_btn}
                            >
                                {loadingCode ? t('emailCodePopup.loading') : t('emailCodePopup.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}