import React from 'react'
import CloseSvg from '../Icons/CloseSvg'

import styles from './popup-warning-gamepass.module.scss'
import VortexPlus from '../NavbarQuizgroup/signatures/VortexPlus'
import VortexPlusUniqueUse from '../NavbarQuizgroup/signatures/VortexPlusUniqueUse'

interface IProps{
    closePopup: ()=>void
}

export default function PopupWarningGamepass({closePopup}:IProps) {
    return (
        <div className={styles.container}>
            <span className={styles.close} onClick={closePopup}>
                <CloseSvg/>
            </span>

            <div className={styles.desc}>
                <p>The 'Text and Image' option is available for our premium users. To enable it, subscribe to <span>vortexplus</span> for unlimited access or purchase a single-use pass for this quiz.</p>
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
