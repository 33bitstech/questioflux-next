'use server'

import { env } from '@/env'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { cookies } from 'next/headers'
import { updateTag } from 'next/cache'
import { quizTag } from '@/utils/publicQuiz'

type ApiError = {
    type: string
    message: string
    messagePT: string
    messageES?: string
}

type CreateQuizSuccess = {
    ok: true
    data: {
        quizId: string
    }
    warning?: ApiError
}

type CreateQuizFailure = {
    ok: false
    error: ApiError
}

type CreateQuizResult = CreateQuizSuccess | CreateQuizFailure

const defaultServerError: ApiError = {
    type: 'global',
    message: 'An error occurred on the server. Please try again later.',
    messagePT: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
    messageES: 'Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.',
}

function normalizeError(error: any): ApiError {
    return {
        type: error?.type || 'global',
        message: error?.message || defaultServerError.message,
        messagePT: error?.messagePT || defaultServerError.messagePT,
        messageES: error?.messageES || defaultServerError.messageES,
    }
}

export async function createQuiz(quiz: FormData): Promise<CreateQuizResult> {
    try {
        const cookieStore = await cookies()
        const cookieHeader = getCookieHeader(cookieStore.getAll())

        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz`, {
            method: 'POST',
            headers: {
                cookie: cookieHeader,
            },
            body: quiz,
        })

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
        console.error('[createQuiz action]', err)

        return {
            ok: false,
            error: defaultServerError,
        }
    }
}

// Imagem de um resultado do quiz de personalidade. O resultado já existe (veio na capa):
// a imagem sobe depois, como a capa do quiz. formData leva o arquivo em "quizImg".
export async function uploadPersonalityResultImage(quizId: string, resultId: string, formData: FormData): Promise<{ ok: boolean }> {
    try {
        const cookieStore = await cookies()

        const response = await fetch(
            `${env.NEXT_PUBLIC_DOMAIN_API}/personality-result-image/${encodeURIComponent(quizId)}/${encodeURIComponent(resultId)}`,
            {
                method: 'PUT',
                headers: { cookie: getCookieHeader(cookieStore.getAll()) },
                body: formData,
            }
        )

        return { ok: response.ok }
    } catch (err) {
        console.error('[uploadPersonalityResultImage]', err)
        return { ok: false }
    } finally {
        updateTag(quizTag(quizId))
    }
}
