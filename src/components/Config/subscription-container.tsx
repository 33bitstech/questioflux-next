'use client'

import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import QuizIcon from '../Icons/QuizIcon'
import { Link } from '@/i18n/navigation'
import { useUser } from '@/contexts/userContext'
import {
    cancelSubscription,
    createPortalSession,
    reactivateSubscription,
    verifyUserPremium
} from '@/app/[locale]/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useLocale, useTranslations } from 'next-intl'
import CancelSubscriptionPopup from './cancel-subscription-popup'
import { checkPremiumState, PremiumRes } from '@/utils/checkPremiumSubs'

interface IProps {
    styles: TStyles
}

export default function SubscriptionContainer({ styles }: IProps) {
    const t = useTranslations('configPage.subscriptionContainer')
    const locale = useLocale()

    const { user } = useUser()
    const { setError, setSucess } = useGlobalMessage()

    const [premium, setPremium] = useState<boolean>(false)
    const [specialCount, setSpecialCount] = useState<number>(0)

    const [showCancelPopup, setShowCancelPopup] = useState<boolean>(false)
    const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null)
    const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState<boolean>(false)

    const [loadingCancelInfo, setLoadingCancelInfo] = useState<boolean>(false)

    const [isManagingBilling, setIsManagingBilling] = useState<boolean>(false)
    const [isReactivating, setIsReactivating] = useState<boolean>(false)

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return t('cancelPopup.noDate')

        const parsedDate = new Date(date)

        if (Number.isNaN(parsedDate.getTime())) {
            return t('cancelPopup.noDate')
        }

        return new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: 'long',
            year: '2-digit'
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
            const currentPeriodEndFromApi = res.premium.currentPeriodEnd ?? null

            const cancelAtPeriodEndFromApi = res.premium.cancelAtPeriodEnd ?? false

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
        if (!premium) return

        setShowCancelPopup(true)
    }

    const isSubscriptionCanceledButStillActive = () => {
        if (!cancelAtPeriodEnd || !currentPeriodEnd) return false

        const endDate = new Date(currentPeriodEnd)

        if (Number.isNaN(endDate.getTime())) return false

        return endDate > new Date()
    }
    const canceledButStillActive = isSubscriptionCanceledButStillActive()
    const handleReactivateSubscription = async () => {
        try {
            setIsReactivating(true)
            const res = await reactivateSubscription(locale)

            if (res.err) {
                setError(res.err)
                return
            }

            setCancelAtPeriodEnd(false)
            setSucess(t('vortexPlus.reactivateSuccess'))
        } catch (error) {
            setError(t('vortexPlus.reactivateError'))
        } finally {
            setIsReactivating(false)
        }
    }

    const handleManageSubscription = async () => {
        try {
            setIsManagingBilling(true)

            const res = await createPortalSession(locale)

            if (res.err) {
                setError(res.err)
                return
            }

            if (res.url) {
                window.location.href = res.url
            }
        } catch (error) {
            console.error("Erro ao abrir o portal", error)
            setError(t('manageBillingError'))
        } finally {
            setIsManagingBilling(false)
        }
    }

    useEffect(() => {
        if (!user) return;
        const get = async () => {
            try {
                const res = await verifyUserPremium()

                if (res.err) {
                    return setError(res.err)
                }
                const endDateFromApi = res.premium.currentPeriodEnd ?? null
                const cancelAtPeriodEndFromApi = res.premium.cancelAtPeriodEnd ?? false

                setPremium(checkPremiumState(res as PremiumRes) ?? false)
                setSpecialCount(res.premium.specialCount)
                setCurrentPeriodEnd(endDateFromApi)
                setCancelAtPeriodEnd(cancelAtPeriodEndFromApi)
            } catch (err) {
                console.log(err)
            }
        }

        get()
    }, [user?.userId])

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
                                </span>
                            </div>
                        </div>

                        {!premium && (
                            <Link href="/subscription/questioplus">
                                {t('vortexPlus.subscribeButton')}
                            </Link>
                        )}

                        {premium && (
                            <button
                                onClick={canceledButStillActive ? handleReactivateSubscription : handleOpenCancelPopup}
                                disabled={loadingCancelInfo || isReactivating}
                            >
                                {loadingCancelInfo
                                    ? t('vortexPlus.loadingButton')
                                    : isReactivating
                                        ? t('vortexPlus.reactivatingButton')
                                        : canceledButStillActive
                                            ? t('vortexPlus.reactivateButton')
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

                {premium && !canceledButStillActive && (
                    <button
                        className={styles.manageBillingBtn}
                        onClick={handleManageSubscription}
                        disabled={isManagingBilling}
                    >
                        {isManagingBilling ? t('manageBillingLoading') : t('manageBilling')}
                    </button>
                )}
            </div>

            {showCancelPopup && (
                <CancelSubscriptionPopup
                    styles={styles}
                    title={t('cancelPopup.title')}
                    description={t('cancelPopup.description', {
                        date: formatDate(currentPeriodEnd)
                    })}
                    keepButtonText={t('cancelPopup.keepButton')}
                    confirmButtonText={t('cancelPopup.confirmButton')}
                    onClose={() => setShowCancelPopup(false)}
                    onConfirm={handleConfirmCancel}
                />
            )}
        </>
    )
}