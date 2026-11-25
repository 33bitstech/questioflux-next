import { getTranslations } from 'next-intl/server'
import IQuizes from '@/interfaces/IQuizes'
import { IChoiceQuestion, ICompatibilityContent, IScoredContent, IStoryContent, ITournamentContent } from '@/interfaces/IExperience'
import { sortedRanges, storyEndings } from '@/utils/experiences'
import { getQuizKind } from '@/utils/quizKind'
import { TStyles } from '@/types/stylesType'
import { TrackedDetails } from '../Google/analytics-widgets'

interface IProps {
    quiz: IQuizes
    locale: string
    // estilos da página do quiz (mesmos blocos de "possíveis resultados" e "perguntas")
    styles: TStyles
    analyticsParams: Record<string, string | number | undefined>
}

function QuestionsList({ questions, styles, t, analyticsParams }: { questions: IChoiceQuestion[], styles: TStyles, t: (key: string, values?: Record<string, number>) => string, analyticsParams: IProps['analyticsParams'] }) {
    if (!questions.length) return null
    return (
        <section className={styles.questions_preview}>
            <h2>{t('questionsTitle')}</h2>
            {/* fechado por padrão; o texto já vem no HTML, então o Google lê sem clicar */}
            <TrackedDetails event='quiz_questions_preview' params={analyticsParams}>
                <summary>{t('questionsSummary', { count: questions.length })}</summary>
                <ol>
                    {questions.map(question => (
                        <li key={question.questionId}>
                            <h3>{question.question}</h3>
                            <p>{t('alternatives', { count: question.answers.length })}</p>
                        </li>
                    ))}
                </ol>
            </TrackedDetails>
        </section>
    )
}

// O que há dentro de um torneio, história, compatibilidade ou pontuação, na página do quiz.
// Sem estragar o jogo: a história mostra só quantas cenas e finais tem.
export default async function ExperienceQuizPreview({ quiz, locale, styles, analyticsParams }: IProps) {
    const t = await getTranslations({ locale, namespace: 'quizInfoPage.experience' })
    const kind = getQuizKind(quiz)

    if (kind === 'tournament') {
        const options = (quiz.experience as ITournamentContent | undefined)?.options ?? []
        if (!options.length) return null
        return (
            <section className={styles.possible_results}>
                <h2>{t('tournamentTitle')}</h2>
                <p>{t('tournamentText', { count: options.length, duels: Math.max(options.length - 1, 0) })}</p>
                <ul>
                    {options.map(option => (
                        <li key={option.optionId}>
                            {option.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={option.image} alt={`${option.text} – ${quiz.title}`} loading="lazy" decoding="async" />
                            )}
                            <span>{option.text}</span>
                        </li>
                    ))}
                </ul>
            </section>
        )
    }

    if (kind === 'story') {
        const content = quiz.experience as IStoryContent | undefined
        const scenes = content?.scenes?.length ?? 0
        if (!scenes) return null
        return (
            <section className={styles.possible_results}>
                <h2>{t('storyTitle')}</h2>
                <p>{t('storyText', { scenes, endings: storyEndings(content).length })}</p>
            </section>
        )
    }

    if (kind === 'compatibility') {
        return <QuestionsList questions={(quiz.experience as ICompatibilityContent | undefined)?.questions ?? []} styles={styles} t={t} analyticsParams={analyticsParams} />
    }

    if (kind === 'scored') {
        const content = quiz.experience as IScoredContent | undefined
        const ranges = sortedRanges(content?.ranges ?? [])
        return (
            <>
                {ranges.length > 0 && (
                    <section className={styles.possible_results}>
                        <h2>{t('rangesTitle')}</h2>
                        <p>{t('rangesText', { count: ranges.length })}</p>
                        <ul>
                            {ranges.map(range => <li key={range.rangeId}><span>{range.title}</span></li>)}
                        </ul>
                    </section>
                )}
                <QuestionsList questions={content?.questions ?? []} styles={styles} t={t} analyticsParams={analyticsParams} />
            </>
        )
    }

    return null
}
