import React from 'react'
import styles from './cover.module.scss'
import NavCreatinQuiz from '@/components/CreatingQuiz/nav-creating-quiz'
import FormCreateQuiz from '@/components/CreatingQuiz/form-create-quiz'

export default function CreatingQuiz() {
    return (
        <main className={styles.content}>
            <div className={styles.subtitle_creations}>
                <NavCreatinQuiz
                    isBlock={true}
                />
                <p>
                    After completing this step, your content will automatically be saved in 
                    <span>Drafts</span>.
                </p>
            </div>

            {/* {!isAuth && canShowRegister && <RegisterForm pageReg={false} absolute={true} canNavigate={false} handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz} show_pop_up={setCanShowRegister}/>} */}

            <FormCreateQuiz 
                styles={styles}
            />
        </main>
    )
}
