import { getIntlLocale } from "@/utils/locale"

export const getTimeObject = (timing: number) => {
    const miliseconds = Math.floor(Math.floor(timing % 1000) / 10),
        seconds = Math.floor((timing / 1000) % 60),
        minutes = Math.floor((timing / (1000 * 60)) % 60),
        hours = Math.floor(timing / (1000 * 60 * 60))

    return { hours, minutes, seconds, miliseconds }
}

export const getTimeString = (timing: number) => {
    const { hours, minutes, seconds, miliseconds } = getTimeObject(timing)

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(miliseconds).padStart(2, '0')}`
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(miliseconds).padStart(2, '0')}`
}

export const getTimeSinceDate = (timing: string | number | Date, locale: string) => {
    const now = Date.now()
    const time = new Date(timing).getTime()
    const secondsSinceDate = Math.floor((now - time) / 1000)

    const relativeTimeFormatter = new Intl.RelativeTimeFormat(getIntlLocale(locale), {
        numeric: 'always',
    })

    const divisions: Array<{
        limit: number
        divisor: number
        unit: Intl.RelativeTimeFormatUnit
    }> = [
        {
            limit: 60,
            divisor: 1,
            unit: 'second',
        },
        {
            limit: 3600,
            divisor: 60,
            unit: 'minute',
        },
        {
            limit: 86400,
            divisor: 3600,
            unit: 'hour',
        },
        {
            limit: 604800,
            divisor: 86400,
            unit: 'day',
        },
        {
            limit: 2628000,
            divisor: 604800,
            unit: 'week',
        },
        {
            limit: 31536000,
            divisor: 2628000,
            unit: 'month',
        },
        {
            limit: Infinity,
            divisor: 31536000,
            unit: 'year',
        },
    ]

    const division = divisions.find(({ limit }) => secondsSinceDate < limit) || divisions[0]

    const value = -Math.floor(secondsSinceDate / division.divisor)

    const displayText = relativeTimeFormatter.format(value, division.unit)

    const isoDate = new Date(timing).toISOString()

    return { isoDate, displayText }
}