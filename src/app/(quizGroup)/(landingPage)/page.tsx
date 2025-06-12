import styles from './lp.module.scss'
import Link from "next/link";
import CloverSvg from "@/components/Icons/CloverSvg";
import SmileSvg from "@/components/Icons/SmileSvg";
import ListSvg from "@/components/Icons/ListSvg";
import LockedSvg from "@/components/Icons/LockedSvg";
import StrokeProfileSvg from "@/components/Icons/StrokeProfileSvg";
import WorldSvg from "@/components/Icons/WorldSvg";
import Wave from "@/components/wave";

export default function LandingPage() {

    return (
        <div className={`${styles.container}}`}>
            <main className={styles.content}>
                <section id='create_quiz' className={styles.create_quiz}>
                    <div className={styles.title_section}>
                        <h1>
                            <span>Create your <strong>custom quiz</strong> and share</span>
                            <span>it with your friends using <strong>Quiz vortex</strong></span>
                            
                            <span className={styles.fakeh2}>Make a variety of quiz styles and have fun sharing with your friends - which one suits you best?</span>
                        </h1>
                    </div>
                    <div id="actions_section" className={styles.actions_section}>
                        <ul>
                            <li><span><CloverSvg/></span></li>
                            <li><span><SmileSvg/></span></li>
                            <li><span><StrokeProfileSvg/></span></li>
                            <li><span><ListSvg/></span></li>
                        </ul>
                        {/* <Link herf='#register_comp_section' className={styles.button_link}>Start Now</Link> */}
                        <Link href={'/explore'} className={styles.explore_link} >Explore</Link>
                    </div>
                </section>

                <div className={styles.wave}>
                    <Wave/>
                </div>

                <section id='quiz_styles_section' className={styles.quiz_styles_section}>
                    <div className={`${styles.title_section} ${styles.subtitle}`}>
                        <h2>Classic quiz styles</h2>
                        <p>What type of quiz do you want to do?</p>
                    </div>
                    <ul id='quiz_styles' className={styles.box_itens}>
                        <li>
                            <span><CloverSvg/></span>
                            <p>
                                <span>Right and wrong quiz:</span>There is only one right answer to each question! Here you will find a variety of fun and challenging questions in different categories.
                            </p>
                        </li>
                        <li>
                            <span><SmileSvg/></span>
                            <p>
                                <span>Personality quiz:</span> There are no definitive answers. Results depend on the unique characteristics and personality of each participant.
                            </p>
                        </li>
                        <li>
                            <span><ListSvg/></span>
                            <p>
                                <span>List quiz:</span> Create your text organized by items.
                            </p>
                        </li>
                        <li>
                            <span><StrokeProfileSvg/></span>
                            <p>
                                <span>About me quiz:</span> Invite your friends to find out who knows you best.
                            </p>
                        </li>
                    </ul>
                    <Link href='/create/quiz' className={styles.button_link}>Create Now</Link>
                </section>
                {/* <GoogleAd/> */}
                <section id='quiz_exploration_section' className={styles.quiz_exploration_section}>
                    <div className={`${styles.title_section} ${styles.subtitle}`}>
                        <h2>Quiz exploration</h2>
                        <p>How about answering quizzes already created by other users? </p>
                    </div>
                    <ul id='quiz_types' className={styles.box_itens}>
                        <li>
                            <span><WorldSvg/></span>
                            <p>
                                <span>Public quizzes:</span> Create professional quizzes and post them on your profile for other users to take.
                            </p>
                        </li>
                        <li>
                            <span><LockedSvg/></span>
                            <p>
                                <span>Private quizzes:</span> Create private quizzes, users can only access them if you share a special link.
                            </p>
                        </li>
                    </ul>                    
                </section>


                <div className={styles.wave}>
                    <Wave/>
                </div>

                {/* <GoogleAd/> */}

                {/* <section id='register_comp_section' className={styles.register_comp_section}>
                    <RegisterForm pageReg={false}/>
                </section> */}

            </main>

            {/* <GoogleAd/> */}

            <footer className={styles.footer}>
                <Link href={'/aboutus'}>About us</Link>
            </footer>
        </div>
    );
}
