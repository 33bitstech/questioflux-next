import React, { ComponentProps } from 'react'
import styles from './skeleton.module.scss'

export default function Skeleton({className, ...props} : ComponentProps<'div'>) {
    let classe = ''
    classe += `${styles.skeleton} ${className ? className : ''}`
    return (
        <div
            className={classe}
            {...props}
        />
    )
}
