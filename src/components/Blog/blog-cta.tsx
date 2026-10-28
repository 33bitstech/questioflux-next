'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { QuizKind } from '@/utils/quizKind'
import { trackEvent } from '@/utils/analytics'
import styles from '@/app/[locale]/(quizGroup)/blog/blog.module.scss'

interface IProps {
    slug: string
    href: string
    kind: QuizKind
}

// Chamada no fim do artigo para a página de criação do tipo de quiz do assunto. O clique vai
// para o Analytics: dá para ver quantas visitas ao blog viram criação de quiz.
export default function BlogCta({ slug, href, kind }: IProps) {
    const t = useTranslations('blogPage.cta')

    return (
        <aside className={styles.cta}>
            <h2>{t(`${kind}.title`)}</h2>
            <p>{t(`${kind}.text`)}</p>
            <Link href={href} onClick={() => trackEvent('select_content', { content_type: 'blog_cta', item_id: slug })}>
                {t(`${kind}.button`)}
            </Link>
        </aside>
    )
}
