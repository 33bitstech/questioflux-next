'use client'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { Copy } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { useUser } from '@/contexts/userContext'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import usePopupAuth from '@/hooks/usePopupAuth'
import { createFromTemplate } from '@/app/[locale]/(quizGroup)/(createQuiz)/create/experiences/actions'
import { getLocalizedMessage } from '@/utils/getLocalizedMessage'
import { trackEvent } from '@/utils/analytics'
import { ExperienceKind } from '@/utils/quizKind'
import RegisterComponent from '../AuthForms/register-component'
import LoginComponent from '../AuthForms/login-component'
import LoadingReq from '../Loading/loading-req'
import styles from './experiences.module.scss'

interface IProps {
    kind: ExperienceKind
    className?: string
}

// "Usar este modelo": cria um rascunho privado com o conteúdo do exemplo (no idioma da página)
// e abre o editor. Sem conta, pede cadastro ou login antes.
export default function UseTemplateButton({ kind, className }: IProps) {
    const t = useTranslations('experiencePlay.demo')
    const locale = useLocale()
    const router = useRouter()
    const { user, fetchUser } = useUser()
    const { setError } = useGlobalMessage()
    const { typePopup, toLogin, toRegister } = usePopupAuth()
    const [showAuth, setShowAuth] = useState(false)
    const [loading, setLoading] = useState(false)

    const create = async () => {
        setLoading(true)
        try {
            const result = await createFromTemplate(kind, locale)
            if (!result.ok) {
                setError(getLocalizedMessage(result.error, locale))
                return
            }
            trackEvent('template_use', { quiz_kind: kind, quiz_id: result.quizId })
            router.push(`/create/quiz/questions/${result.quizId}`)
        } finally {
            setLoading(false)
        }
    }

    const handleClick = () => {
        if (loading) return
        if (!user) return setShowAuth(true)
        void create()
    }

    // depois do cadastro ou do login no popup
    const afterAuth = async () => {
        setShowAuth(false)
        await fetchUser()
        await create()
    }

    // na volta do login com Google a pessoa cai de novo nesta página, já com a conta
    const googleReturn = { path: `/${locale}/create/experiences/${kind}`, onLeave: () => undefined }

    return (
        <>
            {loading && <LoadingReq loading={loading} />}
            <button type="button" className={className ?? styles.button_secondary} onClick={handleClick} disabled={loading}>
                <Copy aria-hidden="true" /> {t('useTemplate')}
            </button>

            {!user && showAuth && createPortal(
                <div>
                    {typePopup === 'register' && (
                        <RegisterComponent locale={locale} absolute={true} toLogin={toLogin} handleRegisterAndFinishQuiz={afterAuth} show_pop_up={setShowAuth} googleReturn={googleReturn} />
                    )}
                    {typePopup === 'login' && (
                        <LoginComponent locale={locale} toRegister={toRegister} handleRegisterAndFinishQuiz={afterAuth} show_pop_up={setShowAuth} googleReturn={googleReturn} />
                    )}
                </div>,
                document.body
            )}
        </>
    )
}
