export interface PremiumRes {
    premium: {
        premium?: boolean,
        currentPeriodEnd?: string,
        specialCount?: number,
        cancelAtPeriodEnd?: boolean
    }
}

export const checkPremiumState = (res: PremiumRes) => {
    let premium = res.premium.premium
    if (premium) {
        const endDateFromApi = res.premium.currentPeriodEnd ?? null
        const cancelAtPeriodEndFromApi = res.premium.cancelAtPeriodEnd ?? false

        if (cancelAtPeriodEndFromApi && endDateFromApi) {
            const endDate = new Date(endDateFromApi);
            if (endDate <= new Date()) {
                premium = false;
            }
        }
    }
    return premium
}  