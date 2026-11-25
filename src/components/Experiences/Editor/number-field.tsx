'use client'
import { useEffect, useState } from 'react'

interface IProps {
    id: string
    value: number
    onChange: (value: number) => void
    min: number
    max: number
    'aria-label'?: string
}

// Número inteiro digitado livremente ("-", campo vazio) e confirmado ao sair do campo.
export default function NumberField({ id, value, onChange, min, max, ...rest }: IProps) {
    const [draft, setDraft] = useState(String(value))
    const [focused, setFocused] = useState(false)

    useEffect(() => {
        if (!focused) setDraft(String(value))
    }, [value, focused])

    const commit = (raw: string) => {
        const parsed = Number.parseInt(raw, 10)
        const next = Number.isNaN(parsed) ? 0 : Math.min(max, Math.max(min, parsed))
        setDraft(String(next))
        if (next !== value) onChange(next)
    }

    return (
        <input
            id={id}
            type="text"
            inputMode="numeric"
            value={draft}
            aria-label={rest['aria-label']}
            onFocus={() => setFocused(true)}
            onChange={event => {
                const raw = event.target.value
                if (!/^-?\d*$/.test(raw)) return
                setDraft(raw)
                const parsed = Number.parseInt(raw, 10)
                if (!Number.isNaN(parsed) && parsed >= min && parsed <= max) onChange(parsed)
            }}
            onBlur={event => { setFocused(false); commit(event.target.value) }}
        />
    )
}
