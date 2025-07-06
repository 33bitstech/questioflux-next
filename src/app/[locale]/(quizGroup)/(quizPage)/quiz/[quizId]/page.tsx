import React from 'react'
import styles from './page.module.scss'
import IQuizes from '@/interfaces/IQuizes';
import { env } from '@/env';
import {Link} from '@/i18n/navigation';
import Participants from '@/components/widgets/participants';
import SaveQuizWidget from '@/components/widgets/save-quiz-widget';
import ShareButton from '@/components/widgets/share-button';
import { getTranslations } from 'next-intl/server'; // 1. Importar
import QuizCategoryContainer from '@/components/widgets/quiz-category-container';

// 2. Atualizar a interface de Props para incluir o locale
interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

// A função getQuiz permanece a mesma
async function getQuiz(quizId:string) : Promise<IQuizes|undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`, {
            method: 'GET',
            next:{revalidate: 60*5}
        });
        const res = await response.json();
        return res.quiz;
    } catch (err: any) {
        console.log(err)
    }
}

export default async function Quiz({params}: IProps) {
    // 3. Receber o locale e buscar as traduções
    const {quizId, locale} = await params;
    const t = await getTranslations({ locale, namespace: 'quizInfoPage' });
    const quiz = await getQuiz(quizId);

    // 4. Função de data melhorada para se adaptar ao locale
    const transformData = (datatime: Date) => {
        return new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(datatime));
    }

    return (
        <>
            <div className={styles.quiz_details}>
                <div className={styles.info}>
                    {/* 5. Usar as traduções */}
                    <h3>{t('title')}</h3>
                    <ul>
                        {quiz && (
                            <>
                                <li>{t('details.createdBy')} <Link href={`/user/${quiz?.userCreatorId}`}>{quiz.userCreatorName}</Link></li>
                                <li>{t('details.creationDate')} <time dateTime={quiz.created_at.toString()}>{transformData(quiz.created_at)}</time></li>
                                <li>{t('details.lastUpdated')} <time dateTime={quiz.updated_at.toString()}>{transformData(quiz.updated_at)}</time></li>
                                <li>{t('details.participants')} <Participants quiz={quiz} styles={styles}/></li>
                                <li>{t('details.category')} 
                                    <QuizCategoryContainer
                                        quiz={quiz}
                                    />
                                </li>
                                {quiz?.tags && quiz.tags.length > 0 ? <li>
                                    {t('details.tags')} { quiz.tags?.map((tag, i)=>(
                                        <span key={i}>
                                            <strong>{tag}</strong>{quiz.tags && i < (quiz.tags.length-1) ? ', ' : ''}
                                        </span>
                                    )) }
                                </li> : <></>}
                            </>
                        )}
                    </ul>
                </div>
                <div className={styles.actions}>
                    <Link locale={locale} href={`/quiz/${quizId}/taking`}>{t('ctaButton')}</Link>
                    <SaveQuizWidget quizId={quizId} />
                    <ShareButton styles={styles} quizId={quizId}/>
                </div>
                <div className={styles.description_container}>
                    <h2>{quiz?.description}</h2>
                </div>
            </div>
            <footer className={styles.footer}></footer>
        </>
    )
}