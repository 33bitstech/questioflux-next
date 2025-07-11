import {z} from 'zod'

const envSchema = z.object({
    NEXT_PUBLIC_DOMAIN_API: z.string().url(),
    NEXT_PUBLIC_DOMAIN_FRONT: z.string().url(),
    NEXT_PUBLIC_ADSENSE_CLIENT: z.string(),
    ENV_PAGBANK: z.string(),
    OWN_API_KEY: z.string(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
    console.error(
        "Variaveis de ambiente invalidas", 
        parsedEnv.error.flatten().fieldErrors
    )
    throw new Error("Variaveis de ambiente invalidas")
}

export const env = parsedEnv.data