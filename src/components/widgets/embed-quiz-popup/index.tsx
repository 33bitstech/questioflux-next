'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

interface IProps {
    styles: Record<string, string>
    quizId: string
    locale: string
    domain: string
    quizTitle: string
}

function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

export default function EmbedQuizPopup({
    styles,
    quizId,
    locale,
    domain,
    quizTitle
}: IProps) {
    const t = useTranslations('quizInfoPage.embed')

    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const embedCode = useMemo(() => {
        const baseUrl = domain.replace(/\/$/, '')

        const embedUrl = `${baseUrl}/${locale}/embed/quiz/${quizId}`
        const quizUrl = `${baseUrl}/${locale}/quiz/${quizId}`

        return `<div style="max-width: 850px; margin: 0 auto;">
  <iframe
    title="${escapeHtml(quizTitle)} - QuestioFlux"
    src="${embedUrl}"
    width="100%"
    height="650"
    style="border:0; border-radius:12px; overflow:hidden;"
    loading="lazy"
    allowfullscreen
  ></iframe>

  <p style="font-size:14px; text-align:center; margin:8px 0 0;">
    ${escapeHtml(t('createdWith'))}
    <a href="${quizUrl}" target="_blank" rel="noopener noreferrer">
      QuestioFlux
    </a>
  </p>
</div>`
    }, [domain, locale, quizId, quizTitle, t])

    const fallbackCopy = () => {
        const textarea = document.createElement('textarea')
        textarea.value = embedCode
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'

        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
    }

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(embedCode)
        } catch {
            fallbackCopy()
        }

        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    return (
        <>
            <button
                type="button"
                className={styles.embed_quiz_button}
                onClick={() => setIsOpen(true)}
            >
                {t('button')}
            </button>

            {isOpen && (
                <>
                    <button
                        type="button"
                        className={styles.embed_overlay}
                        aria-label={t('close')}
                        onClick={() => setIsOpen(false)}
                    />

                    <section
                        className={styles.embed_popup}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="embed-popup-title"
                    >
                        <div className={styles.embed_popup_header}>
                            <div>
                                <h3 id="embed-popup-title">
                                    {t('title')}
                                </h3>

                                <p>{t('description')}</p>
                            </div>

                            <button
                                type="button"
                                className={styles.embed_close_button}
                                aria-label={t('close')}
                                onClick={() => setIsOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.embed_code_header}>
                            <span>{t('codeLabel')}</span>

                            <button
                                type="button"
                                onClick={handleCopy}
                                data-copied={copied}
                            >
                                {copied ? t('copiedButton') : t('copyButton')}
                            </button>
                        </div>

                        <textarea
                            className={styles.embed_code_textarea}
                            value={embedCode}
                            readOnly
                            onFocus={(e) => e.currentTarget.select()}
                        />
                    </section>
                </>
            )}
        </>
    )
}