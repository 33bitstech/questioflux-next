'use client'
import { useUser } from '@/contexts/userContext'
import React from 'react'

export default function UserProfileHeader() {
    const {user} = useUser()

    console.log(user)
    return (
        <div>user-profile-header</div>
    )
}
