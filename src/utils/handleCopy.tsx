import { env } from "@/env"

export const handleCopyUrl = async (text:string) => {
    const domain = 'https://www.questioflux.com'

    const link = `${domain}/${text}`
    const copy = await navigator.clipboard.writeText(link)
    return copy
}
