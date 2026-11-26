import React from 'react'

// Logo do X (antigo Twitter) num círculo do mesmo tamanho dos outros botões de compartilhar.
// As cores seguem o tema: círculo na cor do texto, logo na cor do fundo.
const XSvg = () => {
    return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="26" cy="26" r="26" style={{ fill: 'var(--text-primary)' }} />
            <path
                transform="translate(14 14)"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                style={{ fill: 'var(--background-primary)' }}
            />
        </svg>
    )
}

export default XSvg
