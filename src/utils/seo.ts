import { env } from '@/env'
import IQuizes from '@/interfaces/IQuizes'
import { AppLocale, getAppLocale } from '@/utils/locale'

export const SITE_URL = env.NEXT_PUBLIC_DOMAIN_FRONT.replace(/\/$/, '')

export const DEFAULT_QUIZ_IMAGE = `${SITE_URL}/quiz_padrao_preto.png`

// Mesmas chaves no <head> e no sitemap. `path` começa com "/" ou é vazio.
export const shellLanguages = (path = '') => ({
    'es': `${SITE_URL}/es${path}`,
    'en-US': `${SITE_URL}/en${path}`,
    'pt-BR': `${SITE_URL}/pt${path}`,
    'x-default': `${SITE_URL}/en${path}`,
})

// idiom vem do backend como 'PT-BR' | 'EN-US' | 'ES-ES' (ou 'en' nos quizzes antigos)
export const idiomToLocale = (idiom?: string): AppLocale => getAppLocale(idiom?.toLowerCase())

export const idiomToLanguageTag = (idiom?: string) =>
    ({ en: 'en-US', pt: 'pt-BR', es: 'es' })[idiomToLocale(idiom)]

// As perguntas não são traduzidas: /en, /pt e /es mostram o mesmo quiz. A canônica é
// a do idioma em que o quiz foi escrito, e a página de quiz não leva hreflang.
export const quizCanonicalUrl = (quiz: Pick<IQuizes, 'quizId' | 'idiom'>) =>
    `${SITE_URL}/${idiomToLocale(quiz.idiom)}/quiz/${quiz.quizId}`

export const quizImageUrl = (quiz: Pick<IQuizes, 'quizThumbnail'>) =>
    quiz.quizThumbnail && quiz.quizThumbnail !== 'default' ? quiz.quizThumbnail : DEFAULT_QUIZ_IMAGE

// Título, perguntas e nomes vêm de usuários: sem escapar "<", um "</script>" fecharia a tag.
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')
