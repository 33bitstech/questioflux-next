'use client'
import NavLink from '@/components/widgets/NavLink'
import { useUser } from '@/contexts/userContext'
import React from 'react'

export default function LinkProfile() {
    const {user} = useUser()
    return (
        <NavLink href={`/user/${user?.userId}`}>Profile</NavLink>
    )
}
