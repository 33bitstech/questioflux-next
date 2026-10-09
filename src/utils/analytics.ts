import IQuizes from '@/interfaces/IQuizes'

export const GA_MEASUREMENT_ID = 'G-J8VGB9PB8H'

declare global {
    interface Window {
        dataLayer?: unknown[]
        gtag?: (...args: unknown[]) => void
    }
}

type EventParams = Record<string, string | number | boolean | undefined>

// Eventos enviados ao Google Analytics. Os que têm nome recomendado pelo GA4
// (share, search, login, sign_up, select_content) usam esse nome para cair nos
// relatórios prontos; os de quiz começam com "quiz_".
export type AnalyticsEvent =
    | 'quiz_view'
    | 'quiz_questions_preview'
    | 'quiz_start'
    | 'quiz_progress'
    | 'quiz_complete'
    | 'quiz_abandon'
    | 'quiz_save'
    | 'quiz_unsave'
    | 'quiz_comment'
    | 'quiz_embed_copy'
    | 'quiz_create_start'
    | 'quiz_visibility_prompt'
    | 'quiz_create_complete'
    | 'share'
    | 'search'
    | 'login'
    | 'sign_up'
    | 'select_content'

// Fora do navegador, ou se a tag não estiver na página, não faz nada.
export function trackEvent(name: AnalyticsEvent, params: EventParams = {}) {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

    window.gtag('event', name, params)
}

// Os mesmos parâmetros em todo evento de quiz, para cruzar nos relatórios.
// O GA4 corta valores de texto em 100 caracteres.
export const quizParams = (quiz: Pick<IQuizes, 'quizId' | 'title' | 'category' | 'idiom' | 'type' | 'qtdQuestions'>) => ({
    quiz_id: quiz.quizId,
    quiz_title: (quiz.title ?? '').trim().slice(0, 100),
    quiz_category: quiz.category,
    quiz_language: quiz.idiom,
    quiz_type: quiz.type === 'image/RW' ? 'image' : 'text',
    quiz_questions: quiz.qtdQuestions,
})
