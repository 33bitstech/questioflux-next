'use client'

import { useGlobalMessage } from '@/contexts/globalMessageContext'

const useQuizActions = (savedQuizes: Array<{ id: string }> | undefined) => {
    const { setError } = useGlobalMessage()

    async function saveQuiz(quizId: string) {
        try {
            const response = await fetch(`/api/quiz/save/${quizId}`, {
                method: 'POST',
                credentials: 'include',
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

    async function unsaveQuiz(quizId: string) {
        try {
            const response = await fetch(`/api/quiz/unsave/${quizId}`, {
                method: 'DELETE',
                credentials: 'include',
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

    const verifySave = (quizId: string) => {
        return savedQuizes?.find(quiz => quiz.id == quizId);
    }

    return { saveQuiz, unsaveQuiz, verifySave };
}

export default useQuizActions;