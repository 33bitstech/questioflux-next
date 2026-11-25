'use client'

const useQuizDatas = () => {
    async function getLeaderboard(quizId: string) {
        try {
            const response = await fetch(`/api/quiz/leaderboard/${quizId}`, { method: 'GET' });
            const res = await response.json();
            if (!response.ok) throw { response: { data: res } }
            return res;
        } catch (err: any) {
            throw err.response.data;
        }
    }

    // quem respondeu (conclusões gravadas), em qualquer formato
    async function getParticipants(quizId: string, page = 1) {
        try {
            const response = await fetch(`/api/quiz/participants/${quizId}?page=${page}`, { method: 'GET' });
            const res = await response.json();
            if (!response.ok) throw { response: { data: res } }
            return res;
        } catch (err: any) {
            throw err.response?.data ?? err;
        }
    }

    return { getLeaderboard, getParticipants };
}

export default useQuizDatas;