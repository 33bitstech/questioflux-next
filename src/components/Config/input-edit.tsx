'use client'
import { TStyles } from '@/types/stylesType'
import React, { InputHTMLAttributes } from 'react'
import EditSvg from '../Icons/EditSvg'
import CloseSvg from '../Icons/CloseSvg'

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
    styles: TStyles,
    isEditing: boolean,
    toggleEditing: ()=>void,
    label: string,
    spanValue?: string
    labelValue: string
}

export default function InputEdit({styles, isEditing, labelValue,toggleEditing, spanValue, label, ...props}: IProps) {
    return (
        <div className={styles.edit_input}>
            <div className={styles.infos}>
                <label htmlFor={label}>{labelValue}: </label>
                {isEditing ? (
                    <input {...props} id={label} />
                ) : (
                    <span>{spanValue}</span>
                )}
            </div>
            <span onClick={toggleEditing}>
                {!isEditing && <EditSvg/>}
                {isEditing && <CloseSvg/>}
            </span>
        </div>
    )
}
