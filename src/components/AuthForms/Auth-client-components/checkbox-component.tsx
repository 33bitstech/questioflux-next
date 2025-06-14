"use client";

import { InputHTMLAttributes, MouseEvent } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    onChange: () => void;
}

export default function CheckboxComponent({ label, checked, onChange, name, ...props }: CheckboxProps) {
    const id = `checkbox-${name || label.replace(/\s+/g, '-').toLowerCase()}`;
    const spanClasses = `checkbox-span ${checked ? 'is-checked' : ''}`.trim();

    const handleSpanClick = (e: MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        onChange();
    };

    return (
        <div className="remember-me-div">
            <input 
                type="checkbox" 
                id={id} 
                checked={!!checked} 
                onChange={() => onChange()}
                {...props}
            />
            <label htmlFor={id}>{label}</label>
            <span 
                className={spanClasses} 
                onClick={handleSpanClick}
            ></span>
        </div>
    );
}