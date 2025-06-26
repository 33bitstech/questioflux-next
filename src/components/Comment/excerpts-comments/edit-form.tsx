import CloseSvg from '@/components/Icons/CloseSvg'
import Send from '@/components/Icons/Comment/Send'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, TextareaHTMLAttributes } from 'react'

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{
    styles: TStyles,
    handleSubmitEdit: (e:FormEvent) => void,
    loadingEdit: boolean,
    handleEdit: ()=>void
}

export default function EditForm({styles, handleSubmitEdit, handleEdit, loadingEdit, ...props}:IProps) {
    return (
        <>
            <form onSubmit={handleSubmitEdit}>
                <textarea 
                    {...props} 
                    autoFocus 
                    maxLength={2000}
                />
                <div className={styles.edit_actions}>
                    <span onClick={handleEdit}><CloseSvg/></span>
                    <button type='submit' disabled={loadingEdit}><Send/></button>
                </div>
            </form>
        </>
    )
}
