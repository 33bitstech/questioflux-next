import Script from 'next/script'
import { GA_MEASUREMENT_ID } from '@/utils/analytics'

const init = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`

// Vai dentro do <head>. O trecho inline roda antes da hidratação, então gtag() já existe
// quando o primeiro evento é disparado. A biblioteca só é baixada em produção: em dev os
// eventos ficam em window.dataLayer para conferência e nada chega aos relatórios.
// As trocas de página (navegação sem recarregar) o GA4 conta sozinho.
export default function GoogleAnalytics() {
    return (
        <>
            <script dangerouslySetInnerHTML={{ __html: init }} suppressHydrationWarning />
            {process.env.NODE_ENV === 'production' && (
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                    strategy="afterInteractive"
                />
            )}
        </>
    )
}
