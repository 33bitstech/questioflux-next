// Tipo do quiz, independente de ser de texto ou de imagem (isso é o campo "type").
// Quizzes criados antes do campo não o têm e valem como "quiz".
//  - quiz, exam, aboutMe, personality: perguntas (com resposta certa ou com perfis)
//  - tournament, story, compatibility, scored: formatos de experiência, cada um com o seu
//    conteúdo (campo "experience") e sem ranking entre jogadores
export const questionKinds = ['quiz', 'exam', 'aboutMe', 'personality'] as const
export const experienceKinds = ['tournament', 'story', 'compatibility', 'scored'] as const
export const quizKinds = [...questionKinds, ...experienceKinds] as const

export type QuizKind = typeof quizKinds[number]
export type ExperienceKind = typeof experienceKinds[number]

export const isQuizKind = (value: unknown): value is QuizKind =>
    typeof value === 'string' && (quizKinds as readonly string[]).includes(value)

export const isExperienceKind = (value: unknown): value is ExperienceKind =>
    typeof value === 'string' && (experienceKinds as readonly string[]).includes(value)

export const getQuizKind = (quiz?: { kind?: unknown } | null): QuizKind =>
    isQuizKind(quiz?.kind) ? quiz.kind : 'quiz'

// Formatos com ranking (nota e posição). Nos outros, a lista de participantes vem das
// conclusões gravadas.
export const rankedKinds: readonly QuizKind[] = ['quiz', 'exam', 'aboutMe']

export const hasLeaderboard = (kind: QuizKind) => rankedKinds.includes(kind)

// Mesma regra do backend: sem ranking, o visitante pode jogar sem dar nome. Na
// compatibilidade o nome aparece para a outra pessoa da dupla, então é pedido.
export const allowsAnonymousPlay = (kind: QuizKind) =>
    kind === 'personality' || kind === 'tournament' || kind === 'story' || kind === 'scored'

// Família do conteúdo: com o conteúdo criado, o tipo só troca dentro da mesma família
// (trivia, prova e sobre mim usam as mesmas perguntas; os outros, cada um o seu).
export const contentFamily = (kind: QuizKind) => (hasLeaderboard(kind) ? 'questions' : kind)

// Mesma regra do backend: o quiz já teve os recursos pagos liberados (assinatura ou crédito
// avulso). Quizzes antigos sem a marca contam se já têm imagem ou mais de 10 perguntas.
export const isQuizPremiumUnlocked = (quiz?: { premiumUnlocked?: boolean, type?: string, qtdQuestions?: number } | null) =>
    quiz?.premiumUnlocked === true ||
    (quiz?.type === 'image/RW' && (quiz?.qtdQuestions ?? 0) > 0) ||
    (quiz?.qtdQuestions ?? 0) > 10

// Página de cada tipo em /create/quiz/[slug]. A ordem é a dos cards em /create/quiz.
export const quizTypeSlugs = {
    'questions-and-answers': 'quiz',
    'exam': 'exam',
    'about-me': 'aboutMe',
    'personality': 'personality',
} as const satisfies Record<string, QuizKind>

export type QuizTypeSlug = keyof typeof quizTypeSlugs

export const isQuizTypeSlug = (value: unknown): value is QuizTypeSlug =>
    typeof value === 'string' && value in quizTypeSlugs

export const quizKindSlug = (kind: QuizKind): QuizTypeSlug =>
    (Object.keys(quizTypeSlugs) as QuizTypeSlug[]).find(slug => quizTypeSlugs[slug] === kind) ?? 'questions-and-answers'

// Página de apresentação de cada tipo: /create/quiz/exam, /create/experiences/tournament.
// Nos formatos de experiência o slug é o próprio tipo.
export const quizKindHref = (kind: QuizKind): string =>
    isExperienceKind(kind) ? `/create/experiences/${kind}` : `/create/quiz/${quizKindSlug(kind)}`

// /create/quiz/cover?type=exam (aceita também o slug, como em ?type=about-me)
export const quizKindFromParam = (value: unknown): QuizKind | undefined => {
    if (isQuizKind(value)) return value
    if (isQuizTypeSlug(value)) return quizTypeSlugs[value]
    return undefined
}
