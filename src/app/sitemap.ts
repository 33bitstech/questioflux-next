import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getIndexableQuizzes } from '@/utils/publicQuiz'
import { quizCanonicalUrl, shellLanguages, SITE_URL } from '@/utils/seo'

// Regenerado no máximo uma vez por hora.
export const revalidate = 3600

// Páginas que existem nos 3 idiomas. Nada com noindex entra aqui.
const SHELL_PATHS = ['', '/explore', '/create/quiz', '/about-us']

const validDate = (value: string) => {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const shell: MetadataRoute.Sitemap = SHELL_PATHS.flatMap(path =>
        routing.locales.map(locale => ({
            url: `${SITE_URL}/${locale}${path}`,
            alternates: { languages: shellLanguages(path) },
        }))
    )

    try {
        // Uma URL por quiz: a canônica. Só entra o que a página serve como "index".
        const quizzes: MetadataRoute.Sitemap = (await getIndexableQuizzes()).map(quiz => ({
            url: quizCanonicalUrl(quiz),
            lastModified: validDate(quiz.updated_at),
            images: quiz.images,
        }))

        return [...shell, ...quizzes]
    } catch (err) {
        // Em produção, estourar faz o Next continuar servindo o último sitemap bom em vez
        // de trocar por um sem quizzes. No build e em dev não há versão anterior: sai só
        // com as páginas fixas.
        const hasPreviousVersion =
            process.env.NODE_ENV === 'production' &&
            process.env.NEXT_PHASE !== 'phase-production-build'

        if (hasPreviousVersion) throw err

        console.error(err)
        return shell
    }
}
