'use client'
import React, { useState } from 'react'
import styles from './filters-container.module.scss'
import { TFilter } from '@/types/filtersType'
import CategoriesList from './categories-list'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { exploreHref, parseExploreFilters } from '@/utils/exploreFilters'

interface IProps {
    setFilterClicked: () => void
}

// Categorias do Explorar. O tipo e o idioma ficam nos filtros rápidos acima da lista; tudo
// vai para o endereço, e aplicar mantém os outros filtros e a busca.
export default function FiltersContainer({ setFilterClicked }: IProps) {
    const t = useTranslations('filters')
    const searchParams = useSearchParams()
    const router = useRouter()

    const current = parseExploreFilters(searchParams)
    const [filters, setFilters] = useState<TFilter[]>(
        (current.categories?.split(',').map(category => category.trim()).filter(Boolean) ?? []) as TFilter[]
    )

    const handleApply = () => {
        router.push(exploreHref({ ...current, categories: filters.join(','), page: 1 }), { scroll: false })
        setFilterClicked()
    }

    return (
        <div className={`${styles.filters_popup}`}>
            <div className={styles.filters_container}>
                <div className={styles.categories}>
                    <p>{t('categoryTitle')}</p>
                    <CategoriesList
                        styles={styles}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </div>
            </div>

            <button className={styles.apply_filters} onClick={handleApply}>
                {t('applyButton')}
            </button>
        </div>
    )
}
