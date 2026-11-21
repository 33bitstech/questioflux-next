'use client'

import { createContext, ReactNode, useContext } from "react"
import { TFilter, TFilterPt, TFilterEs } from "@/types/filtersType"
import { AppLocale, getAppLocale } from "@/utils/locale"

// Categorias de quiz e seus nomes em cada idioma. O que está selecionado no Explorar fica no
// endereço (?categories=...&type=...&lang=...), não aqui.
interface IFiltersContext {
    filters: TFilter[]
    filtersPt: TFilterPt[]
    filtersEs: TFilterEs[]

    getCategoryLabel: (category: TFilter, locale: string) => string
}

const FiltersContext = createContext({} as IFiltersContext)

export function FilterProvider({ children }: { children: ReactNode }) {
    const filters: TFilter[] = [
        "Others", "General knowledge", "Sports", "Anime", "Movie", "Series", "Music", "Game", "Funny", "Fashion/Style", "Curiosity", "Life/Relationships", "Decoration", "Health", "Beauty", "Literature", "Pop Culture", "Art", "Trips", "Nature", "Career", "Gastronomy", "Animals", "Hobbies", "Mythology", "Psychology", "Languages", "Education", "Book", "Nerd Culture", "Business and Economy"
    ]

    const filtersPt: TFilterPt[] = [
        "Outros", "Conhecimentos gerais", "Esportes", "Anime", "Filme", "Séries", "Música", "Jogo", "Humor", "Moda/Estilo", "Curiosidade", "Vida/Relacionamentos", "Decoração", "Saúde", "Beleza", "Literatura", "Cultura Pop", "Arte", "Viagens", "Natureza", "Carreira", "Gastronomia", "Animais", "Hobbies", "Mitologia", "Psicologia", "Idiomas", "Educação", "Livro", "Cultura Nerd", "Negócios e Economia"
    ]

    const filtersEs: TFilterEs[] = [
        "Otros", "Conocimientos generales", "Deportes", "Anime", "Película", "Series", "Música", "Juego", "Humor", "Moda/Estilo", "Curiosidad", "Vida/Relaciones", "Decoración", "Salud", "Belleza", "Literatura", "Cultura Pop", "Arte", "Viajes", "Naturaleza", "Carrera", "Gastronomía", "Animales", "Hobbies", "Mitología", "Psicología", "Idiomas", "Educación", "Libro", "Cultura Nerd", "Negocios y Economía"
    ]

    const filtersZh: string[] = [
        "其他", "常识", "体育", "动漫", "电影", "剧集", "音乐", "游戏", "搞笑", "时尚/风格", "趣闻", "生活/情感", "家居装饰", "健康", "美妆", "文学", "流行文化", "艺术", "旅行", "自然", "职业", "美食", "动物", "爱好", "神话", "心理学", "语言", "教育", "书籍", "极客文化", "商业与经济"
    ]

    const filtersByLocale: Record<AppLocale, readonly string[]> = {
        en: filters,
        pt: filtersPt,
        es: filtersEs,
        zh: filtersZh,
    }

    const getCategoryLabel = (category: TFilter, locale: string) => {
        const index = filters.indexOf(category)
        const appLocale = getAppLocale(locale)

        return filtersByLocale[appLocale][index] || category
    }

    return (
        <FiltersContext.Provider value={{
            filters,
            filtersPt,
            filtersEs,
            getCategoryLabel,
        }}>
            {children}
        </FiltersContext.Provider>
    )
}

export const useFilters = () => useContext(FiltersContext)