import { env } from "@/env";
import { HeaderType, BodyInit, Methods, Cache} from "@/types/fetchTypes";

interface IApiDataParams {
    path: string;
    method: Methods;
    body?: BodyInit;
    headerKey?: HeaderType | HeaderType[];
    headerValue?: string | string[];
    cache: Cache;
}

export default async function ApiData({
    path, body, cache, 
    method, headerKey, headerValue
} : IApiDataParams) {
    const baseUrl = `${env.NEXT_PUBLIC_DOMAIN_API}/${path}`;
    const headers = new Headers();
    const isFormData = body instanceof FormData;
    
    let includeCredentials = false;
    
    if (headerKey && headerValue) {
        if (Array.isArray(headerKey) && Array.isArray(headerValue)) {
            headerKey.forEach((key, idx) => {
                const keyStr = String(key);
                
                if (keyStr.toLowerCase() === 'cookie') {
                    includeCredentials = true;
                }

                if (!(isFormData && keyStr.toLowerCase() === 'content-type')) {
                    headers.append(keyStr, headerValue[idx]);
                }
            });
        } else if (typeof headerKey === 'string' && typeof headerValue === 'string') {
            if (headerKey.toLowerCase() === 'cookie') {
                includeCredentials = true;
            }

            if (!(isFormData && headerKey.toLowerCase() === 'content-type')) {
                headers.append(headerKey, headerValue);
            }
        }
    }

    const config: RequestInit = {
        body, 
        method, 
        ...cache, 
        headers
    };
    
    if (includeCredentials) {
        config.credentials = 'include';
    }
    console.log(baseUrl, config)
    
    return await fetch(baseUrl, config);
}