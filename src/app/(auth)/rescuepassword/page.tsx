import React from 'react'

import '@/assets/styles/auth.scss'
import KeysSvg from '@/components/Icons/KeysSvg'
import RescuePasswordForm from '@/components/AuthForms/Auth-client-components/rescue-password-form'
import Link from 'next/link'

export default function RescuePassword() {
    return (
        <div className='container-section'>
            <section className='forgotpass-section'>
                <KeysSvg />
                <RescuePasswordForm/>
                <p>Haven't Account? <Link href='/register'>Register</Link></p>
            </section>
        </div>
    )
}
