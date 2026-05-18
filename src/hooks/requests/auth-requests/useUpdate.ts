'use client'

import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { BodyInit } from '@/types/fetchTypes'
import { useLocale } from 'next-intl'

const useUpdate = () => {
    const { setError } = useGlobalMessage()
    const locale = useLocale()

    const getErrorMessage = (data: any) => {
        const isPt = locale === 'pt' || locale === 'pt-BR'

        if (isPt) {
            return data?.messagePT || data?.message || 'Erro ao atualizar usuário'
        }

        return data?.message || data?.messagePT || 'Error updating user'
    }

    const handleError = (err: any): never => {
        const data = err?.response?.data || err

        setError(getErrorMessage(data))

        throw data
    }

    async function updateUser(body: BodyInit) {
        try {
            const response = await fetch('/api/user/update', {
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