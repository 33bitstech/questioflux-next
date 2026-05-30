'use server'

import { env } from '@/env'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { cookies } from 'next/headers'

type ApiError = {
    type: string
    message: string
    messagePT: string
}

type EditQuizSuccess = {
    ok: true
    data: any
    warning?: ApiError
}

type EditQuizFailure = {
    ok: false
    error: ApiError
}

type EditQuizResult = EditQuizSuccess | EditQuizFailure

const defaultServerError: ApiError = {
    type: 'global',
    message: 'An error occurred on the server. Please try again later.',
    messagePT: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
}

function normalizeError(error: any): ApiError {
    return {
        type: error?.type || 'global',
        message: error?.message || defaultServerError.message,
        messagePT: error?.messagePT || defaultServerError.messagePT,
    }
}

export async function editQuiz(
    quiz: FormData,
    quizId: string
): Promise<EditQuizResult> {
    try {
        const cookieStore = await cookies()
        const cookieHeader = getCookieHeader(cookieStore.getAll())

        const response = await fetch(
            `${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/edit/${quizId}`,
            {
                method: 'PUT',
                headers: {
                    cookie: cookieHeader,
                },
                body: quiz,
            }
        )

        const responseData = await response.json().catch(() => null)

        if (!response.ok) {
            return {
                ok: false,
                error: normalizeError(responseData),
            }
        }

        return {
            ok: true,
            data: responseData.data,
            warning: responseData.warning,
        }
    } catch (err) {
        console.error('[editQuiz action]', err)

        return {
            ok: false,
            error: defaultServerError,
        }
    }
}