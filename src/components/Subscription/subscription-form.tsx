'use client'
import { TStyles } from '@/types/stylesType';
import ChooseMethod from './choose-method';

interface IProps {
    publicKey: string;
    type: string;
    styles: TStyles;
}

export default function SubscriptionForm({ publicKey, styles, type }: IProps) {
    return (
        <ChooseMethod styles={styles} type={type} publicKey={publicKey} />
    )
}