'use client'
import { verifyUserPremium } from '@/app/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import { TStyles } from '@/types/stylesType'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useEffect, useState } from 'react'

interface IProps{
    styles: TStyles
    textMode: boolean
}

export default function FormCreateQuestions({styles, textMode}:IProps) {
    const router = useRouter(),
        {setError} = useGlobalMessage(),
        {token} = useUser(),

        [loading, setLoading] = useState<boolean>(false),

        [questions, setQuestions] = useState<ILocalQuestions[]>()

    const handleSubmit = (e:FormEvent) =>{
        e.preventDefault()
        setLoading(true)
    }

    //actions in questions array
    const handleQuestionChange = (questionId: string, field:string, value: string | File) => {
        setQuestions(prevQuestions =>
            prevQuestions?.map(q =>
                q.id === questionId ? { ...q, [field]: value } : q
            )
        )
    },
    addQuestion = async() => {
        if ((questions?.length ?? 0) > 9) {
            try {
                const res = await verifyUserPremium(`${token}`)

                if (res.err) return setError(res.err)

                const { premium, specialCount } = res.premium
                if (!premium && !specialCount) return setError('You have reached your limit of questions')

            } catch (err) {
                console.log(err)
                return setError('server error')
            }
        }
        const newQuestion : ILocalQuestions = {
            id: `q-${Date.now()}`,
            title: '',
            type: textMode ? 'text' : 'image',
            alternatives: [
                { id: `a-${Date.now()}_1`, answer: '' },
                { id: `a-${Date.now()}_2`, answer: ''}
            ]
        }
        setQuestions(prev => [...(prev ?? []), newQuestion])
    },
    removeQuestion = (questionId:string) => {
        if ((questions?.length ?? 0) > 1) {
            setQuestions(prev => (prev ?? []).filter(q => q.id !== questionId))
        }
    },
    handleAlternativeChange = (questionId: string, altIndex:number, field: string, value: string | File) => {
        setQuestions(prevQuestions =>
            prevQuestions?.map(q => {
                if (q.id === questionId) {
                    const updatedAlternatives = [...q.alternatives]
                    updatedAlternatives[altIndex] = { ...updatedAlternatives[altIndex], [field]: value }
                    return { ...q, alternatives: updatedAlternatives }
                }
                return q
            })
        )
    },
    addAlternative = async (questionId: string) => {
        const q = questions?.find(q=>q.id === questionId)
        if (!q) return

        const currentAltsCount = q.alternatives.length,
            FREE_LIMIT = 6,
            PREMIUM_LIMIT = 15

        if (currentAltsCount >= PREMIUM_LIMIT) return setError('You have reached your limit of alternatives')

        if (currentAltsCount >= FREE_LIMIT){
            try {
                const res = await verifyUserPremium(`${token}`)

                if (res.err) return setError(res.err)

                const { premium, specialCount } = res.premium
                if (!premium && !specialCount) return setError('You have reached your limit of alternatives')

            } catch (err) {
                console.log(err)
                return setError('server error')
            }
        }
        setQuestions(prevQuestions => 
            prevQuestions?.map(q => 
                q.id === questionId
                    ? { ...q, alternatives: [...q.alternatives, {answer: '', id:`a-${Date.now()}`}] } 
                    : q 
            )
        )
    },
    removeAlternative = (questionId:string, altIndex: number) => {
        setQuestions(prevQuestions =>
            prevQuestions?.map(q => {
                if (q.id === questionId && q.alternatives.length > 2) {
                    const filteredAlternatives = q.alternatives.filter((_, index) => index !== altIndex)
                    return { ...q, alternatives: filteredAlternatives }
                }
                return q
            })
        )
    }

    useEffect(()=>{
        setQuestions([{
            id: `q-${Date.now()}`,
            title: '',
            type: textMode ? 'text': 'image',
            alternatives: [
                { id: `a-${Date.now()}_1`, answer: '' },
                { id: `a-${Date.now()}_2`, answer: ''}
            ]
        }])
    },[textMode])

    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.questions_container}>
                
            </div>

            <footer className={styles.footer}>
                <div className={styles.actions}>
                    <button onClick={()=>router.back()}>Back</button>
                </div>
                <div className={styles.save}>
                    <input type='submit' value='Save as draft' disabled={loading} />
                    <input type="submit" value="Create" disabled={loading} />
                </div>
            </footer>
        </form>
    )
}
