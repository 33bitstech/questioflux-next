'use client'
import { TStyles } from '@/types/stylesType'
import { QuizKind, quizKinds } from '@/utils/quizKind'
import { useTranslations } from 'next-intl'
import InputTextQuiz from './input-text-quiz'

interface IProps {
    styles: TStyles
    value: QuizKind
    onChange: (kind: QuizKind) => void
    // tipos que não podem ser escolhidos (ex.: trocar para personalidade com perguntas já criadas)
    disabledKinds?: QuizKind[]
}

// Tipo do quiz na capa (criar e editar): perguntas e respostas, prova ou sobre mim.
export default function InputKindQuiz({ styles, value, onChange, disabledKinds = [] }: IProps) {
    const t = useTranslations('createQuizFlow.formComponent')

    return (
        <InputTextQuiz styles={styles} labelFor='kind' labelValue={t('labels.kind')}>
            <select id='kind' value={value} onChange={e => onChange(e.target.value as QuizKind)} aria-describedby='kind-hint'>
                {quizKinds.map(kind => (
                    <option key={kind} value={kind} disabled={disabledKinds.includes(kind)}>{t(`selects.kinds.${kind}`)}</option>
                ))}
            </select>
            <p id='kind-hint' className={styles.kind_hint}>
                {t(`kindHints.${value}`)}
                {disabledKinds.length > 0 && <> {t('kindLocked')}</>}
            </p>
        </InputTextQuiz>
    )
}
