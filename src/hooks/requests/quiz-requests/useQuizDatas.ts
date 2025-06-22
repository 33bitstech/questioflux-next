'use client'

import { useGlobalMessage } from '@/contexts/globalMessageContext'

const useQuizDatas = () => {
    const { setError } = useGlobalMessage()

    async function getLeaderboard(quizId:string) {
        try {
            const response = await fetch(`/api/quiz/leaderboard/${quizId}`, {
                method: 'GET'
            });

            const res = await response.json();

            if (!response.ok) throw { response: { data: res } }

            return res;

        } catch (err: any) {
            throw err.response.data;
        }
    }


    return { 
        getLeaderboard
    };
}

export default useQuizDatas;