import { env } from "@/env";
import IQuizes from "@/interfaces/IQuizes";

export async function publicQuizzes(userId:string) : Promise<IQuizes[] | undefined>{
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quizzes/public/${userId}`, {
            method: 'GET',
        });

        const res = await response.json();

        if (!response.ok) throw { response: { data: res } }

        return res.quizes;

    } catch (err: any) {
        console.log(err)
    }
}