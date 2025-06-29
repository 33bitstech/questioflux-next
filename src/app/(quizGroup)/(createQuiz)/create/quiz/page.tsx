import Link from 'next/link'
import React from 'react'

import styles from './create-quiz-page.module.scss'
import SmileSvg from '@/components/Icons/SmileSvg'
import CloverSvg from '@/components/Icons/CloverSvg'
import SoonSvg from '@/components/Icons/SoonSvg'
import ListSvg from '@/components/Icons/ListSvg'
import StrokeProfileSvg from '@/components/Icons/StrokeProfileSvg'

export default function CreateQuizPage() {
    return (
        <main className={styles.content}>
            <div className={styles.create_quiz_types}>
                <h1>Create your quiz</h1>
                <p>To start creating your quiz, personality test or list, simply click on the respective button below and get started right now.</p>
                <ul>
                    <nav>
                        <li className={styles.type_actived}>
                            <Link href='/create/quiz/cover'>
                                <span className={styles.icon_emoji}><CloverSvg/></span>
                                <p>
                                    <span>Right and wrong quiz:</span>There is only one right answer to each question! Here you will find a variety of fun and challenging questions in different categories.
                                </p>
                            </Link>
                        </li>
                        <li className={styles.type_inactived}>
                            <Link href='#'>
                                <span className={styles.icon_emoji}><SmileSvg/></span>
                                <p>
                                    <span>Personality quiz:</span> There are no definitive answers. Results depend on the unique characteristics and personality of each participant.
                                </p>
                            </Link>
                            <span className={styles.soon}><SoonSvg/></span>  
                        </li>
                        <li className={styles.type_inactived}>
                            <Link href='#'>
                                <span className='iconemoji'><ListSvg/></span>
                                <p>
                                    <span>List quiz:</span> Create your text organized by items.
                                </p>
                            </Link>
                            <span className={styles.soon}><SoonSvg/></span>
                        </li>
                        <li className={styles.type_inactived}>
                            <Link href='#'>
                                <span className={styles.icon_emoji}><StrokeProfileSvg/></span>
                                <p>
                                    <span>About me quiz:</span> Invite your friends to find out who knows you best.
                                </p>
                            </Link>
                            <span className={styles.soon}><SoonSvg/></span>
                        </li>
                    </nav>
                </ul>
            </div>
            <div className={styles.description_types}>
                <section>
                    <h2>Right and Wrong Quiz</h2>
                    <p>This is the type of quiz where the objective is to get all the answers correct. This type of test is widely used to measure your knowledge on a particular subject. It's a favorite for those fans who want to challenge their friends to see who knows the most about a certain topic. Additionally, many teachers create this type of interactive test as an educational quiz to assess their students' knowledge. It is also known as a question and answer quiz.</p>
                </section>

                <section>
                    <h2>Personality Quiz</h2>
                    <p>This is a type of test in which you answer some questions and, depending on your answers, the quiz will give you the result that best aligns with your personality. This is not a quiz to measure your knowledge, but rather to determine which result you are most compatible with. If you want to create a quiz with titles like: "Who would you be in ____?", "What kind of ____ are you?", "Which ____ suits you best?", "Can we guess ____?", then this is it. the type of quiz you should create!</p>
                </section>

                <section>
                    <h2>Image Quiz</h2>
                    <p>This is the type of quiz where the objective is to get all the answers correct based on images. Additionally, many teachers create this type of interactive test as an educational quiz to assess their students' visual comprehension. It is also known as a visual interpretation quiz, where each question is presented exclusively through images, with no text involved.</p>
                </section>
            </div>
        </main>
    )
}
