'use client'
import IFinalMessages from '@/interfaces/IFinalMessages'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'

interface IProps{
    styles: TStyles,
    messagesChanged: (messages: IFinalMessages) => void
    finalMessages?: IFinalMessages
}

export default function InputFinalMessages({styles, messagesChanged, finalMessages}:IProps) {
    const defaultMessages : IFinalMessages= {
        allCorrect: 'Congratulations! You got all the questions right!',
        aboveEighty: 'Great job! You got more than 80% of the questions right.',
        aboveFifty: 'Good job! You got more than 50% of the questions right.',
        belowFifty: 'You got less than 50% of the questions right. Keep practicing!',
        allWrong: "Too bad! You got all the questions wrong. Don't give up and try again!"
    }

    const [allCorrect, setAllCorrect] = useState<string>(defaultMessages.allCorrect),
        [aboveEighty, setAboveEighty] = useState<string>(defaultMessages.aboveEighty),
        [aboveFifty, setAboveFifty] = useState<string>(defaultMessages.aboveFifty),
        [belowFifty, setBelowFifty] = useState<string>(defaultMessages.belowFifty),
        [allWrong, setAllWrong] = useState<string>(defaultMessages.allWrong),

        [customMessages, setCustomMessages] = useState<boolean>(false)

    const compareFinalMessages = (obj1:IFinalMessages, obj2:IFinalMessages)=>{
        return (
            obj1.allCorrect == obj2.allCorrect && 
            obj1.aboveEighty == obj2.aboveEighty && 
            obj1.aboveFifty == obj2.aboveFifty && 
            obj1.belowFifty == obj2.belowFifty && 
            obj1.allWrong == obj2.allWrong 
        )
    } 
    
    useEffect(()=>{
        if(!customMessages){
            messagesChanged(defaultMessages)
        }else{
            messagesChanged({allCorrect, aboveEighty, aboveFifty, allWrong, belowFifty})
        }
    },[customMessages, allCorrect, aboveEighty, aboveFifty, belowFifty, allWrong])

    //in edit
    useEffect(()=>{
        if(finalMessages && !compareFinalMessages(finalMessages, defaultMessages)){
            setCustomMessages(true)
            setAllCorrect(finalMessages.allCorrect)
            setAboveEighty(finalMessages.aboveEighty)
            setAboveFifty(finalMessages.aboveFifty)
            setBelowFifty(finalMessages.belowFifty)
            setAllWrong(finalMessages.allWrong)
        }
    },[finalMessages])
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
