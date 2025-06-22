import React from 'react'
import styles from './config.module.scss'
import FormsUpdataUser from '@/components/Config/forms-update-user'

export default function Config() {

    const handleSaveConfig = ()=>{

    }
    return (
        <main className={styles.content}>
            <FormsUpdataUser 
                styles={styles}
            />

            {/* <div className={styles.subscription}>
                <h2>Subscriptions</h2>
                <div className={styles.planos}>
                    <h5>Active ({premium ? 1 : 0})</h5>
                    <section className={styles.gamepass}>
                        <article>
                            <div className={styles.gamepass_details}>
                                <QuizIcon theme={theme}/>
                                <div className={styles.gamepass_details_infos}>
                                    <span>
                                        <h3>VortexPlus</h3>
                                        <span className={styles.desc}>$2,50/month</span>
                                    </span>
                                </div>
                            </div>
                            {!premium && <Link to='/subscription/vortexplus'>Subscribe</Link>}
                            {premium && <button onClick={handleUnsub}>Unsubscribe</button>}
                        </article>
                        <article>
                            <div className={styles.gamepass_details}>
                                <QuizIcon theme={theme}/>
                                <div className={styles.gamepass_details_infos}>
                                    <span>
                                        <h3>VortexPlus Usage ({specialCount || 0})</h3>
                                        <span className={styles.desc}>$1,99/use</span>
                                    </span>
                                </div>
                            </div>
                            <Link to='/subscription/vortexplususage'>Buy</Link>
                        </article>
                    </section>
                </div>
            </div>

            <div className={styles.delete_area}>
                <button className={styles.delete} onClick={()=>setVerifyDeleteAcc(true)}>Delete Account</button>
                {verifyDeleteAcc && (<>
                    <div className={styles.optionsDelete}>
                        <span>Are you sure?</span>
                        <div className={styles.actions}>
                            <button onClick={deleteAccount}>Yes, delete my account</button>
                            <button onClick={()=>setVerifyDeleteAcc(false)}>No, don’t delete my account</button>
                        </div>
                    </div>
                </>)}
            </div> */}
        </main>
    )
}
