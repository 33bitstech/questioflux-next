'use client'
import {
    IChoiceQuestion, ICompatibilityContent, IScoredContent, IStoryContent, ITournamentContent, TExperienceAnswer, TExperienceContent,
} from '@/interfaces/IExperience'
import { ExperienceKind } from '@/utils/quizKind'
import { answersList } from '@/utils/experiences'
import TournamentPlay from './tournament-play'
import StoryPlay from './story-play'
import QuestionsPlay from './questions-play'

interface IProps {
    kind: ExperienceKind
    content: TExperienceContent
    // a partida terminou: as respostas no formato que o backend confere
    onComplete: (answer: TExperienceAnswer) => void
    disabled?: boolean
}

// A partida de qualquer formato de experiência (a página de jogo e o exemplo jogável usam a
// mesma). Uma partida nova pede uma key nova (o estado fica dentro de cada componente).
export default function ExperiencePlayer({ kind, content, onComplete, disabled }: IProps) {
    switch (kind) {
        case 'tournament':
            return <TournamentPlay options={(content as ITournamentContent).options ?? []} onFinish={onComplete} disabled={disabled} />
        case 'story':
            return <StoryPlay content={content as IStoryContent} onEnding={answer => onComplete(answer)} disabled={disabled} />
        case 'compatibility':
        case 'scored': {
            const questions: IChoiceQuestion[] = (content as ICompatibilityContent | IScoredContent).questions ?? []
            return <QuestionsPlay questions={questions} onFinish={answers => onComplete({ answers: answersList(answers) })} disabled={disabled} />
        }
    }
}
