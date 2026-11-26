// Conteúdo dos formatos de experiência (campo "experience" do quiz). Mesmos formatos do
// backend (src/interfaces/IExperience.ts). Os ids são criados no editor: as escolhas da
// história apontam para as cenas por eles.

// ── torneio de favoritos ──
export interface ITournamentOption {
    optionId: string
    text: string
    // só pelo upload próprio; o editor nunca manda a URL
    image?: string
}

export interface ITournamentContent {
    // 8 opções = 7 duelos, 16 = 15, 32 = 31 e 64 = 63; 32 e 64 são do QuestioPlus
    size: 8 | 16 | 32 | 64
    options: ITournamentOption[]
}

// ── história interativa ──
export interface IStoryChoice {
    choiceId: string
    text: string
    nextSceneId: string
}

export interface IStoryScene {
    sceneId: string
    text: string
    choices: IStoryChoice[]
    // cena final: tem título e não tem escolhas
    ending?: { title: string }
}

export interface IStoryContent {
    startSceneId: string
    scenes: IStoryScene[]
}

// ── compatibilidade ──
export interface IChoiceAnswer {
    answerId: string
    text: string
    // só na pontuação, e só para quem criou (quem joga não recebe)
    points?: number
}

export interface IChoiceQuestion {
    questionId: string
    question: string
    answers: IChoiceAnswer[]
}

export interface ICompatibilityContent {
    questions: IChoiceQuestion[]
}

// ── pontuação por faixas ──
export interface IScoredRange {
    rangeId: string
    // total de pontos, com os dois limites incluídos
    min: number
    max: number
    title: string
    description: string
}

export interface IScoredContent {
    questions: IChoiceQuestion[]
    ranges: IScoredRange[]
}

export type TExperienceContent = ITournamentContent | IStoryContent | ICompatibilityContent | IScoredContent

// Problema no conteúdo, apontado pelo backend: "issues" impedem publicar, "warnings" só avisam.
export interface IExperienceIssue {
    code: string
    itemId?: string
    value?: number
}

export interface IExperienceCheck {
    issues: IExperienceIssue[]
    warnings: IExperienceIssue[]
}

// Contadores de todas as partidas (campo "experienceStats")
export interface IExperienceStats {
    // torneio: duelos disputados, vencidos e títulos por opção
    duels?: Record<string, number>
    wins?: Record<string, number>
    titles?: Record<string, number>
    // história: quantas vezes cada final foi alcançado
    endings?: Record<string, number>
    // compatibilidade: comparações feitas e soma das porcentagens
    comparisons?: number
    percentSum?: number
    // pontuação: quantas vezes cada faixa saiu e a soma dos pontos
    ranges?: Record<string, number>
    pointsSum?: number
}

// Respostas de uma partida, no formato que o backend confere
export interface ITournamentAnswer { bracket: string[], winners: string[] }
export interface IStoryAnswer { choices: string[] }
export interface IQuestionsAnswer { answers: Array<{ questionId: string, answerId: string }> }
export type TExperienceAnswer = ITournamentAnswer | IStoryAnswer | IQuestionsAnswer
