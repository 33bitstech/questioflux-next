'use client'

import { createContext, ReactNode, useContext, useState } from "react"
import { TFilter, TFilterPt } from "@/types/filtersType"

interface IFiltersContext {
    filters: TFilter[]
    filtersPt: TFilterPt[],
    filtersSelected: TFilter[],
    selectFilters: (filters: TFilter[]) => void
}

const FiltersContext = createContext({} as IFiltersContext)

export function FilterProvider({children} : {children : ReactNode}){
    const filters: TFilter[] = [
        "Others","General knowledge","Sports","Anime","Movie", "Series" ,"Music","Game","Funny","Fashion/Style","Curiosity","Life/Relationships","Decoration","Health","Beauty","Literature","Pop Culture","Art","Trips","Nature","Career","Gastronomy","Animals","Hobbies","Mythology","Psychology","Languages","Education","Book","Nerd Culture","Business and Economy"
    ],
    filtersPt: TFilterPt[] = [
        "Outros", "Conhecimentos gerais", "Esportes", "Anime", "Filme", "Séries", "Música", "Jogo", "Humor", "Moda/Estilo", "Curiosidade", "Vida/Relacionamentos", "Decoração", "Saúde", "Beleza", "Literatura", "Cultura Pop", "Arte", "Viagens", "Natureza", "Carreira", "Gastronomia", "Animais", "Hobbies", "Mitologia", "Psicologia", "Idiomas", "Educação", "Livro", "Cultura Nerd", "Negócios e Economia"
    ],
    [filtersSelected, setFiltersSelected] = useState<TFilter[]>([]),

    selectFilters = (filters: TFilter[]) => {
        setFiltersSelected(filters)
    }

    return (
        <FiltersContext.Provider value={{
            filters, filtersSelected, selectFilters, filtersPt
        }}>
            {children}
        </FiltersContext.Provider>
    )
}

export const useFilters = () => useContext(FiltersContext)