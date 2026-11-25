// Afinidade de tema entre dois quizzes, para ordenar "Mais quizzes para você". Usa só o que o
// quiz já tem (título e tags) e uma lista curta de franquias conhecidas, assim um quiz de
// Vingadores puxa os de MCU e Homem-Aranha antes de assuntos sem relação.

export interface ITopicSource {
    title: string
    tags?: string[]
}

// cada franquia com nomes e personagens que a identificam (sem acento, minúsculas)
const FRANCHISES: Record<string, string[]> = {
    marvel: ['marvel', 'mcu', 'avengers', 'vingadores', 'vengadores', 'spider man', 'spiderman', 'homem aranha', 'hombre arana', 'iron man', 'homem de ferro', 'thor', 'hulk', 'loki', 'x men', 'deadpool', 'wakanda', 'black panther', 'pantera negra', 'captain america', 'capitao america', 'capitan america', 'guardians of the galaxy', 'guardioes da galaxia', 'doctor strange', 'doutor estranho', 'thanos', 'wolverine'],
    dc: ['dc comics', 'batman', 'superman', 'wonder woman', 'mulher maravilha', 'mujer maravilla', 'justice league', 'liga da justica', 'liga de la justicia', 'joker', 'coringa', 'aquaman'],
    starwars: ['star wars', 'guerra nas estrelas', 'jedi', 'sith', 'mandalorian', 'skywalker', 'darth vader', 'yoda'],
    harrypotter: ['harry potter', 'hogwarts', 'hermione', 'dumbledore', 'voldemort', 'fantastic beasts', 'animais fantasticos', 'animales fantasticos'],
    pokemon: ['pokemon', 'pikachu', 'pokedex'],
    dragonball: ['dragon ball', 'dbz', 'goku', 'vegeta'],
    naruto: ['naruto', 'boruto', 'konoha', 'sasuke', 'akatsuki'],
    onepiece: ['one piece', 'luffy'],
    lotr: ['lord of the rings', 'senhor dos aneis', 'senor de los anillos', 'hobbit', 'tolkien', 'gandalf', 'frodo'],
    got: ['game of thrones', 'house of the dragon', 'westeros', 'targaryen'],
    disney: ['disney', 'pixar', 'frozen', 'toy story', 'moana', 'encanto', 'lion king', 'rei leao', 'rey leon'],
    minecraft: ['minecraft'],
    football: ['futebol', 'football', 'soccer', 'futbol', 'copa do mundo', 'world cup', 'mundial', 'champions league', 'brasileirao', 'premier league', 'la liga', 'messi', 'cristiano ronaldo', 'neymar', 'flamengo', 'corinthians', 'palmeiras', 'real madrid', 'barcelona'],
    kpop: ['kpop', 'k pop', 'bts', 'blackpink', 'twice', 'stray kids'],
}

// palavras que aparecem em quase todo título e não dizem o tema
const STOPWORDS = new Set([
    'quiz', 'quizz', 'quizzes', 'teste', 'test', 'trivia', 'prova', 'exam', 'simulado',
    'sobre', 'about', 'acerca', 'voce', 'you', 'your', 'seu', 'sua', 'tu', 'tus',
    'how', 'well', 'much', 'know', 'quanto', 'quantos', 'conhece', 'sabe', 'sabes', 'cuanto', 'conoces',
    'what', 'which', 'who', 'qual', 'quais', 'quem', 'que', 'quien', 'cual',
    'the', 'and', 'for', 'with', 'from', 'this', 'that', 'are', 'all', 'everything', 'tudo', 'todo', 'todos',
    'das', 'dos', 'del', 'los', 'las', 'una', 'uno', 'para', 'com', 'con', 'por', 'mais', 'mas', 'more',
    'melhor', 'best', 'mejor', 'perguntas', 'questions', 'preguntas', 'personality', 'personalidade', 'personalidad',
])

export function normalizeTopicText(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        // mantém letras de outros alfabetos (grego, cirílico, hebraico, árabe, devanágari,
        // tailandês, japonês, chinês e coreano)
        .replace(/[^a-z0-9\u0370-\u03ff\u0400-\u04ff\u0590-\u05ff\u0600-\u06ff\u0900-\u097f\u0e00-\u0e7f\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]+/g, ' ')
        .trim()
}

export interface ITopicProfile {
    franchises: Set<string>
    tags: Set<string>
    words: Set<string>
}

export function topicProfile(quiz: ITopicSource): ITopicProfile {
    const tags = (quiz.tags ?? []).map(normalizeTopicText).filter(Boolean)
    const text = ` ${[normalizeTopicText(quiz.title), ...tags].join(' ')} `

    const franchises = new Set(
        Object.entries(FRANCHISES)
            .filter(([, aliases]) => aliases.some(alias => text.includes(` ${alias} `)))
            .map(([franchise]) => franchise)
    )

    const words = new Set(
        text.split(' ').filter(word => word.length >= 3 && !STOPWORDS.has(word) && !/^\d+$/.test(word))
    )

    return { franchises, tags: new Set(tags), words }
}

const sharedCount = (a: Set<string>, b: Set<string>) => {
    let count = 0
    for (const item of a) if (b.has(item)) count++
    return count
}

// 0 = nada em comum; a mesma franquia pesa mais que uma tag igual, que pesa mais que uma palavra
export function topicSimilarity(a: ITopicProfile, b: ITopicProfile): number {
    return sharedCount(a.franchises, b.franchises) * 6
        + sharedCount(a.tags, b.tags) * 3
        + Math.min(sharedCount(a.words, b.words), 3)
}
