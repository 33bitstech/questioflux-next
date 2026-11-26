import {
    IChoiceAnswer, IChoiceQuestion, ICompatibilityContent, IExperienceStats, IScoredContent, IScoredRange, IStoryChoice,
    IStoryContent, IStoryScene, ITournamentContent, ITournamentOption, TExperienceContent,
} from '@/interfaces/IExperience'
import { ExperienceKind } from './quizKind'
import { newAttemptKey } from './participationKeys'

// Regras dos formatos de experiência usadas no navegador: conteúdo inicial do editor,
// andamento das partidas e o resultado dos exemplos jogáveis (que não passam pelo servidor).
// Os limites são os mesmos do backend, que confere tudo de novo ao salvar e ao concluir.

export const EXPERIENCE_LIMITS = {
    optionText: 80,
    sceneText: 1200,
    choiceText: 120,
    endingTitle: 80,
    maxScenes: 60,
    maxChoices: 4,
    questionText: 200,
    answerText: 100,
    maxAnswers: 6,
    compatibilityMinQuestions: 3,
    compatibilityMaxQuestions: 30,
    scoredMinQuestions: 2,
    scoredMaxQuestions: 40,
    maxPoints: 100,
    minRanges: 2,
    maxRanges: 10,
    rangeTitle: 80,
    rangeDescription: 600,
} as const

// Tamanhos do torneio: 8 e 16 opções são grátis; 32 e 64 são do QuestioPlus (ou de um
// crédito do passe, que libera aquele torneio para sempre). O backend confere ao salvar.
export const TOURNAMENT_SIZES = [8, 16, 32, 64] as const
export type TTournamentSize = typeof TOURNAMENT_SIZES[number]

export const isTournamentSize = (value: unknown): value is TTournamentSize =>
    typeof value === 'number' && (TOURNAMENT_SIZES as readonly number[]).includes(value)

export const isPaidTournamentSize = (size: number) => size > 16

// ids no formato aceito pelo backend (letras, números, "-" e "_")
export const newItemId = () => newAttemptKey()

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

const text = (value: unknown) => (typeof value === 'string' ? value : '')
const id = (value: unknown) => (typeof value === 'string' && value ? value : newItemId())

// ── conteúdo inicial do editor ──

export const blankOption = (): ITournamentOption => ({ optionId: newItemId(), text: '' })
export const blankChoice = (nextSceneId = ''): IStoryChoice => ({ choiceId: newItemId(), text: '', nextSceneId })
export const blankScene = (): IStoryScene => ({ sceneId: newItemId(), text: '', choices: [blankChoice(), blankChoice()] })
export const blankAnswer = (points?: number): IChoiceAnswer => ({ answerId: newItemId(), text: '', ...(points !== undefined ? { points } : {}) })
export const blankQuestion = (withPoints = false): IChoiceQuestion => ({
    questionId: newItemId(),
    question: '',
    answers: withPoints ? [blankAnswer(0), blankAnswer(1)] : [blankAnswer(), blankAnswer()],
})
export const blankRange = (min = 0, max = 0): IScoredRange => ({ rangeId: newItemId(), min, max, title: '', description: '' })

export function emptyExperience(kind: ExperienceKind): TExperienceContent {
    switch (kind) {
        case 'tournament':
            return { size: 8, options: Array.from({ length: 8 }, blankOption) }
        case 'story': {
            const start = blankScene()
            return { startSceneId: start.sceneId, scenes: [start] }
        }
        case 'compatibility':
            return { questions: Array.from({ length: 3 }, () => blankQuestion()) }
        case 'scored':
            return { questions: [blankQuestion(true), blankQuestion(true)], ranges: [blankRange(0, 1), blankRange(2, 2)] }
    }
}

const editableQuestions = (raw: unknown, withPoints: boolean): IChoiceQuestion[] =>
    (Array.isArray(raw) ? raw : []).map(item => {
        const question = isObject(item) ? item : {}
        return {
            questionId: id(question.questionId),
            question: text(question.question),
            answers: (Array.isArray(question.answers) ? question.answers : []).map(entry => {
                const answer = isObject(entry) ? entry : {}
                const points = Number(answer.points)
                return {
                    answerId: id(answer.answerId),
                    text: text(answer.text),
                    ...(withPoints ? { points: Number.isFinite(points) ? points : 0 } : {}),
                }
            }),
        }
    })

// Conteúdo salvo, completo para o editor (vazio, de outra versão ou com partes faltando).
export function editableExperience(kind: ExperienceKind, raw: unknown): TExperienceContent {
    const source = isObject(raw) ? raw : {}

    switch (kind) {
        case 'tournament': {
            const options = (Array.isArray(source.options) ? source.options : []).map(item => {
                const option = isObject(item) ? item : {}
                return { optionId: id(option.optionId), text: text(option.text), ...(typeof option.image === 'string' && option.image ? { image: option.image } : {}) }
            })
            return options.length ? { size: isTournamentSize(source.size) ? source.size : 8, options } : emptyExperience(kind)
        }
        case 'story': {
            const scenes: IStoryScene[] = (Array.isArray(source.scenes) ? source.scenes : []).map(item => {
                const scene = isObject(item) ? item : {}
                const ending = isObject(scene.ending) ? { title: text(scene.ending.title) } : undefined
                return {
                    sceneId: id(scene.sceneId),
                    text: text(scene.text),
                    choices: ending ? [] : (Array.isArray(scene.choices) ? scene.choices : []).map(entry => {
                        const choice = isObject(entry) ? entry : {}
                        return { choiceId: id(choice.choiceId), text: text(choice.text), nextSceneId: text(choice.nextSceneId) }
                    }),
                    ...(ending ? { ending } : {}),
                }
            })
            if (!scenes.length) return emptyExperience(kind)
            const startSceneId = scenes.some(scene => scene.sceneId === source.startSceneId) ? source.startSceneId as string : scenes[0].sceneId
            return { startSceneId, scenes }
        }
        case 'compatibility': {
            const questions = editableQuestions(source.questions, false)
            return questions.length ? { questions } : emptyExperience(kind)
        }
        case 'scored': {
            const questions = editableQuestions(source.questions, true)
            const ranges = (Array.isArray(source.ranges) ? source.ranges : []).map(item => {
                const range = isObject(item) ? item : {}
                return {
                    rangeId: id(range.rangeId),
                    min: Number.isFinite(Number(range.min)) ? Number(range.min) : 0,
                    max: Number.isFinite(Number(range.max)) ? Number(range.max) : 0,
                    title: text(range.title),
                    description: text(range.description),
                }
            })
            return questions.length || ranges.length ? { questions, ranges } : emptyExperience(kind)
        }
    }
}

// ── torneio ──

export function shuffled<T>(items: readonly T[]): T[] {
    const list = [...items]
    for (let index = list.length - 1; index > 0; index--) {
        const other = Math.floor(Math.random() * (index + 1));
        [list[index], list[other]] = [list[other], list[index]]
    }
    return list
}

export interface ITournamentDuel {
    round: number
    // opções que ainda estavam na rodada (8 = quartas de final, 2 = final)
    roundSize: number
    a: string
    b: string
    winnerId?: string
}

// Em que duelo a partida está, pela chave e pelos vencedores escolhidos até agora.
export function tournamentState(bracket: readonly string[], winners: readonly string[]) {
    const totalDuels = Math.max(bracket.length - 1, 0)
    let round = [...bracket],
        roundNumber = 1,
        used = 0

    while (round.length > 1) {
        const pairs = round.length / 2,
            decided = winners.slice(used, used + pairs)

        if (decided.length < pairs) {
            const index = decided.length
            const duel: ITournamentDuel = { round: roundNumber, roundSize: round.length, a: round[index * 2], b: round[index * 2 + 1] }
            return { duel, duelNumber: used + index + 1, totalDuels, champion: undefined }
        }

        round = decided
        used += pairs
        roundNumber++
    }

    return { duel: undefined, duelNumber: totalDuels, totalDuels, champion: round[0] as string | undefined }
}

// Todos os duelos de uma partida concluída, rodada a rodada.
export function tournamentDuels(bracket: readonly string[], winners: readonly string[]): ITournamentDuel[] {
    const duels: ITournamentDuel[] = []
    let round = [...bracket],
        roundNumber = 1,
        used = 0

    while (round.length > 1) {
        const next: string[] = []
        for (let index = 0; index + 1 < round.length; index += 2) {
            const winnerId = winners[used++]
            if (!winnerId) return duels
            duels.push({ round: roundNumber, roundSize: round.length, a: round[index], b: round[index + 1], winnerId })
            next.push(winnerId)
        }
        round = next
        roundNumber++
    }

    return duels
}

// chave de tradução da rodada pelo número de opções nela
export const roundKey = (roundSize: number) =>
    roundSize <= 2 ? 'final'
        : roundSize <= 4 ? 'semifinal'
            : roundSize <= 8 ? 'quarterfinal'
                : roundSize <= 16 ? 'roundOf16'
                    : roundSize <= 32 ? 'roundOf32'
                        : 'roundOf64'

export interface IOptionRanking {
    option: ITournamentOption
    titles: number
    wins: number
    duels: number
    // vitórias por duelo disputado, de 0 a 100
    winRate: number
}

// Opções que mais venceram entre todas as partidas concluídas (estatística das opções, não
// ranking de jogadores): títulos primeiro, depois o aproveitamento nos duelos.
export function optionRanking(content: ITournamentContent | undefined, stats: IExperienceStats | undefined): IOptionRanking[] {
    return (content?.options ?? [])
        .map(option => {
            const wins = Number(stats?.wins?.[option.optionId]) || 0,
                duels = Number(stats?.duels?.[option.optionId]) || 0
            return {
                option,
                titles: Number(stats?.titles?.[option.optionId]) || 0,
                wins,
                duels,
                winRate: duels ? Math.round(wins / duels * 100) : 0,
            }
        })
        .filter(item => item.duels > 0)
        .sort((a, b) => b.titles - a.titles || b.winRate - a.winRate || b.wins - a.wins)
}

// ── história ──

export const storyEndings = (content?: IStoryContent) => (content?.scenes ?? []).filter(scene => scene.ending)

export const sceneById = (content: IStoryContent | undefined, sceneId: string) =>
    content?.scenes.find(scene => scene.sceneId === sceneId)

// ── perguntas (compatibilidade e pontuação) ──

export const answersList = (answers: Record<string, string>) =>
    Object.entries(answers).map(([questionId, answerId]) => ({ questionId, answerId }))

export const percentOf = (part: number, total: number) => (total > 0 ? Math.round(part / total * 100) : 0)

// Mesma conta do backend: perguntas atuais que os dois responderam, e em quantas a resposta
// foi a mesma.
export function compareAnswers(content: ICompatibilityContent | undefined, mine: Record<string, string>, theirs: Record<string, string>) {
    const valid = (question: IChoiceQuestion, answerId?: string) => !!answerId && question.answers.some(answer => answer.answerId === answerId)
    const common = (content?.questions ?? []).filter(question => valid(question, mine[question.questionId]) && valid(question, theirs[question.questionId]))
    const matched = common.filter(question => mine[question.questionId] === theirs[question.questionId]).map(question => question.questionId)
    return { percent: percentOf(matched.length, common.length), matched, total: common.length }
}

export const answerText = (question: IChoiceQuestion | undefined, answerId?: string) =>
    question?.answers.find(answer => answer.answerId === answerId)?.text

export function scoredBounds(questions: IChoiceQuestion[]): { min: number, max: number } | undefined {
    if (!questions.length || questions.some(question => !question.answers.length)) return undefined
    return questions.reduce((bounds, question) => {
        const points = question.answers.map(answer => Number(answer.points) || 0)
        return { min: bounds.min + Math.min(...points), max: bounds.max + Math.max(...points) }
    }, { min: 0, max: 0 })
}

export const sortedRanges = (ranges: IScoredRange[]) => [...ranges].sort((a, b) => a.min - b.min || a.max - b.max)

export const rangeFor = (ranges: IScoredRange[], points: number) =>
    sortedRanges(ranges).find(range => range.min <= points && points <= range.max)

// resultado do exemplo jogável (o conteúdo do modelo tem os pontos)
export function scoredOutcome(content: IScoredContent, answers: Record<string, string>) {
    const points = content.questions.reduce((sum, question) => {
        const answer = question.answers.find(item => item.answerId === answers[question.questionId])
        return sum + (Number(answer?.points) || 0)
    }, 0)
    return { points, range: rangeFor(content.ranges, points) }
}

// Divide o intervalo de pontos possíveis em faixas seguidas, sem buraco nem sobreposição.
export function suggestRanges(ranges: IScoredRange[], bounds: { min: number, max: number }): IScoredRange[] {
    const count = Math.max(1, Math.min(ranges.length, bounds.max - bounds.min + 1)),
        span = bounds.max - bounds.min + 1,
        size = Math.floor(span / count),
        extra = span % count

    let start = bounds.min
    return ranges.slice(0, count).map((range, index) => {
        const width = size + (index < extra ? 1 : 0),
            next = { ...range, min: start, max: start + width - 1 }
        start += width
        return next
    })
}

// Duelos de que a campeã participou, rodada a rodada (o caminho até o título)
export const championPath = (duels: readonly ITournamentDuel[], championId: string) =>
    duels
        .filter(duel => duel.winnerId === championId && (duel.a === championId || duel.b === championId))
        .map(duel => ({ roundSize: duel.roundSize, opponentId: duel.a === championId ? duel.b : duel.a }))

// Cena em que uma sequência de escolhas termina (o final do exemplo jogável)
export function walkStory(content: IStoryContent, choiceIds: readonly string[]): IStoryScene | undefined {
    let scene = sceneById(content, content.startSceneId)
    for (const choiceId of choiceIds) {
        const choice = scene?.choices.find(item => item.choiceId === choiceId)
        scene = choice ? sceneById(content, choice.nextSceneId) : undefined
        if (!scene) return undefined
    }
    return scene
}

export const answersMap = (answers: ReadonlyArray<{ questionId: string, answerId: string }>) =>
    Object.fromEntries(answers.map(item => [item.questionId, item.answerId])) as Record<string, string>
