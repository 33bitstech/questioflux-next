'use client'
import SearchSvg from '@/components/Icons/Search'
import { useFilters } from '@/contexts/filtersContext'
import { TStyles } from '@/types/stylesType'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { FormEvent, useEffect, useState } from 'react'

interface IProps{
    styles: TStyles,
}

export default function SearchQuiz({styles}: IProps) {
    const searchParams = useSearchParams() 
    
    const getInitialSearchValue = () => {
        const title = searchParams.get('title') || ''
        const tags = searchParams.get('tags') || ''
        
        const formattedTags = tags ? tags.split(',').map(tag => `#${tag}`).join(' ') : ''
        
        return [title, formattedTags].filter(Boolean).join(' ').trim()
    }


    const [searchValue, setSearchValue] = useState<string>(getInitialSearchValue()),
        { filtersSelected } = useFilters(),
        router = useRouter()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!searchValue.trim() && filtersSelected.length === 0) return router.push('/explore')

        const params = new URLSearchParams()

        if (filtersSelected.length > 0) params.set('categories', filtersSelected.join(','))

        const regexTags = /(#+[a-zA-Z0-9_]{1,})/g,
            matchedTags = searchValue.match(regexTags)

        if (matchedTags) {
            const tags = matchedTags.map(tag => tag.substring(1)).join(',')
            params.set('tags', tags)

            const title = searchValue.replace(regexTags, '').trim()
            if (title) {
                params.set('title', title)
            }
        } else if (searchValue.trim()) {
            params.set('title', searchValue.trim())
        }
        
        const queryString = params.toString()
        router.push(queryString ? `/explore?${queryString}` : '/explore')
    }

    useEffect(() => {
        setSearchValue(getInitialSearchValue())
    }, [searchParams])

    return (
        <form className={styles.search} onSubmit={handleSubmit}>
            <SearchSvg />
            <input 
                type="search" 
                placeholder='Search' 
                value={searchValue} 
                onChange={e => setSearchValue(e.target.value)} 
            />
        </form>
    )
}
