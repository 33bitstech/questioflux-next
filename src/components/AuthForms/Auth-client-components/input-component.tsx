"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import '@/assets/styles/auth.scss'
import { Eye, EyeClosed } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  onToggleHidePassword?: ()=>void,
  isPasswordHidden?: boolean
  error?: string | null;
}

export default function InputComponent({isPasswordHidden, onToggleHidePassword, icon, error, name, ...props }: InputProps) {
    return (
        <div className={'input-error-message'}>
            <div className={error ? `input-class input-erro` : 'input-class'}>
                {icon}
                <input {...props} name={name} />

                <label className="label-hidden" htmlFor={name}>{name}</label>
            
                {onToggleHidePassword && (
                    <span
                        className="eyes_password"
                        onClick={onToggleHidePassword}
                    >
                        {isPasswordHidden 
                            ? <EyeClosed/>
                            : <Eye/>
                        }
                    </span>
                )}
                
            </div>
            {error && <p>{error}</p>}
        </div>
    );
}