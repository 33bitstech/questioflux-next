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

    const isTypeInactive = (type: TTypeQuiz) => {
        return type === 'Personality'
    }

    const handleSelectType = (type: TTypeQuiz) => {
        if (isTypeInactive(type)) return

        setTypeQ(type)
    }

    const renderType = (type: TTypeQuiz) => {
        const inactive = isTypeInactive(type)
        const active = !inactive && verifyTypeSelect(type)

        return (
            <li
                key={type}
                aria-disabled={inactive}
                className={`
                    ${inactive ? styles.types_soon : ''}
                    ${active ? styles.active_li : ''}
                `}
                onClick={() => handleSelectType(type)}
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