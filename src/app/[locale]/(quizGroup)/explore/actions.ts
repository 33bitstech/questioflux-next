'use server'

import IQuizes from "@/interfaces/IQuizes";
import { env } from "@/env";

export interface IPaginatedQuizzes {
    quizzes: IQuizes[]
    total: number
    totalPages: number
    page: number
}

interface IGetQuizzesParams {
    page?: number
    title?: string
    tags?: string
    categories?: string
    typeQuiz?: string
}

function hasSearchParams(params: IGetQuizzesParams) {
    return Boolean(
        params.title ||
        params.tags ||
        params.categories ||
        (params.typeQuiz && params.typeQuiz !== 'All')
    )
}

function buildQueryParams(params: IGetQuizzesParams) {
    const searchParams = new URLSearchParams()

    searchParams.set('page', String(params.page ?? 1))

    if (params.title) searchParams.set('title', params.title)
    if (params.tags) searchParams.set('tags', params.tags)
    if (params.categories) searchParams.set('categories', params.categories)

    if (params.typeQuiz && params.typeQuiz !== 'All') {
        searchParams.set('typeQuiz', params.typeQuiz)
    }

    return searchParams.toString()
}

export async function getQuizzes(
    paramsOrPage: IGetQuizzesParams | number = 1
): Promise<IPaginatedQuizzes | undefined> {
    try {
        const params: IGetQuizzesParams =
            typeof paramsOrPage === 'number'
                ? { page: paramsOrPage }
                : paramsOrPage

        const queryParams = buildQueryParams(params)

        const endpoint = hasSearchParams(params)
            ? `/api/quizzes/search?${queryParams}`
            : `/api/quizzes/public?${queryParams}`

        const response = await fetch(
            `${env.NEXT_PUBLIC_DOMAIN_FRONT}${endpoint}`,
            { method: 'GET', cache: 'no-store' }
        );

        const res = await response.json();
        return res;
    } catch (err: any) {
        console.log(err)
    }
}

export async function getFeaturedsQuizzes(): Promise<IQuizes[] | undefined> {
    try {
        const response = await fetch(
            `${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quizzes/featured`,
            { method: 'GET' }
        );
        const res = await response.json();
        return res.quizzes;
    } catch (err: any) {
        console.log(err)
    }
}