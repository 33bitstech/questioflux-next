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

export default function InputComponent({isPasswordHidden, onToggleHidePassword, icon, error, ...props }: InputProps) {
    return (
        <div className={'input-error-message'}>
            <div className={error ? `input-class input-erro` : 'input-class'}>
                {icon}
                <input {...props} />
            
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