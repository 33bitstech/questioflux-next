'use server'

import IQuizes from "@/interfaces/IQuizes";
import { env } from "@/env";

export interface IPaginatedQuizzes {
    quizzes: IQuizes[]
    total: number
    totalPages: number
    page: number
}

export async function getQuizzes(page: number = 1): Promise<IPaginatedQuizzes | undefined> {
    try {
        const response = await fetch(
            `${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quizzes/public?page=${page}`,
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