import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action';
import { env } from '@/env';
import IQuizes from '@/interfaces/IQuizes';
import QuizPageImgContainer from '@/components/ImagesRender/quiz-page-img-render';
import NavLink from '@/components/widgets/NavLink';
import { getTranslations } from 'next-intl/server'; // Importar

interface IProps {
    children: ReactNode,
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

async function getQuiz(quizId:string) : Promise<IQuizes|undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`, {
            method: 'GET',
            cache: 'no-store' // Recomendo para garantir que os dados do quiz estejam sempre atualizados
        });
        const res = await response.json();
        return res.quiz;
    } catch (err: any) {
        console.log(err)
    }
}

// 1. Adicionando generateMetadata para o título dinâmico
export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {quizId} = await params
    const quiz = await getQuiz(quizId);
    
    // O título será dinâmico, com base no título do quiz, ótimo para SEO
    return {
        title: quiz?.title || 'Quiz',
        description: quiz?.description
    }
}


export default async function LayoutQuizGroup({children, params}: IProps) {
    const {quizId, locale} = await params;
    // 2. Buscar as traduções para os textos estáticos do layout
    const t = await getTranslations({ locale, namespace: 'quizLayout.nav' });
    const quiz = await getQuiz(quizId);

    return (
        <main className={styles.content}>
            <ContextualHeaderActions page='quiz' locale={locale}/>

            <div className={styles.image_quiz_container}>
                {quiz && <QuizPageImgContainer quiz={quiz}/>}
            </div>

            <div className={styles.quiz_navigation}>
                {/* O título do quiz vem do banco de dados, não do JSON */}
                <h1>{quiz && quiz.title}</h1>
                <nav className={styles.navbar_quiz}>
                    {/* 3. Usar as traduções para os links de navegação */}
                    <NavLink styles={styles} href={`/quiz/${quizId}`}>{t('info')}</NavLink>
                    <NavLink styles={styles} href={`/quiz/${quizId}/comments`}>{t('comments')}</NavLink>
                    <NavLink styles={styles} href={`/quiz/${quizId}/leaderboard`}>{t('leaderboard')}</NavLink>
                </nav>
            </div>
            {children}
        </main>
    )
}