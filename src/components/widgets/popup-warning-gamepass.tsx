'use client'
import React from 'react'
import CloseSvg from '../Icons/CloseSvg'
import styles from './popup-warning-gamepass.module.scss'
import VortexPlus from '../NavbarQuizgroup/signatures/VortexPlus'
import VortexPlusUniqueUse from '../NavbarQuizgroup/signatures/VortexPlusUniqueUse'
import { useTranslations } from 'next-intl' // Importar

interface IProps{
    closePopup: ()=>void
}

export default function PopupWarningGamepass({closePopup}:IProps) {
    const t = useTranslations('creatingQuiz.questionsPage.premiumWarning'); // Inicializar hook

    return (
        <div className={styles.container}>
            <span className={styles.close} onClick={closePopup}>
                <CloseSvg/>
            </span>

            <div className={styles.desc}>
                {/* Usar t.rich para lidar com o <span> aninhado */}
                <p>
                    {t.rich('popupText', {
                        vortexplus: (chunks) => <span>{chunks}</span>
                    })}
                </p>
            </div>

            <section className={styles.gamepass_container}>
                <article>
                    <VortexPlus/>
                </article>
                <article>
                    <VortexPlusUniqueUse/>
                </article>
            </section>
        </div>
    )
}