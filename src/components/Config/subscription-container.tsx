'use client'

import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import QuizIcon from '../Icons/QuizIcon'
import { Link } from '@/i18n/navigation'
import { useUser } from '@/contexts/userContext'
import {
    cancelSubscription,
    verifyUserPremium
} from '@/app/[locale]/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useLocale, useTranslations } from 'next-intl'

interface IProps {
    styles: TStyles
}

export default function SubscriptionContainer({ styles }: IProps) {
    const t = useTranslations('configPage.subscriptionContainer')
    const locale = useLocale()

    const { user } = useUser()
    const { setError } = useGlobalMessage()

    const [premium, setPremium] = useState<boolean>(false)
    const [specialCount, setSpecialCount] = useState<number>(0)

    const [showCancelPopup, setShowCancelPopup] = useState<boolean>(false)
    const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null)
    const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState<boolean>(false)

    const [loadingCancelInfo, setLoadingCancelInfo] = useState<boolean>(false)
    const [canceling, setCanceling] = useState<boolean>(false)

    const formatDate = (date: string | null) => {
        if (!date) return t('cancelPopup.noDate')

        return new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date))
    }

    const handleOpenCancelPopup = async () => {
        if (!premium) return

        try {
            setLoadingCancelInfo(true)

            const res = await verifyUserPremium(false)

            if (res.err) {
                setError(res.err)
                return
            }

            if (!res.premium?.premium) {
                setPremium(false)
                return
            }

            setCurrentPeriodEnd(res.premium.currentPeriodEnd ?? null)
            setCancelAtPeriodEnd(res.premium.cancelAtPeriodEnd ?? false)
            setShowCancelPopup(true)
        } catch (err) {
            console.log(err)
            setError(t('cancelPopup.error'))
        } finally {
            setLoadingCancelInfo(false)
        }
    }

    const handleConfirmCancel = async () => {
        try {
            setCanceling(true)

            const res = await cancelSubscription()

            if (res?.err) {
                setError(res.err)
                return
            }

            const data = res?.data

            setCancelAtPeriodEnd(data?.cancelAtPeriodEnd ?? true)
            setCurrentPeriodEnd(data?.currentPeriodEnd ?? currentPeriodEnd)
            setShowCancelPopup(false)
        } catch (err) {
            console.log(err)
            setError(t('cancelPopup.error'))
        } finally {
            setCanceling(false)
        }
    }

    useEffect(() => {
        const get = async () => {
            try {
                const res = await verifyUserPremium()

                if (res.err) {
                    return setError(res.err)
                }

                setPremium(res.premium.premium)
                setSpecialCount(res.premium.specialCount)

                setCurrentPeriodEnd(res.premium.currentPeriodEnd ?? null)
                setCancelAtPeriodEnd(res.premium.cancelAtPeriodEnd ?? false)
            } catch (err) {
                console.log(err)
            }
        }

        get()
    }, [user, setError])

    return (
        <>
            <div className={styles.planos}>
                <h5>{t('activeTitle', { count: premium ? 1 : 0 })}</h5>

                <section className={styles.gamepass}>
                    <article>
                        <div className={styles.gamepass_details}>
                            <QuizIcon />

                            <div className={styles.gamepass_details_infos}>
                                <span>
                                    <h3>{t('vortexPlus.title')}</h3>
                                    <span className={styles.desc}>
                                        {t('vortexPlus.price')}
                                    </span>

                                    {premium && cancelAtPeriodEnd && (
                                        <span className={styles.desc}>
                                            {t('vortexPlus.cancelScheduled', {
                                                date: formatDate(currentPeriodEnd)
                                            })}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {!premium && (
                            <Link href="/subscription/vortexplus">
                                {t('vortexPlus.subscribeButton')}
                            </Link>
                        )}

                        {premium && (
                            <button
                                onClick={handleOpenCancelPopup}
                                disabled={loadingCancelInfo || cancelAtPeriodEnd}
                            >
                                {loadingCancelInfo
                                    ? t('vortexPlus.loadingButton')
                                    : cancelAtPeriodEnd
                                        ? t('vortexPlus.cancelAlreadyScheduledButton')
                                        : t('vortexPlus.unsubscribeButton')}
                            </button>
                        )}
                    </article>

                    <article>
                        <div className={styles.gamepass_details}>
                            <QuizIcon />

                            <div className={styles.gamepass_details_infos}>
                                <span>
                                    <h3>
                                        {t('vortexPlusUsage.title', {
                                            count: specialCount || 0
                                        })}
                                    </h3>
                                    <span className={styles.desc}>
                                        {t('vortexPlusUsage.price')}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <Link href="/subscription/questioplususage">
                            {t('vortexPlusUsage.buyButton')}
                        </Link>
                    </article>
                </section>
            </div>

            {showCancelPopup && (
                <div className="cancel-subscription-popup-overlay">
                    <div className="cancel-subscription-popup">
                        <h3>{t('cancelPopup.title')}</h3>

                        <p>
                            {t('cancelPopup.description', {
                                date: formatDate(currentPeriodEnd)
                            })}
                        </p>

                        <div className="cancel-subscription-popup-actions">
                            <button
                                type="button"
                                className="cancel-subscription-popup-secondary"
                                onClick={() => setShowCancelPopup(false)}
                                disabled={canceling}
                            >
                                {t('cancelPopup.keepButton')}
                            </button>

                            <button
                                type="button"
                                className="cancel-subscription-popup-danger"
                                onClick={handleConfirmCancel}
                                disabled={canceling}
                            >
                                {canceling
                                    ? t('cancelPopup.cancelingButton')
                                    : t('cancelPopup.confirmButton')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}