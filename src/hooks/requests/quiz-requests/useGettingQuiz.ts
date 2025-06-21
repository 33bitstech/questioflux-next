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
    async function featuredQuizzes() {
        try {
            const response = await fetch('/api/quizzes/featured', {
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

    async function userPublicQuizzes(userId: string){
        try {
            const response = await fetch(`/api/quizzes/public/${userId}`, {
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
    async function userPrivateQuizzes(token: string){
        try {
            const response = await fetch(`/api/quizzes/private`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                }
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
    async function userDraftsQuizzes(token: string){
        try {
            const response = await fetch(`/api/quizzes/drafts`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                }
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
    async function userSavesQuizzes(token: string){
        try {
            const response = await fetch(`/api/quizzes/saves`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                }
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
    async function searchQuiz(title: string | undefined, categories: string | undefined, tags:string | undefined){
        try {
            let objectSearch: {tags?:string, title?:string, categories?:string} = {};

            if (tags) objectSearch.tags = tags;
            if (title) objectSearch.title = title;
            if (categories) objectSearch.categories = categories;

            const params = new URLSearchParams(objectSearch)

            const response = await fetch(`/api/quizzes/search?${params.toString()}`, {
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
    

    return { 
        publicQuizzes, featuredQuizzes, userDraftsQuizzes, 
        userPrivateQuizzes, userPublicQuizzes, userSavesQuizzes,
        searchQuiz

    };
}

export default useGettingQuiz;