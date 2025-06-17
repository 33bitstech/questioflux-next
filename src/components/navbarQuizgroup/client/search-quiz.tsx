'use client'
import SearchSvg from '@/components/Icons/Search'
import React, { FormEvent, useState } from 'react'

interface IProps{
    styles: Record<string, string>,
}

export default function SearchQuiz({styles}: IProps) {
    const [search, setSearch] = useState<string>('')

    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{

    }
    return (
        <form className={styles.search} onSubmit={handleSubmit}>
            <SearchSvg />
            <input type="search" placeholder='Search' value={search} onChange={e => setSearch(e.target.value)} />
        </form>
    )
}
