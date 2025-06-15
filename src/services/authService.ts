import ApiData from "@/utils/ApiData";

import { BodyInit } from "@/types/fetchTypes";

export async function register(body: BodyInit) {
    try {
        const resJson = await ApiData({
            body, method: 'POST', cache: {cache: "no-store"}, path:"user"
        })
        const res = await resJson.json()
        return res
    } catch (err) {
        
    }
}
export async function login(body: BodyInit) {
    try {
        const resJson = await ApiData({
            body, method: 'POST', cache: {cache: "no-store"}, path:"login"
        })
        const res = await resJson.json()
        return res
    } catch (err) {
        
    }
}