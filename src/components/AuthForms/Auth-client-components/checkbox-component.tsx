"use client";

import { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function CheckboxComponent({ label, checked, onChange, name, ...props }: CheckboxProps) {
    const id = `checkbox-${name || label.replace(/\s+/g, '-').toLowerCase()}`;

    const spanClasses = `checkbox-span ${checked ? 'is-checked' : ''}`.trim();

    return (
        <div className="remember-me-div">
            <input 
                type="checkbox" 
                id={id} 
                checked={!!checked} 
                onChange={onChange}
                {...props}
            />
            <label htmlFor={id}>{label}</label>
            <span 
                className={spanClasses} 
                onClick={onChange}
            ></span>
        </div>
    );
}