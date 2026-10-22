import { useFilters } from '@/contexts/filtersContext'
import { TTypeQuiz } from '@/types/quizzesType'
import { TStyles } from '@/types/stylesType'
import { useLocale } from 'next-intl'
import React from 'react'

interface IProps {
    styles: TStyles
    typeQ: TTypeQuiz
    setTypeQ: React.Dispatch<React.SetStateAction<TTypeQuiz>>
}

export default function TypesList({ setTypeQ, styles, typeQ }: IProps) {
    const locale = useLocale()
    const { typesQuiz, getTypeQuizLabel } = useFilters()

    const verifyTypeSelect = (type: TTypeQuiz) => {
        return type === typeQ
    }

    const renderType = (type: TTypeQuiz) => {
        const active = verifyTypeSelect(type)

        return (
            <li
                key={type}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                className={active ? styles.active_li : ''}
                onClick={() => setTypeQ(type)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setTypeQ(type)
                    }
                }}
            >
                {getTypeQuizLabel(type, locale)}
            </li>
        )
    }

    return (
        <ul>
            {typesQuiz.map(renderType)}
        </ul>
    )
}