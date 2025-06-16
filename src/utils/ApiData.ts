import { env } from "@/env";

import { HeaderType, BodyInit, Methods, Cache} from "@/types/fetchTypes";

interface IApiDataParams {
    path: string,
    method: Methods,
    body?: BodyInit,
    headerKey?: HeaderType,
    headerValue?: string,
    cache: Cache
}
export default async function ApiData({
    path, body, cache, 
    method, headerKey, headerValue
} : IApiDataParams) {
    const baseUrl = `${env.NEXT_PUBLIC_DOMAIN_API}/${path}`,
        headers = new Headers(),
        isFormData = body instanceof FormData;
    
    if (headerKey && headerValue) 
        if (!(isFormData && headerKey.toLowerCase() === 'content-type')) 
            headers.append(headerKey, headerValue)

    const config = {
        body, method, ...cache, headers
    }    
    
    return await fetch(baseUrl, config)
}
