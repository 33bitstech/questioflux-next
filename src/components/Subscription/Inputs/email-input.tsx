import React, { ChangeEvent, useState } from 'react';
import styles from './email-input.module.scss';

interface IProps {
    onEmailChange: React.Dispatch<React.SetStateAction<string>>
    emailValue: string
    checkout?: any
}

const EmailInput = ({ onEmailChange, emailValue, checkout }: IProps) => {
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null)
        onEmailChange(e.target.value)
    }

    const handleBlur = async () => {
        if (!emailValue || !checkout) return
        const result = await checkout.updateEmail(emailValue)
        if (result.type === 'error') {
            setError(result.error.message)
        }
    }

    return (
        <div className={`${styles.email_container}`}>
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                value={emailValue}
                required={true}
                onChange={handleChange}
                onBlur={handleBlur}
                className={error ? styles.error : ''}
            />
            {error && <div className={styles.error_message}>{error}</div>}
        </div>
    );
};

export default EmailInput;