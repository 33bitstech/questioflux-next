import React from 'react'
import styles from './About.module.scss'
import { Metadata } from 'next'


export async function generateMetadata() : Promise<Metadata> {
    return {
        title: 'About us'
    }
}


export default function Aboutus() {

    
    return (
        <div className={styles.container}>
            <section>
                <h1><span>About us </span>  
                    &
                    Support
                </h1>
                <article>
                    <p>A custom quiz site is an interactive platform where users have the freedom to create their own quizzes in a simple and intuitive way. They can customize questions, answers, and even add visual elements such as images and videos to make their quizzes more engaging.
                        <br />
                    Once a user has created a quiz, they can share it with friends or the general public, encouraging participation and interaction. Participants can answer questions, view their results, and leave comments on the quiz. This commenting functionality allows for direct feedback, discussions, and social interaction, making the process a collaborative and fun experience.
                        <br />
                    In addition, the site offers a user-friendly interface and customization options, allowing creators to adapt their quizzes to a variety of topics, such as trivia, general knowledge, personality tests, and more. The idea is to encourage creativity while promoting sharing and interaction among users.
                        <br />
                    This dynamic environment transforms quizzes into a form of social entertainment, where anyone can be both a creator and a participant in custom quizzes.
                    </p>
                </article>
                <div className={styles.end_of_content}></div>
                <article>
                    <p>
                    Our quiz site values your privacy and security. Therefore, we want to clarify that we only use strictly necessary cookies to ensure the proper functioning of our site. These cookies allow you to navigate and use all the features, such as taking quizzes and accessing your response history, efficiently and securely.
                        <br />
                    Additionally, we do not store sensitive payment information in our database. All payment processing is securely handled by Stripe, one of the most recognized and trusted payment platforms in the market. Stripe adheres to the highest standards of security and compliance, ensuring that your financial data is protected throughout the transaction process.
                        <br />
                    Our commitment is to provide a safe and transparent experience for all our users. If you have any questions or concerns about our privacy policy, we are here to help.
                    </p>
                </article>
                <div className={styles.end_of_content}></div>
                <article>
                    <p>Suport email: <span>33bitstech@gmail.com</span></p>
                </article>
            </section>
        </div>
    )
}
