import { useFilters } from '@/contexts/filtersContext'
import { TTypeQuiz } from '@/types/quizzesType'
import { TStyles } from '@/types/stylesType'
import { useLocale } from 'next-intl'
import React from 'react'

interface IProps {
    styles: TStyles,
    typeQ: TTypeQuiz,
    setTypeQ: React.Dispatch<React.SetStateAction<TTypeQuiz>>
}

export default function TypesList({setTypeQ, styles, typeQ}:IProps) {
    const locale = useLocale(),
        {typesQuiz, typesQuizPt} = useFilters()


    const verifyTypeSelect = (type:TTypeQuiz) =>{
        return type === typeQ
    },
    isTypeInactive = (type:TTypeQuiz)=>{
        return type === 'Personality' || type === 'Right and Wrong'
    }
    return (
        <>
            {locale == 'pt' && <ul>
                {typesQuizPt.map((typePt, index)=>(
                    <li 
                        key={index} 
                        className={`
                            ${isTypeInactive(typesQuiz[index]) ? styles.types_soon: ''}    
                            ${verifyTypeSelect(typesQuiz[index]) ? styles.active_li: ''}    
                        `} 
                        onClick={()=>setTypeQ(typesQuiz[index])}
                    >{typePt}</li>
                ))}
            </ul>}
            {locale == 'en' && <ul>
                {typesQuiz.map((type, index)=>(
                    <li 
                        key={index} 
                        className={`
                            ${isTypeInactive(type) ? styles.types_soon: ''}    
                            ${verifyTypeSelect(type) ? styles.active_li: ''}    
                        `} 
                        onClick={()=>setTypeQ(type)}
                    >{type}</li>
                ))}
            </ul>}
        </>
    )
}
