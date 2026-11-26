import { getTranslations } from 'next-intl/server'
import { Check, ChevronRight, Minus } from 'lucide-react'
import { ICompatibilityContent, IScoredContent, IStoryContent, ITournamentContent } from '@/interfaces/IExperience'
import { experienceTemplate } from '@/utils/experienceTemplates'
import { answerText, sortedRanges } from '@/utils/experiences'
import { ExperienceKind } from '@/utils/quizKind'
import { TStyles } from '@/types/stylesType'
import own from './experiences.module.scss'

interface IProps {
    kind: ExperienceKind
    locale: string
    // estilos da página do formato (o mesmo cartão das páginas de tipo de quiz)
    styles: TStyles
}

// porcentagens fixas do exemplo (ilustração, não são dados de partidas)
const SAMPLE_PERCENTS = [42, 31, 15]

// Como o formato fica para quem joga, com o conteúdo do modelo do idioma da página.
export default async function ExperiencePreview({ kind, locale, styles }: IProps) {
    const t = await getTranslations({ locale, namespace: 'experiencePages.preview' })
    const template = experienceTemplate(kind, locale)

    if (kind === 'tournament') {
        const { options } = template.content as ITournamentContent
        return (
            <div className={styles.preview} aria-hidden="true">
                <span className={styles.preview_label}>{t('tournament.label')}</span>
                <div className={styles.preview_header}><span>{t('tournament.round')}</span><strong>{t('tournament.duel')}</strong></div>
                <div className={own.mini_duel}>
                    <span className={`${own.mini_option} ${own.mini_option_picked}`}>{options[0].text}</span>
                    <span className={own.mini_versus}>VS</span>
                    <span className={own.mini_option}>{options[1].text}</span>
                </div>
                <div className={styles.preview_result}>
                    <span>{t('tournament.topTitle')}</span>
                    <ul>
                        {options.slice(0, 3).map((option, index) => (
                            <li key={option.optionId}>
                                <span>{option.text}</span>
                                <span className={styles.preview_bar}><span style={{ width: `${SAMPLE_PERCENTS[index]}%` }} /></span>
                                <span>{SAMPLE_PERCENTS[index]}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    if (kind === 'story') {
        const { scenes, startSceneId } = template.content as IStoryContent
        const start = scenes.find(scene => scene.sceneId === startSceneId) ?? scenes[0]
        const endings = scenes.filter(scene => scene.ending)
        return (
            <div className={styles.preview} aria-hidden="true">
                <span className={styles.preview_label}>{t('story.label')}</span>
                <div className={styles.preview_header}><span>{t('story.step')}</span></div>
                <p className={styles.preview_question}>{start.text}</p>
                <ul className={`${own.mini_choices} ${own.mini_choices_story}`}>
                    {start.choices.map(choice => <li key={choice.choiceId}><ChevronRight /> {choice.text}</li>)}
                </ul>
                <div className={styles.preview_result}>
                    <span>{t('story.endingLabel')}</span>
                    <strong>{endings[endings.length - 1]?.ending?.title}</strong>
                    <p>{t('story.endings', { total: endings.length })}</p>
                </div>
            </div>
        )
    }

    if (kind === 'compatibility') {
        const { questions } = template.content as ICompatibilityContent
        const partner = template.demoPartner
        const sampleName = t('compatibility.sampleName')
        // a pessoa do exemplo responde a primeira alternativa em todas
        const rows = questions.slice(0, 3).map(question => ({
            question,
            mine: question.answers[0].answerId,
            theirs: partner?.answers[question.questionId] ?? question.answers[0].answerId,
        }))
        return (
            <div className={styles.preview} aria-hidden="true">
                <span className={styles.preview_label}>{t('compatibility.label')}</span>
                <div className={styles.preview_result}>
                    <span>{sampleName} × {partner?.name}</span>
                    <strong>{t('compatibility.percent')}</strong>
                    <p>{t('compatibility.text')}</p>
                </div>
                <ul className={own.mini_compare}>
                    {rows.map(row => (
                        <li key={row.question.questionId}>
                            <span>{row.question.question}</span>
                            <small>{sampleName}: {answerText(row.question, row.mine)} · {partner?.name}: {answerText(row.question, row.theirs)}</small>
                            {row.mine === row.theirs ? <Check /> : <Minus />}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    const { questions, ranges } = template.content as IScoredContent
    const question = questions[0]
    const ordered = sortedRanges(ranges)
    return (
        <div className={styles.preview} aria-hidden="true">
            <span className={styles.preview_label}>{t('scored.label')}</span>
            <p className={styles.preview_question}>{question.question}</p>
            <ul className={own.mini_choices}>
                {question.answers.map(answer => (
                    <li key={answer.answerId}><span>{answer.text}</span><small>{t('scored.points', { points: answer.points ?? 0 })}</small></li>
                ))}
            </ul>
            <div className={styles.preview_result}>
                <span>{t('scored.resultLabel')}</span>
                <strong>{ordered[ordered.length - 1]?.title}</strong>
                <p>{t('scored.resultText', { min: ordered[ordered.length - 1]?.min ?? 0, max: ordered[ordered.length - 1]?.max ?? 0 })}</p>
            </div>
        </div>
    )
}
