import React, { ChangeEvent } from 'react';
import { useCheckout } from '@stripe/react-stripe-js';
import styles from './email-input.module.scss';

interface IProps {
    onEmailChange: React.Dispatch<React.SetStateAction<string>>
    emailValue: string
}

const EmailInput = ({ onEmailChange, emailValue}: IProps) => {
    const checkout = useCheckout();

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        onEmailChange(email);
        checkout.updateEmail(email);
    };

    return (
        <div className={`${styles.email_container}`}>
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                value={emailValue}
                required={true}
                onChange={handleChange}
            />
        </div>
    );
};

export default EmailInput;
