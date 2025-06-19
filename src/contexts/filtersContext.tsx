'use client'

import { createContext, ReactNode, useContext, useState } from "react"
import { TFilter } from "@/types/filtersType"

interface IFiltersContext {
    filters: TFilter[]
    filtersSelected: TFilter[],
    selectFilters: (filters: TFilter[]) => void
}

const FiltersContext = createContext({} as IFiltersContext)

export function FilterProvider({children} : {children : ReactNode}){
    const filters: TFilter[] = [
        "Others","General knowledge","Sports","Anime","Movie", "Series" ,"Music","Game","Funny","Fashion/Style","Curiosity","Life/Relationships","Decoration","Health","Beauty","Literature","Pop Culture","Art","Trips","Nature","Career","Gastronomy","Animals","Hobbies","Mythology","Psychology","Languages","Education","Book","Nerd Culture","Business and Economy"
    ],
    [filtersSelected, setFiltersSelected] = useState<TFilter[]>([]),

    selectFilters = (filters: TFilter[]) => {
        setFiltersSelected(filters)
    }

    return (
        <FiltersContext.Provider value={{
            filters, filtersSelected, selectFilters
        }}>
            {children}
        </FiltersContext.Provider>
    )
}

export const useFilters = () => useContext(FiltersContext)