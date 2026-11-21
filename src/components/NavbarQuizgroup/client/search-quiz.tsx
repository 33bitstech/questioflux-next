'use client'
import SearchSvg from '@/components/Icons/Search'
import { TStyles } from '@/types/stylesType'
import {useSearchParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/navigation'
import React, { FormEvent, useEffect, useState } from 'react'
import { trackEvent } from '@/utils/analytics'
import { exploreHref, parseExploreFilters } from '@/utils/exploreFilters'

interface IProps{
    styles: TStyles,
    placeholder:string,
    pagesWithSearchInput: string[]
}

export default function SearchQuiz({styles, placeholder, pagesWithSearchInput}: IProps) {
    const searchParams = useSearchParams() 
    const pathname = usePathname()
    const isSearchVisible = pagesWithSearchInput?.includes(pathname)

    const getInitialSearchValue = () => {
        const title = searchParams.get('title') || ''
        const tags = searchParams.get('tags') || ''
        
        const formattedTags = tags ? tags.split(',').map(tag => `#${tag}`).join(' ') : ''
        
        return [title, formattedTags].filter(Boolean).join(' ').trim()
    }


    const [searchValue, setSearchValue] = useState<string>(getInitialSearchValue()),
        router = useRouter()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // no Explorar a busca mantém os filtros escolhidos (categorias, tipo e idioma)
        const current = pathname === '/explore' ? parseExploreFilters(searchParams) : undefined

        trackEvent('search', {
            search_term: searchValue.trim().slice(0, 100),
            categories: current?.categories?.slice(0, 100) || undefined,
        })

        const regexTags = /(#+[a-zA-Z0-9_]{1,})/g,
            matchedTags = searchValue.match(regexTags),
            tags = matchedTags ? matchedTags.map(tag => tag.substring(1)).join(',') : undefined,
            title = (matchedTags ? searchValue.replace(regexTags, '') : searchValue).trim() || undefined

        router.push(exploreHref({
            categories: current?.categories,
            type: current?.type,
            lang: current?.lang,
            title,
            tags,
            page: 1,
        }))
    }

    useEffect(() => {
        setSearchValue(getInitialSearchValue())
    }, [searchParams])

    if(isSearchVisible){
        return (
            <form className={styles.search} onSubmit={handleSubmit}>
                <SearchSvg />
                <input 
                    type="search" 
                    placeholder={placeholder}
                    value={searchValue} 
                    onChange={e => setSearchValue(e.target.value)} 
                />
            </form>
        )
    }else{
        return null
    }
}
