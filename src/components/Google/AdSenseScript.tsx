'use client'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

// O quiz embutido em outro site (/embed) não leva anúncio. Sem o script não entram nem os
// anúncios automáticos, que o AdSense coloca na página mesmo sem nenhum bloco nela.
export default function AdSenseScript() {
    const pathname = usePathname()

    if (/^\/(en|pt|es)\/embed\//.test(pathname)) return null

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7383504438544213`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
        />
    )
}
