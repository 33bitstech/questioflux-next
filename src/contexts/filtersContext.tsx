'use client'

import { createContext, ReactNode, useContext, useState } from "react"
import { TFilter, TFilterPt, TFilterEs } from "@/types/filtersType"
import { TTypeQuiz, TTypeQuizPt, TTypeQuizEs } from "@/types/quizzesType"
import { AppLocale, getAppLocale } from "@/utils/locale"

interface IFiltersContext {
    filters: TFilter[]
    filtersPt: TFilterPt[]
    filtersEs: TFilterEs[]

    filtersSelected: TFilter[]
    selectFilters: (filters: TFilter[]) => void

    typesQuiz: TTypeQuiz[]
    typesQuizPt: TTypeQuizPt[]
    typesQuizEs: TTypeQuizEs[]

    typeQuizSelected: TTypeQuiz
    selectType: (type: TTypeQuiz) => void

    getCategoryLabel: (category: TFilter, locale: string) => string
    getTypeQuizLabel: (type: TTypeQuiz, locale: string) => string
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

    const [filtersSelected, setFiltersSelected] = useState<TFilter[]>([])

    const typesQuiz: TTypeQuiz[] = [
        'All', "Personality", "Image", "Right and Wrong"
    ]

    const typesQuizPt: TTypeQuizPt[] = [
        'Todos', "Personalidade", "Imagem", "Certo e Errado"
    ]

    const typesQuizEs: TTypeQuizEs[] = [
        'Todos', "Personalidad", "Imagen", "Correcto e Incorrecto"
    ]

    const [typeQuizSelected, setTypeQuizSelected] = useState<TTypeQuiz>('All')

    const filtersByLocale: Record<AppLocale, readonly string[]> = {
        en: filters,
        pt: filtersPt,
        es: filtersEs,
    }

    const typesQuizByLocale: Record<AppLocale, readonly string[]> = {
        en: typesQuiz,
        pt: typesQuizPt,
        es: typesQuizEs,
    }

    const getCategoryLabel = (category: TFilter, locale: string) => {
        const index = filters.indexOf(category)
        const appLocale = getAppLocale(locale)

        return filtersByLocale[appLocale][index] || category
    }

    const getTypeQuizLabel = (type: TTypeQuiz, locale: string) => {
        const index = typesQuiz.indexOf(type)
        const appLocale = getAppLocale(locale)

        return typesQuizByLocale[appLocale][index] || type
    }

    const selectFilters = (filters: TFilter[]) => {
        setFiltersSelected(filters)
    }

    const selectType = (type: TTypeQuiz) => {
        setTypeQuizSelected(type)
    }

    return (
        <FiltersContext.Provider value={{
            filters,
            filtersPt,
            filtersEs,
            filtersSelected,
            selectFilters,

            typesQuiz,
            typesQuizPt,
            typesQuizEs,
            typeQuizSelected,
            selectType,

            getCategoryLabel,
            getTypeQuizLabel,
        }}>
            {children}
        </FiltersContext.Provider>
    )
}

export const useFilters = () => useContext(FiltersContext)