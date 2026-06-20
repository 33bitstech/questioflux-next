import { z } from 'zod'

const clientSchema = z.object({
    NEXT_PUBLIC_DOMAIN_API: z.string().url(),
    NEXT_PUBLIC_DOMAIN_FRONT: z.string().url(),
    NEXT_PUBLIC_ADSENSE_CLIENT: z.string(),
})

const serverSchema = z.object({
    ENV_PAGBANK: z.string(),
    OWN_API_KEY: z.string(),
})

const processEnv = {
    NEXT_PUBLIC_DOMAIN_API: process.env.NEXT_PUBLIC_DOMAIN_API,
    NEXT_PUBLIC_DOMAIN_FRONT: process.env.NEXT_PUBLIC_DOMAIN_FRONT,
    NEXT_PUBLIC_ADSENSE_CLIENT: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
    ...(typeof window === 'undefined' ? {
        ENV_PAGBANK: process.env.ENV_PAGBANK,
        OWN_API_KEY: process.env.OWN_API_KEY,
    } : {})
}

const isServer = typeof window === 'undefined'

const parsedEnv = isServer
    ? clientSchema.merge(serverSchema).safeParse(processEnv)
    : clientSchema.safeParse(processEnv)

if (!parsedEnv.success) {
    console.error(
        "Variáveis de ambiente inválidas",
        parsedEnv.error.flatten().fieldErrors
    )
    throw new Error("Variáveis de ambiente inválidas")
}

export const env = parsedEnv.data as z.infer<typeof clientSchema> & z.infer<typeof serverSchema>