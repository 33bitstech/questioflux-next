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
import CancelSubscriptionPopup from './cancel-subscription-popup'

interface IProps {
    styles: TStyles
}

export default function SubscriptionContainer({ styles }: IProps) {
    const t = useTranslations('configPage.subscriptionContainer')
    const locale = useLocale()

    const { user } = useUser()
    const { setError, setSucess} = useGlobalMessage()

    const [premium, setPremium] = useState<boolean>(false)
    const [specialCount, setSpecialCount] = useState<number>(0)

    const [showCancelPopup, setShowCancelPopup] = useState<boolean>(false)
    const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null)
    const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState<boolean>(false)

    const [loadingCancelInfo, setLoadingCancelInfo] = useState<boolean>(false)
    const [canceling, setCanceling] = useState<boolean>(false)

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return t('cancelPopup.noDate')

        const parsedDate = new Date(date)

        if (Number.isNaN(parsedDate.getTime())) {
            return t('cancelPopup.noDate')
        }

        return new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(parsedDate)
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

            const currentPeriodEndFromApi =
                res.premium?.currentPeriodEnd ??
                res.premium?.subscription?.currentPeriodEnd ??
                res.premium?.current_period_end ??
                res.premium?.subscription?.current_period_end ??
                null

            const cancelAtPeriodEndFromApi =
                res.premium?.cancelAtPeriodEnd ??
                res.premium?.subscription?.cancelAtPeriodEnd ??
                res.premium?.cancel_at_period_end ??
                res.premium?.subscription?.cancel_at_period_end ??
                false

            setCurrentPeriodEnd(currentPeriodEndFromApi)
            setCancelAtPeriodEnd(cancelAtPeriodEndFromApi)
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

            const endDate =
                data?.currentPeriodEnd ??
                data?.subscription?.currentPeriodEnd ??
                currentPeriodEnd

            setCancelAtPeriodEnd(data?.cancelAtPeriodEnd ?? true)
            setCurrentPeriodEnd(endDate)
            setShowCancelPopup(false)

            setSucess(
                t('cancelPopup.success', {
                    date: formatDate(endDate)
                })
            )
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
                <CancelSubscriptionPopup
                    styles={styles}
                    title={t('cancelPopup.title')}
                    description={t('cancelPopup.description', {
                        date: formatDate(currentPeriodEnd)
                    })}
                    keepButtonText={t('cancelPopup.keepButton')}
                    confirmButtonText={
                        canceling
                            ? t('cancelPopup.cancelingButton')
                            : t('cancelPopup.confirmButton')
                    }
                    canceling={canceling}
                    onClose={() => setShowCancelPopup(false)}
                    onConfirm={handleConfirmCancel}
                />
            )}
        </>
    )
}