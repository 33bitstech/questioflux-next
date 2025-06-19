'use client'

import { useGlobalMessage } from '@/contexts/globalMessageContext'

const useGettingQuiz = () => {
    const { setError } = useGlobalMessage()

    async function publicQuizzes() {
        try {
            const response = await fetch('/api/quizzes/public', {
                method: 'GET',
            });

            const res = await response.json();

            if (!response.ok) throw { response: { data: res } }

            return res;

        } catch (err: any) {
            const { type, message } = err.response.data;
            if (type === 'global' || type == undefined) return setError(message);

            throw err.response.data;
        }
    }

    return { publicQuizzes };
}

export default useGettingQuiz;