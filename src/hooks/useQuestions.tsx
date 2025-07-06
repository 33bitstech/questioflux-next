'use client'
import { verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions';
import { useGlobalMessage } from '@/contexts/globalMessageContext';
import { ILocalQuestions } from '@/interfaces/ILocalQuestions';
import { useEffect, useState } from 'react';

const useQuestions = (textMode: boolean, token: string) => {
    const createInitialQuestion = (isTextMode: boolean): ILocalQuestions[] => {
        return [{
            id: `q-${Date.now()}`,
            title: '',
            isNew: true,
            type: isTextMode ? 'text' : 'image',
            alternatives: [
                { id: `a-${Date.now()}1`, answer: '', isNew: true},
                { id: `a-${Date.now()}2`, answer: '', isNew: true}
            ]
        }]
    }

    const [questions, setQuestions] = useState<ILocalQuestions[]>(()=> createInitialQuestion(textMode)),
        {setError} = useGlobalMessage()

    const handleQuestionChange = (questionId: string, field:string, value: string | File) => {
            if(field === 'errorMessage'){
                setQuestions(prevQuestions =>
                    prevQuestions?.map(q =>
                        q.id === questionId ? { ...q, [field]: typeof value === 'string' ? value : '' } : q
                    )
                )
            }else{
                setQuestions(prevQuestions =>
                    prevQuestions?.map(q =>
                        q.id === questionId ? { ...q, [field]: value, isNew:true} : q
                    )
                )
            }
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
            isNew: true,
            alternatives: [
                { id: `a-${Date.now()}_1`, answer: '', isNew: true},
                { id: `a-${Date.now()}_2`, answer: '', isNew: true}
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
                    updatedAlternatives[altIndex] = { ...updatedAlternatives[altIndex], [field]: value, isNew:true}
                    return { ...q, alternatives: updatedAlternatives}
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
                    ? { ...q, alternatives: [...q.alternatives, {answer: '', id:`a-${Date.now()}`, isNew: true}]} 
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
        setQuestions(createInitialQuestion(textMode))
    },[textMode])


    return{
        questions, handleQuestionChange, addQuestion, removeQuestion,
        handleAlternativeChange, addAlternative, removeAlternative,
        setQuestions
    }
};

export default useQuestions;