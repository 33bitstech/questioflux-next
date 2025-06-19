'use client'

import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { BodyInit } from '@/types/fetchTypes'


const useLogin = () => {
    const { setError } = useGlobalMessage()

    async function login(body: BodyInit) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

    return { login };
}

export default useLogin;