'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { HeartHandshake, Play } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import IQuizes from '@/interfaces/IQuizes'
import { IParticipationPlayer } from '@/interfaces/IParticipation'
import { IStoryContent, ITournamentContent, ICompatibilityContent, IScoredContent, TExperienceAnswer } from '@/interfaces/IExperience'
import { takeExperience } from '@/app/[locale]/(quizGroup)/(createQuiz)/create/experiences/actions'
import { useUser } from '@/contexts/userContext'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import usePopupAuth from '@/hooks/usePopupAuth'
import { allowsAnonymousPlay, ExperienceKind, getQuizKind } from '@/utils/quizKind'
import { IParticipationRef, isParticipationRef, newAttemptKey, saveParticipationRef } from '@/utils/participationKeys'
import { clearPendingExperience, isOwnInvite, saveOwnInvite, savePendingExperience, takePendingExperience } from '@/utils/experienceStorage'
import { getLocalizedMessage } from '@/utils/getLocalizedMessage'
import { quizParams, trackEvent } from '@/utils/analytics'
import { storyEndings } from '@/utils/experiences'
import { quizCanonicalUrl } from '@/utils/seo'
import ExperiencePlayer from './Play/experience-player'
import MyInvites from './my-invites'
import RegisterComponent from '../AuthForms/register-component'
import LoginComponent from '../AuthForms/login-component'
import GuestForm from '../AuthForms/Guest/guest-form'
import LoadingReq from '../Loading/loading-req'
import styles from './experiences.module.scss'

// player: quem convidou; notFound: o link não vale mais (a partida segue, sem comparação)
export interface IInvite {
    code: string
    player?: IParticipationPlayer
    notFound?: boolean
}

interface IProps {
    quiz: IQuizes
    // compatibilidade aberta pelo link de alguém (?invite=)
    invite?: IInvite
    // Quiz incorporado em outro site (iframe): só visitante, porque cadastro e login com
    // Google dependem de cookies e redirecionamentos que o iframe não aceita. O resultado
    // aparece ali mesmo (onFinished) em vez de ir para a página do resultado no site.
    embed?: boolean
    onFinished?: (participation: IParticipationRef) => void
}

// Quantos itens o formato tem, para a explicação antes de começar
function sizeOf(kind: ExperienceKind, quiz: IQuizes) {
    const content = quiz.experience
    switch (kind) {
        case 'tournament': return (content as ITournamentContent | undefined)?.options?.length ?? 0
        case 'story': return storyEndings(content as IStoryContent | undefined).length
        default: return (content as ICompatibilityContent | IScoredContent | undefined)?.questions?.length ?? 0
    }
}

// Partida de um torneio, história, compatibilidade ou pontuação pelo link do quiz. No fim,
// sem conta, pede o nome (ou segue anônimo, onde o formato deixa) e abre a página do resultado.
export default function ExperienceTaking({ quiz, invite, embed, onFinished }: IProps) {
    const kind = getQuizKind(quiz) as ExperienceKind
    const t = useTranslations('experiencePlay')
    const locale = useLocale()
    const router = useRouter()
    const { user, loaded: userLoaded } = useUser()
    const { setError } = useGlobalMessage()
    const { typePopup, toGuest, toLogin, toRegister } = usePopupAuth()

    const [round, setRound] = useState(0)
    // partida terminada à espera do nome de visitante (ou do login)
    const [pending, setPending] = useState<TExperienceAnswer>()
    const [showPopup, setShowPopup] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [ownInvite, setOwnInvite] = useState(false)
    const attemptKey = useRef<string | undefined>(undefined)
    const busy = useRef(false)
    const resumeChecked = useRef(false)

    const inviteCode = invite && !invite.notFound ? invite.code : undefined
    const inviter = invite?.player
    const takingPath = `/quiz/${quiz.quizId}/taking${invite ? `?invite=${encodeURIComponent(invite.code)}` : ''}`

    useEffect(() => {
        if (inviteCode && isOwnInvite(quiz.quizId, inviteCode)) setOwnInvite(true)
    }, [inviteCode, quiz.quizId])

    const submit = async (answer: TExperienceAnswer, guest?: string, withInvite = true) => {
        if (busy.current) return
        busy.current = true
        setSubmitting(true)
        if (!attemptKey.current) attemptKey.current = newAttemptKey()

        try {
            const result = await takeExperience(quiz.quizId, {
                experienceAnswer: answer,
                guest,
                attemptKey: attemptKey.current,
                invite: withInvite && !ownInvite ? inviteCode : undefined,
            })

            if (!result.ok) {
                setError(getLocalizedMessage(result.error, locale))
                // o próprio convite (com a conta): as respostas valem como partida própria
                if (result.error.type === 'invite' && withInvite && inviteCode) {
                    busy.current = false
                    attemptKey.current = newAttemptKey()
                    return submit(answer, guest, false)
                }
                return
            }

            clearPendingExperience()
            setPending(undefined)
            saveParticipationRef(quiz.quizId, result.participation)
            if (typeof result.experience.inviteCode === 'string') saveOwnInvite(quiz.quizId, result.experience.inviteCode)
            if (result.experience.inviteNotFound) setError(t('invite.lost'))

            trackEvent('quiz_complete', { ...quizParams(quiz), player_type: user ? 'user' : 'guest', invited: !!inviteCode, ...(embed ? { embedded: true } : {}) })

            if (onFinished && isParticipationRef(result.participation)) {
                onFinished(result.participation)
                return
            }
            if (result.participation) {
                router.push(`/quiz/${quiz.quizId}/result/${result.participation.participationId}`)
                return
            }
            setError(t('errors.noResult'))
        } finally {
            busy.current = false
            setSubmitting(false)
        }
    }

    const start = () => {
        attemptKey.current = newAttemptKey()
        setPending(undefined)
        setRound(current => current + 1)
        trackEvent('quiz_start', quizParams(quiz))
    }

    const complete = (answer: TExperienceAnswer) => {
        if (user) return void submit(answer)
        setPending(answer)
        toGuest()
        setShowPopup(true)
    }

    // nome de visitante escolhido, ou cadastro/login feito no popup
    const handleRegisterAndFinishQuiz = (name?: string) => {
        setShowPopup(false)
        if (pending) void submit(pending, name || undefined)
    }

    // Volta do login com Google feito no popup do fim: com a conta, a partida vai direto; sem
    // ela, o erro aparece e o popup abre de novo com a mesma partida.
    useEffect(() => {
        if (resumeChecked.current || !userLoaded) return
        resumeChecked.current = true

        const searchParams = new URLSearchParams(window.location.search)
        if (searchParams.get('oauthError')) {
            const message = getLocalizedMessage({
                message: searchParams.get('msgEN') ?? undefined,
                messagePT: searchParams.get('msgPT') ?? undefined,
                messageES: searchParams.get('msgES') ?? undefined,
            }, locale)
            if (message) setError(message)
            // recarregar a página não mostra o erro de novo (o convite continua no endereço)
            const keep = searchParams.get('invite')
            window.history.replaceState(null, '', `${window.location.pathname}${keep ? `?invite=${encodeURIComponent(keep)}` : ''}`)
        }

        const saved = takePendingExperience(quiz.quizId)
        if (!saved) return
        attemptKey.current = saved.attemptKey
        if (user) return void submit(saved.answer)
        setPending(saved.answer)
        if (searchParams.get('code') === '409') toLogin()
        else toGuest()
        setShowPopup(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLoaded])

    const googleReturn = {
        path: `/${locale}${takingPath}`,
        onLeave: () => { if (pending) savePendingExperience(quiz.quizId, pending, attemptKey.current) },
    }

    // publicado sem conteúdo não acontece (o backend não deixa), mas o link pode ser de um rascunho
    if (!quiz.experience) return <p className={styles.notice}>{t('errors.notReady')}</p>

    const count = sizeOf(kind, quiz)
    const how = t.raw(`intro.${kind}`) as string[]

    return (
        <>
            {submitting && <LoadingReq loading={submitting} />}

            {round === 0 ? (
                <div className={styles.intro}>
                    {kind === 'compatibility' && inviter && !ownInvite && (
                        <div className={styles.invite_banner}>
                            <HeartHandshake aria-hidden="true" />
                            <p>{t('invite.banner', { name: inviter.name || t('invite.someone') })}</p>
                        </div>
                    )}
                    {ownInvite && <p className={styles.notice}>{t('invite.own')}</p>}
                    {invite?.notFound && <p className={styles.notice}>{t('invite.notFound')}</p>}

                    <h2>{t(`intro.title.${kind}`, { count })}</h2>
                    <ul className={styles.how}>
                        {how.map(item => <li key={item}>{item}</li>)}
                    </ul>
                    {!user && userLoaded && <p>{allowsAnonymousPlay(kind) ? t('intro.guestOptional') : t('intro.guestRequired')}</p>}

                    <button type="button" className={styles.button_primary} onClick={start}>
                        <Play aria-hidden="true" /> {t('start')}
                    </button>

                    {/* já jogou (talvez em outra aba ou aparelho): volta aos convites sem criar outro link */}
                    {kind === 'compatibility' && !embed && <MyInvites quizId={quiz.quizId} inviteBaseUrl={`${quizCanonicalUrl(quiz)}/taking`} />}
                </div>
            ) : (
                <>
                    <ExperiencePlayer
                        key={round}
                        kind={kind}
                        content={quiz.experience}
                        onComplete={complete}
                        disabled={submitting || !!pending}
                    />
                </>
            )}

            {/* sem nome ainda: a partida terminada espera aqui (inclusive na volta do Google) */}
            {pending && !showPopup && !submitting && (
                <div className={styles.intro}>
                    <p>{t('pending.text')}</p>
                    <div className={styles.demo_actions}>
                        <button type="button" className={styles.button_primary} onClick={() => { toGuest(); setShowPopup(true) }}>
                            {t('pending.finish')}
                        </button>
                        <button type="button" className={styles.button_secondary} onClick={start}>
                            {t('pending.playAgain')}
                        </button>
                    </div>
                </div>
            )}

            {!user && showPopup && createPortal(
                <div>
                    {typePopup === 'register' && (
                        <RegisterComponent locale={locale} absolute={true} toLogin={toLogin} toGuest={toGuest} handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz} show_pop_up={setShowPopup} googleReturn={googleReturn} />
                    )}
                    {typePopup === 'login' && (
                        <LoginComponent locale={locale} toRegister={toRegister} handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz} show_pop_up={setShowPopup} googleReturn={googleReturn} />
                    )}
                    {typePopup === 'guest' && (
                        <GuestForm allowAnonymous={allowsAnonymousPlay(kind)} toRegister={embed ? undefined : toRegister} handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz} show_pop_up={setShowPopup} googleReturn={googleReturn} />
                    )}
                </div>,
                document.body
            )}
        </>
    )
}
