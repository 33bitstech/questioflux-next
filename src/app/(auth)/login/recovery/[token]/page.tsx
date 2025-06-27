import React from 'react'

import '@/assets/styles/auth.scss'
import KeysSvg from '@/components/Icons/KeysSvg'
import ChangePassworForm from '@/components/AuthForms/Auth-client-components/change-password-form'


interface IProps {
    params: {
        token: string
    }
}

export default async function RecoveryPage({params}: IProps) {
    const {token} = await params
    return (
        <div className='container-section'>
            <section className='forgotpass-section'>
                <KeysSvg />
                <ChangePassworForm
                    token={token}
                />
            </section>
        </div>
    )
}
