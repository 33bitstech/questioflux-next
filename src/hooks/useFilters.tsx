'use client'
import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { useAppDispatch, useAppSelector} from '@/lib/hooks';

import { setFilters } from "../lib/slices/filtersSlice"
import { RootState } from "@/lib/store";

interface IFilter {
    filters: string[]
}
interface IUseFiltersReturn {
  filtersSelected: IFilter | undefined;
  setFiltersSelected: Dispatch<SetStateAction<IFilter | undefined>>;
}

export const useFilters = (): IUseFiltersReturn => {
    const [filtersSelected, setFiltersSelected] = useState<IFilter | undefined>(),
        { filters } = useAppSelector((state: RootState) => state.filters),
        dispatch = useAppDispatch()

    useEffect(() => {
        if (filtersSelected) {
            if (JSON.stringify(filtersSelected) !== JSON.stringify(filters)) {
                dispatch(setFilters(filtersSelected));
            }
        } else {
            setFiltersSelected(filters);
        }
    }, [filtersSelected, dispatch, filters]);

    return { filtersSelected, setFiltersSelected };
}