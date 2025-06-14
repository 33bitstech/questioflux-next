"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import '@/assets/styles/auth.scss'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  error?: string | null;
}

export default function InputComponent({ icon, error, ...props }: InputProps) {
    return (
        <div className={'input-error-message'}>
            <div className={error ? `input-class input-erro` : 'input-class'}>
                {icon}
                <input {...props} />
            </div>
            {error && <p>{error}</p>}
        </div>
    );
}