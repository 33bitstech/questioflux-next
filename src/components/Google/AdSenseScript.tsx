'use client'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

// O script do AdSense. Ele também traz os anúncios automáticos, que o AdSense coloca na
// página mesmo sem nenhum bloco nela.
export function AdSenseLoader() {
    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7383504438544213`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
        />
    )
}

// O quiz embutido em outro site (/embed) e a página de pagamento não levam anúncio. As
// páginas de um quiz carregam o script pelo próprio layout, que sabe se quem criou assina o
// QuestioPlus: aí não entra anúncio nenhum, nem automático. Limite: quem chega ao quiz vindo
// de outra página do site já tem o script carregado, e um anúncio automático fixo (a faixa
// no rodapé, por exemplo) pode continuar na tela.
export default function AdSenseScript() {
    const pathname = usePathname()

    if (/^\/(en|pt|es|zh)\/(embed|subscription)\//.test(pathname)) return null
    if (/^\/(en|pt|es|zh)\/quiz\/(?!edit\/)[^/]+/.test(pathname)) return null

    return <AdSenseLoader />
}
