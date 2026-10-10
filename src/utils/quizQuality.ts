// Decide se um quiz merece ser indexado (meta robots + sitemap).
// Arquivo sem imports de propósito: é a única fonte dessa regra e precisa
// rodar igual na página do quiz, no sitemap e em scripts de calibragem.
//
// score (0-100) = conteúdo (0-60) + metadados (0-30) + engajamento (0-10)
// Conteúdo no máximo passa sozinho; metadado + engajamento no máximo (40) não.

type RawAnswer = string | { answer?: string; text?: string; thumbnail?: string } | null | undefined

interface RawQuestion {
    question?: string
    title?: string
    image?: string
    answers?: RawAnswer[]
}

export interface QuizQualityInput {
    title?: string
    description?: string
    tags?: string[]
    quizThumbnail?: string
    isPrivate?: boolean
    draft?: boolean
    usersCount?: number
    // Precisa vir com as questões: listagens (explore, perfil) não servem para avaliar.
    questions?: RawQuestion[]
}

export interface QuizQualitySignals {
    isImageQuiz: boolean
    questions: number
    uniqueWords: number
    avgAnswers: number
    questionImages: number
    answerImages: number
    firstPersonQuestions: number
}

export type QuizQualityReason =
    | 'private' | 'draft' | 'title' | 'few-questions' | 'thin-text'
    | 'personal' | 'weak-metadata' | 'low-score'

export interface QuizQualityResult {
    indexable: boolean
    score: number
    content: number
    metadata: number
    engagement: number
    reason?: QuizQualityReason
    signals: QuizQualitySignals
}

export const QUALITY_THRESHOLD = 55

const MAX_CONTENT = 60
const MIN_TEXT_QUESTIONS = 4
const MIN_IMAGE_QUESTIONS = 2
const MIN_IMAGES = 2
const MIN_TEXT_WORDS = 25
// Abaixo disso o quiz quase não tem título/descrição/tags: só entra se gente de verdade jogou.
const WEAK_METADATA_TEXT = 12
const WEAK_METADATA_IMAGE = 8
const MIN_PLAYERS_WHEN_WEAK = 5
const PERSONAL_RATIO = 0.3

const hasImage = (src?: string) => !!src && src !== 'default'

const normalize = (text?: string) => (text ?? '').replace(/\s+/g, ' ').trim()

const plain = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const wordsOf = (text: string) => text.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) ?? []

// "Quiz sobre mim" / "quem me conhece": conteúdo sobre uma pessoa comum, não é para busca.
const FIRST_PERSON = /\b(eu|meu|meus|minha|minhas|mim|comigo|my|mine|myself|yo|mis|mio|mia|conmigo)\b|\b(do|did|am|was|have|would|can|will) i\b|\bi (am|was|have|like|love|hate|do|did|would|want|prefer)\b/
const PERSONAL_MARKER = /sobre mim|me conhece|about me|knows? me|sobre mi\b|me conoce|melhor(es)? amig|best friend|bestie|mejor(es)? amig|\bbff\b/

function getSignals(quiz: QuizQualityInput): QuizQualitySignals {
    const seen = new Set<string>()
    const vocabulary = new Set<string>()
    let questions = 0, answersTotal = 0, questionImages = 0, answerImages = 0, firstPersonQuestions = 0

    for (const q of quiz.questions ?? []) {
        const text = normalize(q.question || q.title)
        const image = hasImage(q.image)
        const key = `${text.toLowerCase()}|${image ? q.image : ''}`

        // Pergunta repetida (copiar e colar) não conta duas vezes.
        if ((!text && !image) || seen.has(key)) continue
        seen.add(key)

        const rawAnswers = q.answers ?? []
        const objects = rawAnswers.filter((a): a is { text?: string; thumbnail?: string } => !!a && typeof a === 'object')
        // Em quiz de imagem as alternativas são objetos; string solta ali é id, não texto.
        const texts = objects.length > 0
            ? objects.map(a => normalize(a.text))
            : rawAnswers.filter((a): a is string => typeof a === 'string').map(normalize)

        const distinct = new Set(texts.filter(Boolean).map(t => t.toLowerCase()))
        const images = objects.filter(a => hasImage(a.thumbnail)).length
        const options = Math.max(distinct.size, images)

        if (options < 2) continue

        questions++
        answersTotal += options
        if (image) questionImages++
        answerImages += images
        if (FIRST_PERSON.test(plain(text))) firstPersonQuestions++

        for (const word of wordsOf(text)) vocabulary.add(word)
        for (const answer of distinct) for (const word of wordsOf(answer)) vocabulary.add(word)
    }

    return {
        isImageQuiz: questionImages + answerImages >= MIN_IMAGES,
        questions,
        uniqueWords: vocabulary.size,
        avgAnswers: questions ? answersTotal / questions : 0,
        questionImages,
        answerImages,
        firstPersonQuestions,
    }
}

// Conteúdo (0-60): quanto texto e imagem próprios o quiz tem nas perguntas.
function contentScore(s: QuizQualitySignals) {
    const questionPts = Math.min(s.questions, 10) * 2
    const vocabularyPts = Math.min(s.uniqueWords, 200) / 200 * 30
    const choicePts = s.avgAnswers >= 4 ? 10 : s.avgAnswers >= 3 ? 7 : s.avgAnswers >= 2 ? 3 : 0
    // Imagem dá trabalho: cada uma vale muito mais que uma pergunta de texto.
    const imagePts = Math.min(s.questionImages * 10 + s.answerImages * 2.5, 45)

    return Math.min(questionPts + vocabularyPts + choicePts + imagePts, MAX_CONTENT)
}

// Metadados (0-30): o que vira título/snippet no Google.
function metadataScore(quiz: QuizQualityInput) {
    const description = normalize(quiz.description).length
    const tags = (quiz.tags ?? []).filter(tag => normalize(tag)).length
    const title = normalize(quiz.title)
    const titleWords = wordsOf(title).length

    const descriptionPts = description >= 150 ? 10 : description >= 80 ? 7 : description >= 40 ? 4 : description >= 20 ? 2 : 0
    const tagsPts = tags >= 5 ? 6 : tags >= 3 ? 4 : tags >= 1 ? 2 : 0
    const thumbnailPts = hasImage(quiz.quizThumbnail) ? 6 : 0
    const titlePts = titleWords >= 4 || title.length >= 25 ? 8 : titleWords >= 2 || title.length >= 12 ? 4 : 1

    return descriptionPts + tagsPts + thumbnailPts + titlePts
}

// Engajamento (0-10): gente de verdade jogou.
function engagementScore(usersCount = 0) {
    if (usersCount >= 50) return 10
    if (usersCount >= 20) return 8
    if (usersCount >= 10) return 6
    if (usersCount >= MIN_PLAYERS_WHEN_WEAK) return 4
    if (usersCount >= 2) return 2
    return 0
}

export function evaluateQuizQuality(quiz: QuizQualityInput): QuizQualityResult {
    const signals = getSignals(quiz)
    const { isImageQuiz } = signals

    const content = contentScore(signals)
    const metadata = metadataScore(quiz)
    const engagement = engagementScore(quiz.usersCount)
    const score = Math.round(content + metadata + engagement)

    const fail = (reason: QuizQualityReason): QuizQualityResult =>
        ({ indexable: false, score, content, metadata, engagement, reason, signals })

    if (quiz.isPrivate) return fail('private')
    if (quiz.draft) return fail('draft')
    if (normalize(quiz.title).length < 4) return fail('title')

    if (signals.questions < (isImageQuiz ? MIN_IMAGE_QUESTIONS : MIN_TEXT_QUESTIONS)) return fail('few-questions')
    if (!isImageQuiz && signals.uniqueWords < MIN_TEXT_WORDS) return fail('thin-text')

    const personal =
        signals.firstPersonQuestions / signals.questions >= PERSONAL_RATIO ||
        PERSONAL_MARKER.test(plain(`${quiz.title ?? ''} ${quiz.description ?? ''}`))
    if (personal) return fail('personal')

    const weakMetadata = metadata < (isImageQuiz ? WEAK_METADATA_IMAGE : WEAK_METADATA_TEXT)
    if (weakMetadata && (quiz.usersCount ?? 0) < MIN_PLAYERS_WHEN_WEAK) return fail('weak-metadata')

    if (score < QUALITY_THRESHOLD) return fail('low-score')

    return { indexable: true, score, content, metadata, engagement, signals }
}

export const isQuizIndexable = (quiz: QuizQualityInput) => evaluateQuizQuality(quiz).indexable
