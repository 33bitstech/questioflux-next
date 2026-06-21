'use client'

import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { BodyInit } from '@/types/fetchTypes'
import { useLocale } from 'next-intl'
import { getLocalizedMessage } from '@/utils/getLocalizedMessage'
import { getAppLocale } from '@/utils/locale'

const useUpdate = () => {
    const { setError } = useGlobalMessage()
    const locale = useLocale()

    const fallbackByLocale = {
        en: 'Error updating user',
        pt: 'Erro ao atualizar usuário',
        es: 'Error al actualizar el usuario',
    }

    const getErrorMessage = (data: any) => {
        const appLocale = getAppLocale(locale)

        return getLocalizedMessage(
            data,
            locale,
            fallbackByLocale[appLocale]
        )
    }

    const handleError = (err: any): never => {
        const data = err?.response?.data || err

        setError(getErrorMessage(data))

        throw data
    }

    async function updateUser(body: BodyInit) {
        try {
            const response = await fetch(`/api/user/update?locale=${locale}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body,
            })

            const res = await response.json()

            if (!response.ok) {
                throw { response: { data: res } }
            }

            return res
        } catch (err: any) {
            handleError(err)
        }
    }

    async function updateUserProfile(body: BodyInit) {
        try {
            const response = await fetch('/api/user/update/profileImg', {
                method: 'PUT',
                credentials: 'include',
                body,
            })

            const res = await response.json()

            if (!response.ok) {
                throw { response: { data: res } }
            }

            return res
        } catch (err: any) {
            handleError(err)
        }
    }

    return { updateUser, updateUserProfile }
}

export default useUpdate