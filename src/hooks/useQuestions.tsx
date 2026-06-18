'use client'
import { verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions';
import { useGlobalMessage } from '@/contexts/globalMessageContext';
import { ILocalQuestions } from '@/interfaces/ILocalQuestions';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const useQuestions = (textMode: boolean) => {
    const t = useTranslations('creation')

    const createInitialQuestion = (isTextMode: boolean): ILocalQuestions[] => {
        return [{
            id: `q-${Date.now()}`,
            title: '',
            isNew: true,
            type: isTextMode ? 'text' : 'image',
            alternatives: [
                { id: `a-${Date.now()}1`, answer: '', text: '', isNew: true },
                { id: `a-${Date.now()}2`, answer: '', text: '', isNew: true }
            ]
        }]
    }

    const [questions, setQuestions] = useState<ILocalQuestions[]>(() => createInitialQuestion(textMode))
    const { setError } = useGlobalMessage()

    const handleQuestionChange = (questionId: string, field: string, value: string | File) => {
        if (field === 'errorMessage') {
            setQuestions(prevQuestions =>
                prevQuestions?.map(q =>
                    q.id === questionId ? { ...q, [field]: typeof value === 'string' ? value : '' } : q
                )
            )
        } else {
            setQuestions(prevQuestions =>
                prevQuestions?.map(q =>
                    q.id === questionId ? { ...q, [field]: value, isNew: true } : q
                )
            )
        }
    }

    const addQuestion = async () => {
        if ((questions?.length ?? 0) > 9) {
            try {
                const res = await verifyUserPremium()
                if (res.err) return setError(res.err)
                const { premium, specialCount } = res.premium
                if (!premium && !specialCount) return setError(t('questionHook.questionLimitError'))
            } catch (err) {
                console.log(err)
                return setError(t('sharedErrors.serverError'))
            }
        }
        const newQuestion: ILocalQuestions = {
            id: `q-${Date.now()}`,
            title: '',
            type: textMode ? 'text' : 'image',
            isNew: true,
            alternatives: [
                { id: `a-${Date.now()}_1`, answer: '', text: '', isNew: true },
                { id: `a-${Date.now()}_2`, answer: '', text: '', isNew: true }
            ]
        }
        setQuestions(prev => [...(prev ?? []), newQuestion])
    }

    const removeQuestion = (questionId: string) => {
        if ((questions?.length ?? 0) > 1) {
            setQuestions(prev => (prev ?? []).filter(q => q.id !== questionId))
        }
    }

    const handleAlternativeChange = (questionId: string, altIndex: number, field: string, value: string | File) => {
        setQuestions(prevQuestions =>
            prevQuestions?.map(q => {
                if (q.id === questionId) {
                    const updatedAlternatives = [...q.alternatives]
                    updatedAlternatives[altIndex] = { ...updatedAlternatives[altIndex], [field]: value, isNew: true }
                    return { ...q, alternatives: updatedAlternatives }
                }
                return q
            })
        )
    }

    const addAlternative = async (questionId: string) => {
        const q = questions?.find(q => q.id === questionId)
        if (!q) return

        const currentAltsCount = q.alternatives.length,
            FREE_LIMIT = 6,
            PREMIUM_LIMIT = 15

        if (currentAltsCount >= PREMIUM_LIMIT) return setError(t('questionHook.alternativeLimitError'))

        if (currentAltsCount >= FREE_LIMIT) {
            try {
                const res = await verifyUserPremium()
                if (res.err) return setError(res.err)
                const { premium, specialCount } = res.premium
                if (!premium && !specialCount) return setError(t('questionHook.alternativeLimitError'))
            } catch (err) {
                console.log(err)
                return setError(t('sharedErrors.serverError'))
            }
        }
        setQuestions(prevQuestions =>
            prevQuestions?.map(q =>
                q.id === questionId
                    ? { ...q, alternatives: [...q.alternatives, { answer: '', text: '', id: `a-${Date.now()}`, isNew: true }] }
                    : q
            )
        )
    }

    const removeAlternative = (questionId: string, altIndex: number) => {
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

    const handleMultipleImageUpload = (questionId: string, files: FileList) => {
        if (!files || files.length === 0) return;
        handleQuestionChange(questionId, 'image', files[0]);
        const alternativeFiles = Array.from(files).slice(1);
        setQuestions(prevQuestions => {
            return prevQuestions.map(q => {
                if (q.id === questionId) {
                    const newAlternatives = [...q.alternatives];
                    alternativeFiles.forEach((file, index) => {
                        if (newAlternatives[index]) {
                            newAlternatives[index] = { ...newAlternatives[index], thumbnail: file, isNew: true };
                        } else {
                            newAlternatives.push({
                                id: `a-${Date.now()}_${index}`,
                                answer: '',
                                text: '',
                                thumbnail: file,
                                isNew: true
                            });
                        }
                    });
                    return { ...q, alternatives: newAlternatives, isNew: true };
                }
                return q;
            });
        });
    }

    const hasImages = () => {
        return questions.every(q => {
            return !!q.image && q.alternatives.every(a => {
                const hasThumbnail = !!a.thumbnail
                const hasText = !!a.text?.trim()

                return hasThumbnail || hasText
            })
        })
    }

    useEffect(() => {
        setQuestions(createInitialQuestion(textMode))
    }, [textMode])

    return {
        questions, handleQuestionChange, addQuestion, removeQuestion,
        handleAlternativeChange, addAlternative, removeAlternative,
        setQuestions, handleMultipleImageUpload, hasImages
    }
};

export default useQuestions;