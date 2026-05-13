'use client'

import { GoogleIcon } from '@/components/Icons/GoogleIcon'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface IGoogleAuthButtonProps {
    locale?: string
    separatorBelow?: boolean
}

export default function GoogleAuthButton({ locale, separatorBelow = false }: IGoogleAuthButtonProps) {
    const t = useTranslations('googleAuth')
    const [loading, setLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true)
            // Wire up your Google OAuth provider here.
            // Example with NextAuth: signIn('google', { callbackUrl: `/${locale}/home` })
            // Example with custom OAuth: window.location.href = '/api/auth/google'
            console.log('Google sign-in triggered')
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const separator = (
        <>
            <div className="google-separator">
                <span className="google-separator-line" />
                <span className="google-separator-text">{t('separator')}</span>
                <span className="google-separator-line" />
            </div>
            <style jsx>{`
                .google-separator {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                }

                .google-separator-line {
                    flex: 1;
                    height: 1px;
                    background-color: var(--background-secondary);
                    border-radius: 99px;
                }

                .google-separator-text {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 400;
                    color: #a0a0a0;
                    white-space: nowrap;
                    text-transform: lowercase;
                    letter-spacing: 0.02em;
                }
            `}</style>
        </>
    )
    const btn = (
        <>
            <button
                type="button"
                className={`google-btn${loading ? ' google-btn--loading' : ''}`}
                onClick={handleGoogleSignIn}
                disabled={loading}
            >
                {loading ? (
                    <span className="google-btn__spinner" />
                ) : (
                    <GoogleIcon />
                )}
                <span>{loading ? t('loading') : t('button')}</span>
            </button>
            <style jsx>{`
                .google-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                    padding: 0.65rem 0;
                    border-radius: 10px;
                    border: 1.5px solid rgba(255, 255, 255, 0.12);
                    background-color: rgba(255, 255, 255, 0.06);
                    cursor: pointer;
                    transition: background-color 0.18s ease, border-color 0.18s ease,
                    transform 0.12s ease;
                    font-family: 'Inter', sans-serif;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #e8e8e8;
                    letter-spacing: 0.01em;
                    outline: none;
                }

                .google-btn:hover:not(:disabled) {
                    background-color: rgba(255, 255, 255, 0.11);
                    border-color: rgba(255, 255, 255, 0.22);
                    transform: translateY(-1px);
                }

                .google-btn:active:not(:disabled) {
                    transform: translateY(0px);
                    background-color: rgba(255, 255, 255, 0.08);
                }

                .google-btn:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                .google-btn--loading {
                    pointer-events: none;
                }

                .google-btn__spinner {
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: google-spin 0.7s linear infinite;
                    flex-shrink: 0;
                }

                @keyframes google-spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
        
    )

    return (
        <div className="google-auth-wrapper">
            {separatorBelow ? (
                <>
                    {btn}
                    {separator}
                </>
            ) : (
                <>
                    {separator}
                    {btn}
                </>
            )}
            <style jsx>{`
                .google-auth-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 100%;
                    margin-top: 4px;
                }
            `}</style>
        </div>
    )
}