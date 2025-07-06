'use client'
import IFinalMessages from '@/interfaces/IFinalMessages'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl' // Importar

interface IProps{
    styles: TStyles,
    messagesChanged: (messages: IFinalMessages) => void
    finalMessages?: IFinalMessages
}

export default function InputFinalMessages({styles, messagesChanged, finalMessages}:IProps) {
    const t = useTranslations('creatingQuiz.finalMessages'); // Inicializar hook

    // Criar o objeto de mensagens padrão usando as traduções
    // useMemo evita que o objeto seja recriado em cada renderização
    const defaultMessages: IFinalMessages = useMemo(() => ({
        allCorrect: t('defaults.allCorrect'),
        aboveEighty: t('defaults.aboveEighty'),
        aboveFifty: t('defaults.aboveFifty'),
        belowFifty: t('defaults.belowFifty'),
        allWrong: t('defaults.allWrong')
    }), [t]);

    const [allCorrect, setAllCorrect] = useState<string>(defaultMessages.allCorrect);
    const [aboveEighty, setAboveEighty] = useState<string>(defaultMessages.aboveEighty);
    const [aboveFifty, setAboveFifty] = useState<string>(defaultMessages.aboveFifty);
    const [belowFifty, setBelowFifty] = useState<string>(defaultMessages.belowFifty);
    const [allWrong, setAllWrong] = useState<string>(defaultMessages.allWrong);
    const [customMessages, setCustomMessages] = useState<boolean>(false);

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
    },[customMessages, allCorrect, aboveEighty, aboveFifty, belowFifty, allWrong, defaultMessages, messagesChanged])

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
    },[finalMessages, defaultMessages])

    return (
        <>
            <div className={styles.messages_actions}>
                <button 
                    type='button'
                    onClick={()=>setCustomMessages(false)}
                    className={!customMessages ? `${styles.button_message} ${styles.active_button}` : styles.button_message}
                >{t('defaultButton')}</button>
                <button 
                    type='button'
                    onClick={()=>setCustomMessages(true)}
                    className={customMessages ? `${styles.button_message} ${styles.active_button}` : styles.button_message}
                >{t('customButton')}</button>
            </div>
            {customMessages && <div className={styles.messages_inputs}>
                <div className={styles.field}>
                    <input type="text" value={allCorrect} onChange={e=>setAllCorrect(e.target.value)} />
                </div>
                <div className={styles.field}>
                    <input type="text" value={aboveEighty} onChange={e=>setAboveEighty(e.target.value)} />
                </div>
                <div className={styles.field}>
                    <input type="text" value={aboveFifty} onChange={e=>setAboveFifty(e.target.value)} />
                </div>
                <div className={styles.field}>
                    <input type="text" value={belowFifty} onChange={e=>setBelowFifty(e.target.value)} />
                </div>
                <div className={styles.field}>
                    <input type="text" value={allWrong} onChange={e=>setAllWrong(e.target.value)} />
                </div>
            </div>}
        </>
    )
}