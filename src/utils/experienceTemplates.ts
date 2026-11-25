import { ICompatibilityContent, IScoredContent, IStoryContent, ITournamentContent, TExperienceContent } from '@/interfaces/IExperience'
import { TFilter } from '@/types/filtersType'
import { AppLocale, getAppLocale } from './locale'
import { ExperienceKind } from './quizKind'

// Modelo de cada formato: é o exemplo jogável da página do formato e o ponto de partida de
// "Usar este modelo" (vira um rascunho novo, de quem clicou, com tudo editável). Os textos
// são escritos para cada idioma.

export interface IExperienceTemplate {
    kind: ExperienceKind
    title: string
    description: string
    category: TFilter
    tags: string[]
    content: TExperienceContent
    // compatibilidade: no exemplo, a comparação é com estas respostas
    demoPartner?: { name: string, answers: Record<string, string> }
}

type TLocalized<T> = Record<AppLocale, T>

// ── torneio ──

const tournamentOptions: TLocalized<string[]> = {
    pt: ['Calabresa', 'Marguerita', 'Quatro queijos', 'Portuguesa', 'Frango com catupiry', 'Pepperoni', 'Napolitana', 'Brigadeiro'],
    en: ['Pepperoni', 'Margherita', 'Four cheese', 'Hawaiian', 'BBQ chicken', 'Meat lovers', 'Veggie', 'Buffalo chicken'],
    es: ['Margarita', 'Pepperoni', 'Cuatro quesos', 'Hawaiana', 'Barbacoa', 'Napolitana', 'Carbonara', 'Jamón y champiñones'],
    zh: ['意式辣香肠', '玛格丽特', '四重奶酪', '夏威夷', '烧烤鸡肉', '榴莲', '海鲜', '田园蔬菜'],
}

const tournamentInfo: TLocalized<Pick<IExperienceTemplate, 'title' | 'description' | 'tags'>> = {
    pt: { title: 'Qual é a melhor pizza?', description: '8 sabores, 7 duelos: escolha a sua preferida em cada par até sobrar a campeã.', tags: ['pizza', 'comida', 'torneio'] },
    en: { title: "What's the best pizza?", description: '8 pizzas, 7 head-to-head duels: pick your favorite in each matchup until one champion is left.', tags: ['pizza', 'food', 'bracket'] },
    es: { title: '¿Cuál es la mejor pizza?', description: '8 sabores, 7 duelos: elige tu favorita en cada pareja hasta que quede una campeona.', tags: ['pizza', 'comida', 'torneo'] },
    zh: { title: '哪种披萨最好吃？', description: '8 种口味、7 场对决：每一组选出你更喜欢的，直到决出冠军。', tags: ['披萨', '美食', '对决'] },
}

const tournamentContent = (locale: AppLocale): ITournamentContent => ({
    size: 8,
    options: tournamentOptions[locale].map((text, index) => ({ optionId: `pizza-${index + 1}`, text })),
})

// ── história ──

interface IStoryTexts {
    start: string, toRiver: string, toHill: string
    river: string, crossBridge: string, followBank: string
    hill: string, goVillage: string, enterCave: string
    village: string, askWho: string, askShelter: string
    cave: string, openChest: string, goBack: string
    heirTitle: string, heir: string
    partyTitle: string, party: string
    treasureTitle: string, treasure: string
}

const storyTexts: TLocalized<IStoryTexts> = {
    pt: {
        start: 'Você acorda numa clareira, no meio de uma floresta que não conhece. Ao longe, ouve o barulho de um rio; do outro lado, vê uma colina.',
        toRiver: 'Seguir o som do rio', toHill: 'Subir a colina',
        river: 'O rio leva a uma ponte velha de madeira. Do outro lado, aparecem as luzes de uma vila.',
        crossBridge: 'Atravessar a ponte', followBank: 'Seguir pela margem',
        hill: 'Do alto da colina você vê a vila iluminada e, mais perto, a entrada escura de uma caverna.',
        goVillage: 'Descer até a vila', enterCave: 'Entrar na caverna',
        village: 'Na praça, os moradores param de conversar e olham para você. Uma senhora diz que esperavam alguém vindo da floresta.',
        askWho: 'Perguntar quem eles esperavam', askShelter: 'Pedir abrigo para a noite',
        cave: 'Lá dentro, na pouca luz que entra pela fresta, um baú coberto de musgo brilha no chão.',
        openChest: 'Abrir o baú', goBack: 'Voltar para a clareira',
        heirTitle: 'O herdeiro perdido', heir: 'Você descobre que é o herdeiro que a vila esperava havia anos. Amanhã começa uma vida nova.',
        partyTitle: 'Uma noite de festa', party: 'A vila comemora a sua chegada com música e comida até o amanhecer. Ninguém pergunta de onde você veio.',
        treasureTitle: 'O tesouro esquecido', treasure: 'O baú guarda moedas antigas e um mapa com o caminho de casa.',
    },
    en: {
        start: "You wake up in a clearing, in the middle of a forest you don't recognize. In the distance you hear a river; on the other side, there's a hill.",
        toRiver: 'Follow the sound of the river', toHill: 'Climb the hill',
        river: 'The river leads to an old wooden bridge. On the far side, the lights of a village flicker.',
        crossBridge: 'Cross the bridge', followBank: 'Walk along the bank',
        hill: 'From the top of the hill you can see the lit-up village and, closer by, the dark mouth of a cave.',
        goVillage: 'Head down to the village', enterCave: 'Go into the cave',
        village: 'In the square, people stop talking and stare at you. An old woman says they were waiting for someone to come out of the forest.',
        askWho: 'Ask who they were waiting for', askShelter: 'Ask for a place to stay the night',
        cave: 'Inside, in the thin light coming through a crack, a moss-covered chest glints on the ground.',
        openChest: 'Open the chest', goBack: 'Go back to the clearing',
        heirTitle: 'The lost heir', heir: "You find out you're the heir the village has been waiting for. Tomorrow a new life begins.",
        partyTitle: 'A night to celebrate', party: 'The village throws a party for you, with music and food until sunrise. Nobody asks where you came from.',
        treasureTitle: 'The forgotten treasure', treasure: 'The chest holds old coins and a map showing the way home.',
    },
    es: {
        start: 'Despiertas en un claro, en medio de un bosque que no conoces. A lo lejos se oye un río; del otro lado, ves una colina.',
        toRiver: 'Seguir el sonido del río', toHill: 'Subir la colina',
        river: 'El río lleva a un viejo puente de madera. Al otro lado se ven las luces de un pueblo.',
        crossBridge: 'Cruzar el puente', followBank: 'Seguir por la orilla',
        hill: 'Desde lo alto de la colina ves el pueblo iluminado y, más cerca, la entrada oscura de una cueva.',
        goVillage: 'Bajar al pueblo', enterCave: 'Entrar en la cueva',
        village: 'En la plaza, la gente deja de hablar y te mira. Una señora dice que esperaban a alguien que viniera del bosque.',
        askWho: 'Preguntar a quién esperaban', askShelter: 'Pedir dónde pasar la noche',
        cave: 'Dentro, con la poca luz que entra por una grieta, un cofre cubierto de musgo brilla en el suelo.',
        openChest: 'Abrir el cofre', goBack: 'Volver al claro',
        heirTitle: 'El heredero perdido', heir: 'Descubres que eres el heredero que el pueblo esperaba desde hace años. Mañana empieza una vida nueva.',
        partyTitle: 'Una noche de fiesta', party: 'El pueblo celebra tu llegada con música y comida hasta el amanecer. Nadie pregunta de dónde vienes.',
        treasureTitle: 'El tesoro olvidado', treasure: 'El cofre guarda monedas antiguas y un mapa con el camino a casa.',
    },
    zh: {
        start: '你在一片林间空地上醒来，四周是一片陌生的森林。远处传来河水声，另一边是一座小山丘。',
        toRiver: '循着河水声走', toHill: '爬上山丘',
        river: '河流通向一座旧木桥。桥的另一头，一个村庄亮着灯火。',
        crossBridge: '过桥', followBank: '沿着河岸走',
        hill: '站在山顶，你看到灯火通明的村庄，近处还有一个漆黑的山洞入口。',
        goVillage: '下山去村庄', enterCave: '走进山洞',
        village: '广场上的人们停下交谈，都看着你。一位老奶奶说，他们一直在等一个从森林里走出来的人。',
        askWho: '问他们在等谁', askShelter: '请求借住一晚',
        cave: '洞里只有从石缝透进来的微光，地上一个长满青苔的箱子闪着光。',
        openChest: '打开箱子', goBack: '回到空地',
        heirTitle: '失落的继承人', heir: '你发现自己就是村庄等待多年的继承人。新的生活从明天开始。',
        partyTitle: '欢庆之夜', party: '村民们用音乐和美食庆祝你的到来，一直到天亮。没有人问你从哪里来。',
        treasureTitle: '被遗忘的宝藏', treasure: '箱子里有古老的钱币，还有一张画着回家路线的地图。',
    },
}

const storyInfo: TLocalized<Pick<IExperienceTemplate, 'title' | 'description' | 'tags'>> = {
    pt: { title: 'A floresta misteriosa', description: 'Uma história curta com escolhas: cada decisão abre um caminho diferente e leva a um de três finais.', tags: ['história interativa', 'aventura', 'escolhas'] },
    en: { title: 'The mysterious forest', description: 'A short choose-your-path story: every decision opens a different route to one of three endings.', tags: ['interactive story', 'adventure', 'choices'] },
    es: { title: 'El bosque misterioso', description: 'Una historia corta con decisiones: cada elección abre un camino distinto hacia uno de tres finales.', tags: ['historia interactiva', 'aventura', 'decisiones'] },
    zh: { title: '神秘的森林', description: '一个简短的互动故事：每个选择都会走向不同的路线，最终到达三个结局之一。', tags: ['互动故事', '冒险', '选择'] },
}

function storyContent(locale: AppLocale): IStoryContent {
    const s = storyTexts[locale]
    const choice = (choiceId: string, text: string, nextSceneId: string) => ({ choiceId, text, nextSceneId })

    return {
        startSceneId: 'start',
        scenes: [
            { sceneId: 'start', text: s.start, choices: [choice('to-river', s.toRiver, 'river'), choice('to-hill', s.toHill, 'hill')] },
            { sceneId: 'river', text: s.river, choices: [choice('cross-bridge', s.crossBridge, 'village'), choice('follow-bank', s.followBank, 'cave')] },
            // a colina e o rio levam aos mesmos lugares: os caminhos se reencontram
            { sceneId: 'hill', text: s.hill, choices: [choice('go-village', s.goVillage, 'village'), choice('enter-cave', s.enterCave, 'cave')] },
            { sceneId: 'village', text: s.village, choices: [choice('ask-who', s.askWho, 'heir'), choice('ask-shelter', s.askShelter, 'party')] },
            { sceneId: 'cave', text: s.cave, choices: [choice('open-chest', s.openChest, 'treasure'), choice('go-back', s.goBack, 'start')] },
            { sceneId: 'heir', text: s.heir, choices: [], ending: { title: s.heirTitle } },
            { sceneId: 'party', text: s.party, choices: [], ending: { title: s.partyTitle } },
            { sceneId: 'treasure', text: s.treasure, choices: [], ending: { title: s.treasureTitle } },
        ],
    }
}

// ── compatibilidade ──

const compatibilityQuestions: TLocalized<Array<[string, string[]]>> = {
    pt: [
        ['Programa ideal de sábado?', ['Sair com os amigos', 'Ficar em casa vendo série', 'Viajar para algum lugar perto']],
        ['Praia ou montanha?', ['Praia', 'Montanha']],
        ['Café da manhã perfeito?', ['Pão de queijo com café', 'Frutas e iogurte', 'Pular o café da manhã']],
        ['Você é mais de...', ['Dormir cedo', 'Virar a noite']],
        ['Numa viagem, você prefere...', ['Roteiro planejado', 'Decidir na hora']],
        ['Filme para hoje à noite?', ['Comédia', 'Terror', 'Romance', 'Ação']],
    ],
    en: [
        ['Perfect Saturday?', ['Going out with friends', 'Staying in with a series', 'A quick trip somewhere nearby']],
        ['Beach or mountains?', ['Beach', 'Mountains']],
        ['Ideal breakfast?', ['Pancakes and coffee', 'Fruit and yogurt', 'Skipping breakfast']],
        ['Are you more of a...', ['Early bird', 'Night owl']],
        ['On a trip, you prefer...', ['A planned itinerary', 'Making it up as you go']],
        ["Tonight's movie?", ['Comedy', 'Horror', 'Romance', 'Action']],
    ],
    es: [
        ['¿Sábado ideal?', ['Salir con amigos', 'Quedarse en casa viendo una serie', 'Una escapada a algún lugar cercano']],
        ['¿Playa o montaña?', ['Playa', 'Montaña']],
        ['¿Desayuno perfecto?', ['Tostadas con café', 'Fruta y yogur', 'Saltarse el desayuno']],
        ['Eres más de...', ['Acostarse temprano', 'Trasnochar']],
        ['De viaje, prefieres...', ['Un itinerario planeado', 'Decidir sobre la marcha']],
        ['¿Película para esta noche?', ['Comedia', 'Terror', 'Romance', 'Acción']],
    ],
    zh: [
        ['理想的周六怎么过？', ['和朋友出去玩', '在家追剧', '去附近短途旅行']],
        ['海边还是山里？', ['海边', '山里']],
        ['完美的早餐是？', ['豆浆油条', '水果和酸奶', '不吃早餐']],
        ['你更像是……', ['早睡早起', '熬夜党']],
        ['旅行时你更喜欢……', ['提前做好攻略', '走到哪算哪']],
        ['今晚看什么电影？', ['喜剧', '恐怖', '爱情', '动作']],
    ],
}

const compatibilityInfo: TLocalized<Pick<IExperienceTemplate, 'title' | 'description' | 'tags'> & { partner: string }> = {
    pt: { title: 'Quanto a gente combina?', description: 'Responda sobre os seus gostos e mande o link para alguém: vocês veem em quantas perguntas escolheram a mesma coisa.', tags: ['compatibilidade', 'amizade', 'casal'], partner: 'Alex' },
    en: { title: 'How well do we match?', description: 'Answer about your own tastes and send the link to someone: you both see how many answers you have in common.', tags: ['compatibility', 'friendship', 'couples'], partner: 'Alex' },
    es: { title: '¿Cuánto nos parecemos?', description: 'Responde sobre tus gustos y envía el enlace a alguien: verán en cuántas preguntas eligieron lo mismo.', tags: ['compatibilidad', 'amistad', 'pareja'], partner: 'Alex' },
    zh: { title: '我们有多合拍？', description: '回答关于你自己喜好的问题，再把链接发给别人：你们会看到有多少答案相同。', tags: ['默契测试', '友情', '情侣'], partner: '小林' },
}

const compatibilityContent = (locale: AppLocale): ICompatibilityContent => ({
    questions: compatibilityQuestions[locale].map(([question, answers], index) => ({
        questionId: `match-${index + 1}`,
        question,
        answers: answers.map((text, answer) => ({ answerId: `match-${index + 1}-${answer + 1}`, text })),
    })),
})

// respostas da pessoa do exemplo (a primeira alternativa, menos em duas perguntas)
const demoPartnerAnswers: Record<string, string> = {
    'match-1': 'match-1-1', 'match-2': 'match-2-1', 'match-3': 'match-3-1',
    'match-4': 'match-4-2', 'match-5': 'match-5-2', 'match-6': 'match-6-1',
}

// ── pontuação ──

const scoredQuestions: TLocalized<Array<[string, string[]]>> = {
    pt: [
        ['Um amigo chama para uma trilha amanhã cedo. Você...', ['Recusa: o sofá te espera', 'Vai, se não for muito longe', 'Topa na hora', 'Sugere acampar lá em cima']],
        ['No cardápio, um prato que você nunca viu...', ['Pede o de sempre', 'Pergunta ao garçom antes', 'Pede sem pensar duas vezes', 'Pede o mais apimentado da casa']],
        ['Férias ideais?', ['Resort com tudo incluído', 'Cidade grande com museus', 'Mochilão sem roteiro', 'Ilha remota sem sinal de celular']],
        ['Um esporte que você nunca praticou...', ['Prefere assistir', 'Experimenta uma vez', 'Faz uma aula e já se inscreve', 'Paraquedismo? Por que não?']],
        ['O celular descarrega no meio da viagem. Você...', ['Entra em pânico', 'Procura uma tomada', 'Pergunta o caminho para alguém', 'Aproveita para se perder um pouco']],
    ],
    en: [
        ['A friend invites you on a hike tomorrow morning. You...', ['Pass: the couch is calling', "Go, if it's not too far", 'Say yes right away', 'Suggest camping at the top']],
        ["There's a dish on the menu you've never seen...", ['Order your usual', 'Ask the server first', 'Order it without a second thought', 'Order the spiciest thing they have']],
        ['Dream vacation?', ['All-inclusive resort', 'A big city full of museums', 'Backpacking with no plan', 'A remote island with no cell signal']],
        ["A sport you've never tried...", ["You'd rather watch", 'Try it once', 'Take a class and sign up', 'Skydiving? Why not?']],
        ['Your phone dies in the middle of a trip. You...', ['Panic', 'Look for an outlet', 'Ask someone for directions', 'Enjoy getting a little lost']],
    ],
    es: [
        ['Un amigo te invita a hacer senderismo mañana temprano. Tú...', ['Dices que no: el sofá te espera', 'Vas, si no es muy lejos', 'Aceptas al instante', 'Propones acampar en la cima']],
        ['En la carta hay un plato que nunca has visto...', ['Pides lo de siempre', 'Preguntas al camarero primero', 'Lo pides sin pensarlo', 'Pides lo más picante de la casa']],
        ['¿Vacaciones ideales?', ['Resort todo incluido', 'Una gran ciudad con museos', 'Mochilero sin itinerario', 'Una isla remota sin cobertura']],
        ['Un deporte que nunca has practicado...', ['Prefieres verlo', 'Lo pruebas una vez', 'Tomas una clase y te apuntas', '¿Paracaidismo? ¿Por qué no?']],
        ['Se te acaba la batería del móvil en pleno viaje. Tú...', ['Entras en pánico', 'Buscas un enchufe', 'Le preguntas el camino a alguien', 'Aprovechas para perderte un poco']],
    ],
    zh: [
        ['朋友约你明天一早去徒步，你会……', ['拒绝：沙发在召唤我', '不太远的话就去', '马上答应', '提议直接在山顶露营']],
        ['菜单上有一道你从没见过的菜……', ['还是点老样子', '先问问服务员', '毫不犹豫就点', '点店里最辣的那道']],
        ['理想的假期是？', ['全包式度假村', '有很多博物馆的大城市', '说走就走的背包旅行', '没有手机信号的偏远小岛']],
        ['一项你从没尝试过的运动……', ['还是看看就好', '试一次', '上一节课就报名', '跳伞？为什么不呢？']],
        ['旅行途中手机没电了，你会……', ['慌了', '找地方充电', '找人问路', '趁机随便逛逛']],
    ],
}

const scoredRanges: TLocalized<Array<[string, string]>> = {
    pt: [
        ['Aventureiro de sofá', 'Você gosta de conforto e de saber o que vem pela frente. Aventura, só se for num bom filme.'],
        ['Explorador de fim de semana', 'Você topa novidades quando tem um plano por perto. O equilíbrio é o seu forte.'],
        ['Aventureiro nato', 'Novidade é com você mesmo. Quanto menos roteiro, melhor fica a história.'],
    ],
    en: [
        ['Couch adventurer', 'You like comfort and knowing what comes next. Adventure is best enjoyed in a good movie.'],
        ['Weekend explorer', "You're up for something new as long as there's a plan nearby. Balance is your strength."],
        ['Born adventurer', 'New things are your thing. The less of a plan, the better the story.'],
    ],
    es: [
        ['Aventurero de sofá', 'Te gusta la comodidad y saber qué viene después. La aventura, mejor en una buena película.'],
        ['Explorador de fin de semana', 'Te animas a lo nuevo si hay un plan cerca. El equilibrio es lo tuyo.'],
        ['Aventurero nato', 'Lo nuevo es lo tuyo. Cuanto menos plan, mejor la historia.'],
    ],
    zh: [
        ['沙发冒险家', '你喜欢舒适，也喜欢知道接下来会发生什么。冒险嘛，看电影就够了。'],
        ['周末探险家', '只要心里有个计划，你很乐意尝试新事物。平衡是你的长处。'],
        ['天生冒险家', '新鲜事就是你的最爱。计划越少，故事越精彩。'],
    ],
}

const scoredInfo: TLocalized<Pick<IExperienceTemplate, 'title' | 'description' | 'tags'>> = {
    pt: { title: 'Quão aventureiro você é?', description: 'Cinco situações, e cada resposta vale pontos. No fim, a soma mostra o seu perfil de aventura.', tags: ['aventura', 'viagem', 'teste'] },
    en: { title: 'How adventurous are you?', description: 'Five situations, and every answer is worth points. At the end, your total shows your adventure profile.', tags: ['adventure', 'travel', 'quiz'] },
    es: { title: '¿Qué tan aventurero eres?', description: 'Cinco situaciones, y cada respuesta vale puntos. Al final, la suma muestra tu perfil aventurero.', tags: ['aventura', 'viajes', 'test'] },
    zh: { title: '你有多爱冒险？', description: '五个情境，每个回答都有分数。最后的总分会显示你的冒险类型。', tags: ['冒险', '旅行', '测试'] },
}

const scoredContent = (locale: AppLocale): IScoredContent => ({
    questions: scoredQuestions[locale].map(([question, answers], index) => ({
        questionId: `adv-${index + 1}`,
        question,
        // a primeira alternativa vale 0 e a última, 3
        answers: answers.map((text, points) => ({ answerId: `adv-${index + 1}-${points + 1}`, text, points })),
    })),
    // 5 perguntas de 0 a 3 pontos: totais de 0 a 15, sem buraco
    ranges: scoredRanges[locale].map(([title, description], index) => ({
        rangeId: `adv-range-${index + 1}`,
        min: [0, 6, 11][index],
        max: [5, 10, 15][index],
        title,
        description,
    })),
})

export function experienceTemplate(kind: ExperienceKind, locale: string): IExperienceTemplate {
    const lang = getAppLocale(locale)

    switch (kind) {
        case 'tournament':
            return { kind, ...tournamentInfo[lang], category: 'Gastronomy', content: tournamentContent(lang) }
        case 'story':
            return { kind, ...storyInfo[lang], category: 'Literature', content: storyContent(lang) }
        case 'compatibility': {
            const { partner, ...info } = compatibilityInfo[lang]
            return { kind, ...info, category: 'Life/Relationships', content: compatibilityContent(lang), demoPartner: { name: partner, answers: demoPartnerAnswers } }
        }
        case 'scored':
            return { kind, ...scoredInfo[lang], category: 'Hobbies', content: scoredContent(lang) }
    }
}
