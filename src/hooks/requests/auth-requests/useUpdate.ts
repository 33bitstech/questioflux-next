'use client'

import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { BodyInit } from '@/types/fetchTypes'


const useUpdate = () => {
    const { setError } = useGlobalMessage()

    async function updateUser(body: BodyInit, token:string) {
        try {
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: body, 
            });

            const res = await response.json();

            if (!response.ok) throw { response: { data: res } }

            return res;

        } catch (err: any) {
            const { type, message } = err.response.data;
            if (type === 'global') return setError(message);

            throw err.response.data;
        }
    }
    async function updateUserProfile(body: BodyInit, token:string) {
        try {
            const response = await fetch('/api/user/update/profileImg', {
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                body: body, 
            });

            const res = await response.json();

            if (!response.ok) throw { response: { data: res } }

            return res;

        } catch (err: any) {
            const { type, message } = err.response.data;
            if (type === 'global') return setError(message);

            throw err.response.data;
        }
    }

    return { updateUser, updateUserProfile};
}

export default useUpdate;