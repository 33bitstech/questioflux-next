// Tipo do quiz, independente de ser de texto ou de imagem (isso é o campo "type").
// Quizzes criados antes do campo não o têm e valem como "quiz".
export const quizKinds = ['quiz', 'exam', 'aboutMe', 'personality'] as const

export type QuizKind = typeof quizKinds[number]

export const isQuizKind = (value: unknown): value is QuizKind =>
    typeof value === 'string' && (quizKinds as readonly string[]).includes(value)

export const getQuizKind = (quiz?: { kind?: unknown } | null): QuizKind =>
    isQuizKind(quiz?.kind) ? quiz.kind : 'quiz'

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

// /create/quiz/cover?type=exam (aceita também o slug, como em ?type=about-me)
export const quizKindFromParam = (value: unknown): QuizKind | undefined => {
    if (isQuizKind(value)) return value
    if (isQuizTypeSlug(value)) return quizTypeSlugs[value]
    return undefined
}
