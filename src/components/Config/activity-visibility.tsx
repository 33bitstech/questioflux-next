'use client'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { getActivityVisibility, updateActivityVisibility } from '@/app/[locale]/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { getLocalizedMessage } from '@/utils/getLocalizedMessage'
import { TStyles } from '@/types/stylesType'

interface IProps {
    styles: TStyles
}

// Configurações: "Mostrar minha atividade em quizzes". Desligado, o nome e o resultado
// somem das listas de participantes e dos rankings para as outras pessoas; os totais
// dos quizzes continuam iguais e a pessoa continua vendo os próprios resultados.
export default function ActivityVisibility({ styles }: IProps) {
    const t = useTranslations('configPage.activity')
    const locale = useLocale()
    const { setError, setSucess } = useGlobalMessage()

    // undefined = carregando
    const [showActivity, setShowActivity] = useState<boolean>()
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        getActivityVisibility().then(res => setShowActivity(res.showActivity ?? true))
    }, [])

    const toggle = async () => {
        if (showActivity === undefined || saving) return

        const next = !showActivity
        setSaving(true)
        setShowActivity(next)

        const res = await updateActivityVisibility(next)
        setSaving(false)

        if (res.err) {
            setShowActivity(!next)
            return setError(getLocalizedMessage(res.err, locale, t('error')))
        }

        setSucess(next ? t('shownMessage') : t('hiddenMessage'))
    }

    return (
        <div className={styles.activity}>
            <h2>{t('title')}</h2>
            <label className={styles.activity_toggle}>
                <span className={styles.activity_text}>
                    <strong>{t('label')}</strong>
                    <span>{t('help')}</span>
                </span>
                <input
                    type="checkbox"
                    role="switch"
                    checked={showActivity ?? true}
                    disabled={showActivity === undefined || saving}
                    aria-checked={showActivity ?? true}
                    onChange={toggle}
                />
            </label>
            {showActivity === false && <p className={styles.activity_note}>{t('hiddenNote')}</p>}
        </div>
    )
}
