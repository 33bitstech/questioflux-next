import { NextResponse } from 'next/server'
import ApiData from '@/utils/ApiData'

type ApiError = {
    type: string
    message: string
    messagePT: string
}

const defaultServerError: ApiError = {
    type: 'global',
    message: 'An error occurred on the server. Please try again later.',
    messagePT: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
}

async function safeJson<T>(response: Response): Promise<T | null> {
    try {
        return await response.json()
    } catch {
        return null
    }
}

function normalizeRouteError(error?: Partial<ApiError> | null): ApiError {
    return {
        type: error?.type || 'global',
        message: error?.message || defaultServerError.message,
        messagePT: error?.messagePT || defaultServerError.messagePT,
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const cookieHeader = request.headers.get('cookie') || ''
        const resFormData = await request.formData()

        const imageFile = resFormData.get('quizImg')
        const quizFieldsString = resFormData.get('quizDatas')
        const { quizId } = await params

        if (!quizId) {
            return NextResponse.json(
                {
                    type: 'global',
                    message: 'Quiz id was not provided',
                    messagePT: 'O quiz não foi informado',
                },
                { status: 400 }
            )
        }

        if (!quizFieldsString || typeof quizFieldsString !== 'string') {
            return NextResponse.json(
                {
                    type: 'global',
                    message: 'Quiz data was not provided',
                    messagePT: 'Os dados do quiz não foram informados',
                },
                { status: 400 }
            )
        }

        let parsedQuizData: unknown

        try {
            parsedQuizData = JSON.parse(quizFieldsString)
        } catch {
            return NextResponse.json(
                {
                    type: 'global',
                    message: 'Invalid quiz data format',
                    messagePT: 'Formato inválido dos dados do quiz',
                },
                { status: 400 }
            )
        }

        const externalApiResponse = await ApiData({
            path: `quiz/${quizId}`,
            method: 'PUT',
            body: JSON.stringify(parsedQuizData),
            headerKey: ['Content-Type', 'Cookie'],
            headerValue: ['application/json', cookieHeader],
            cache: { cache: 'no-store' },
        })

        const responseData = await safeJson<Record<string, any> | ApiError>(
            externalApiResponse
        )

        if (!externalApiResponse.ok) {
            return NextResponse.json(
                normalizeRouteError(responseData as ApiError),
                { status: externalApiResponse.status }
            )
        }

        if (!responseData) {
            return NextResponse.json(defaultServerError, { status: 500 })
        }

        const file = imageFile instanceof File ? imageFile : null

        if (!file || file.size === 0) {
            return NextResponse.json(
                { data: responseData },
                { status: 200 }
            )
        }

        const imageFormData = new FormData()
        imageFormData.append('quizImg', file, file.name)

        const externalApiResponseImage = await ApiData({
            path: `quiz-thumbnail/${quizId}`,
            method: 'PUT',
            body: imageFormData,
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        })

        const imageResponseData = await safeJson<ApiError | { quizThumbnail: string }>(
            externalApiResponseImage
        )

        if (!externalApiResponseImage.ok) {
            return NextResponse.json(
                {
                    data: responseData,
                    warning: normalizeRouteError(imageResponseData as ApiError),
                },
                { status: 200 }
            )
        }

        return NextResponse.json(
            {
                data: responseData,
                image: imageResponseData,
            },
            { status: 200 }
        )
    } catch (err) {
        console.error('[API ROUTE /api/quiz/edit] Erro inesperado:', err)

        return NextResponse.json(defaultServerError, { status: 500 })
    }
}