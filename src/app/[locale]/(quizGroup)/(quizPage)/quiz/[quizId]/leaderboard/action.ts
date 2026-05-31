'use server'

import { env } from '@/env';
import IQuizes from '@/interfaces/IQuizes';

interface IRecommendationResponse {
    recommended?: IQuizes;
    message?: string;
    messagePT?: string;
    type?: string;
}

export async function getQuizRecommendationAction(
    quizId: string
): Promise<IQuizes | undefined> {
    try {
        if (!quizId) return;

        const response = await fetch(
            `${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/recommendation/${quizId}`,
            {
                method: 'GET',
                cache: 'no-store',
            }
        );

        const res: IRecommendationResponse = await response.json();

        if (!response.ok) {
            console.error('[getQuizRecommendationAction]', res);
            return;
        }

        return res.recommended;
    } catch (error) {
        console.error('[getQuizRecommendationAction] Erro inesperado:', error);
        return;
    }
}