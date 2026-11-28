import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import ApiData from '@/utils/ApiData'
import { getPublicQuiz } from '@/utils/publicQuiz'
import { quizImageUrl } from '@/utils/seo'
import { RESULT_PREVIEW_SIZE, resultPreview } from '@/utils/resultPreview'
import { routing } from '@/i18n/routing'
import IParticipationView from '@/interfaces/IParticipation'
import { env } from '@/env'

// Imagem da prévia do link de um resultado (og:image): o resultado em si, com a marca.
// /api/og/result/:quizId/:participationId?locale=pt

// imagens só destes endereços (os mesmos liberados para o next/image)
const IMAGE_HOSTS = ['quizvortex33.s3.sa-east-1.amazonaws.com', 'quizvortex.s3.sa-east-1.amazonaws.com', 'lh3.googleusercontent.com']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const fallback = () => NextResponse.redirect(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`, 307)

async function participationOf(quizId: string, participationId: string): Promise<IParticipationView | null> {
    const response = await ApiData({
        path: `participation/${encodeURIComponent(quizId)}/${encodeURIComponent(participationId)}`,
        method: 'GET',
        cache: { cache: 'no-store' },
    })
    if (!response.ok) return null
    const body = await response.json()
    return body?.participation ?? null
}

// Baixa a imagem antes e entrega como data URL: um formato que o gerador não lê (ou um
// endereço lento) derrubaria a imagem inteira no meio. Só PNG, JPEG e GIF, pelos bytes.
async function imageData(url?: string): Promise<string | undefined> {
    if (!url) return undefined
    try {
        const parsed = new URL(url)
        const allowed = process.env.NODE_ENV === 'development' || (parsed.protocol === 'https:' && IMAGE_HOSTS.includes(parsed.hostname))
        if (!allowed) return undefined
        const response = await fetch(parsed, { signal: AbortSignal.timeout(4000), next: { revalidate: 86400 } })
        if (!response.ok) return undefined
        const bytes = Buffer.from(await response.arrayBuffer())
        if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) return undefined
        const type = bytes[0] === 0x89 && bytes[1] === 0x50 ? 'image/png'
            : bytes[0] === 0xff && bytes[1] === 0xd8 ? 'image/jpeg'
                : bytes.subarray(0, 3).toString('ascii') === 'GIF' ? 'image/gif'
                    : undefined
        return type ? `data:${type};base64,${bytes.toString('base64')}` : undefined
    } catch {
        return undefined
    }
}

// Inter, a fonte do site (o gerador só traz uma fonte regular). Sem ela, a imagem sai com a padrão.
let fontsPromise: Promise<Array<{ name: string, data: ArrayBuffer, weight: 600 | 800, style: 'normal' }>> | undefined
function interFonts() {
    fontsPromise ??= Promise.all(([600, 800] as const).map(async weight => {
        const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`, { next: { revalidate: 604800 } })).text()
        const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
        if (!src) throw new Error('fonte Inter não encontrada')
        const data = await (await fetch(src, { next: { revalidate: 604800 } })).arrayBuffer()
        return { name: 'Inter', data, weight, style: 'normal' as const }
    })).catch(error => {
        fontsPromise = undefined
        throw error
    })
    return fontsPromise
}

let iconPromise: Promise<string> | undefined
const siteIcon = () => (iconPromise ??= readFile(join(process.cwd(), 'public', 'iconv2.png')).then(data => `data:image/png;base64,${data.toString('base64')}`))

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text)
const titleSize = (title: string, narrow: boolean) => {
    const length = title.length + (narrow ? 8 : 0)
    return length <= 18 ? 92 : length <= 30 ? 76 : length <= 48 ? 62 : 52
}

const CYAN = '#00e5ff'

export async function GET(request: Request, { params }: { params: Promise<{ quizId: string, participationId: string }> }) {
    const { quizId, participationId } = await params
    const requested = new URL(request.url).searchParams.get('locale') ?? ''
    const locale = (routing.locales as readonly string[]).includes(requested) ? requested : routing.defaultLocale

    // quiz ou resultado que não existe (ou a API fora do ar): a imagem padrão do site
    const loaded = await Promise.all([getPublicQuiz(quizId), participationOf(quizId, participationId)])
        .then(async ([quiz, participation]) => quiz && participation ? { quiz, preview: await resultPreview(quiz, participation, locale) } : null)
        .catch(() => null)
    if (!loaded) return fallback()
    const { quiz, preview } = loaded

    // a imagem do próprio resultado; sem ela, a capa do quiz (a capa padrão não entra)
    const cover = quizImageUrl(quiz) === quiz.quizThumbnail ? quiz.quizThumbnail : undefined
    const ring = typeof preview.percent === 'number'
    const [picture, icon, fonts] = await Promise.all([
        ring ? undefined : imageData(preview.image).then(data => data ?? imageData(cover)),
        siteIcon().catch(() => undefined),
        interFonts().catch(() => undefined),
    ])
    const side = ring || !!picture
    const title = clip(preview.title, 90)
    const description = preview.description ? clip(preview.description, side ? 120 : 170) : undefined

    // anel da compatibilidade
    const radius = 160
    const circumference = 2 * Math.PI * radius
    const filled = Math.max(0, Math.min(100, preview.percent ?? 0)) / 100 * circumference

    return new ImageResponse(
        (
            <div style={{
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 56, padding: '64px 72px',
                background: 'linear-gradient(125deg, #0a4dff 0%, #1a2f95 52%, #173f55 100%)',
                color: '#ffffff', fontFamily: fonts ? 'Inter' : undefined,
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                        <div style={{
                            display: 'flex', alignSelf: 'flex-start', padding: '10px 22px', borderRadius: 999,
                            background: 'rgba(255,255,255,0.10)', border: '2px solid rgba(255,255,255,0.22)',
                            color: CYAN, fontSize: 26, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase',
                        }}>
                            {clip(preview.eyebrow, 40)}
                        </div>
                        <div style={{ display: 'flex', fontSize: titleSize(title, side), fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5 }}>
                            {title}
                        </div>
                        {description && (
                            <div style={{ display: 'flex', fontSize: 32, fontWeight: 600, lineHeight: 1.35, color: 'rgba(255,255,255,0.86)' }}>
                                {description}
                            </div>
                        )}
                    </div>

                    {/* marca e nome do quiz numa linha só: o nome comprido termina em "…" */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: '100%' }}>
                        {icon && <img src={icon} width={60} height={60} style={{ borderRadius: 16, flexShrink: 0 }} alt="" />}
                        <div style={{ display: 'flex', flexShrink: 0, fontSize: 32, fontWeight: 800 }}>QuestioFlux</div>
                        <div style={{
                            display: 'block', flex: 1, minWidth: 0, fontSize: 28, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                            {`· ${quiz.title.trim()}`}
                        </div>
                    </div>
                </div>

                {ring && (
                    <div style={{ display: 'flex', position: 'relative', width: 400, height: 400, alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="400" height="400" viewBox="0 0 400 400" style={{ position: 'absolute', top: 0, left: 0 }}>
                            <circle cx="200" cy="200" r={radius} stroke="rgba(255,255,255,0.16)" strokeWidth="34" fill="none" />
                            {filled > 0 && (
                                <circle cx="200" cy="200" r={radius} stroke={CYAN} strokeWidth="34" fill="none" strokeLinecap="round"
                                    strokeDasharray={`${filled} ${circumference}`} transform="rotate(-90 200 200)" />
                            )}
                        </svg>
                        <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, letterSpacing: -4 }}>{`${preview.percent}%`}</div>
                    </div>
                )}

                {!ring && picture && (
                    <img src={picture} width={400} height={400} alt="" style={{
                        borderRadius: 36, objectFit: 'cover', border: '6px solid rgba(255,255,255,0.18)',
                    }} />
                )}
            </div>
        ),
        {
            ...RESULT_PREVIEW_SIZE,
            fonts,
            headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' },
        },
    )
}
