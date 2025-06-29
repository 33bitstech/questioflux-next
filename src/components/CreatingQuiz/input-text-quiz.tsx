"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import '@/assets/styles/auth.scss'
import { TStyles } from "@/types/stylesType";

interface InputProps {
  error?: string | null;
  styles: TStyles,
  labelFor: string,
  labelValue: string,
  children: ReactNode
}

export default function InputTextQuiz({labelFor, labelValue,error, styles, children }: InputProps) {
    return (
        <div className={styles.field}>
            <label htmlFor={labelFor}>{labelValue}</label>
            {children}
            {error && 
                <p 
                    className={styles.message_error_input}
                >
                    {error}
                </p>
            }
        </div>
    );
}