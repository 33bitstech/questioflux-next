'use client'
import IFinalMessages from '@/interfaces/IFinalMessages'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'

interface IProps{
    styles: TStyles,
    messagesChanged: (messages: IFinalMessages) => void
}

export default function InputFinalMessages({styles, messagesChanged}:IProps) {

    const [allCorrect, setAllCorrect] = useState<string>("Congratulations! You got all the questions right!"),
        [aboveEighty, setAboveEighty] = useState<string>("Great job! You got more than 80% of the questions right."),
        [aboveFifty, setAboveFifty] = useState<string>("Good job! You got more than 50% of the questions right."),
        [belowFifty, setBelowFifty] = useState<string>("You got less than 50% of the questions right. Keep practicing!"),
        [allWrong, setAllWrong] = useState<string>("Too bad! You got all the questions wrong. Don't give up and try again!"),

        [customMessages, setCustomMessages] = useState<boolean>(false)

    useEffect(()=>{
        if(!customMessages){
            messagesChanged({
                allCorrect: 'Congratulations! You got all the questions right!',
                aboveEighty: 'Great job! You got more than 80% of the questions right.',
                aboveFifty: 'Good job! You got more than 50% of the questions right.',
                belowFifty: 'You got less than 50% of the questions right. Keep practicing!',
                allWrong: "Too bad! You got all the questions wrong. Don't give up and try again!"
            })
        }else{
            messagesChanged({allCorrect, aboveEighty, aboveFifty, allWrong, belowFifty})
        }
    },[customMessages, allCorrect, aboveEighty, aboveFifty, belowFifty, allWrong])
    return (
        <>
            <div className={styles.messages_actions}>
                <button 
                    type='button'
                    onClick={()=>setCustomMessages(false)}
                    className={!customMessages ? `${styles.button_message} ${styles.active_button}` : styles.button_message}
                >Default</button>
                <button 
                    type='button'
                    onClick={()=>setCustomMessages(true)}
                    className={customMessages ? `${styles.button_message} ${styles.active_button}` : styles.button_message}
                >Customizable</button>
            </div>
            {customMessages && <div className={styles.messages_inputs}>
                <div className={styles.field}>
                    <input 
                        type="text" 
                        value={allCorrect}
                        onChange={e=>setAllCorrect(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className={styles.field}>
                    <input 
                        type="text" 
                        value={aboveEighty}
                        onChange={e=>setAboveEighty(e.target.value)}
                    />
                </div>
                <div className={styles.field}>
                    <input 
                        type="text" 
                        value={aboveFifty}
                        onChange={e=>setAboveFifty(e.target.value)}
                    />
                </div>
                <div className={styles.field}>
                    <input 
                        type="text" 
                        value={belowFifty}
                        onChange={e=>setBelowFifty(e.target.value)}
                    />
                </div>
                <div className={styles.field}>
                    <input 
                        type="text" 
                        value={allWrong}
                        onChange={e=>setAllWrong(e.target.value)}
                    />
                </div>
            </div>}
        </>
    )
}
