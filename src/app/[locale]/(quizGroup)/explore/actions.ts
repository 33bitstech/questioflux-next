'use server'

import IQuizes from "@/interfaces/IQuizes";
import { env } from "process";

export async function getQuizzes(): Promise<IQuizes[] | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quizzes/public`, {
            method: 'GET',
            next:{
                revalidate: 60 * 60 * 24 // 1 dia
            }
        });
        const res = await response.json();
        return res.quizzes;
    } catch (err: any) {
        console.log(err)
    }
}
export async function getFeaturedsQuizzes(): Promise<IQuizes[] | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quizzes/featured`, {
            method: 'GET',
            next:{
                revalidate: 60 * 60 * 24 // 1 dia
            }
        });
        const res = await response.json();
        return res.quizzesSort;
    } catch (err: any) {
        console.log(err)
    }
}