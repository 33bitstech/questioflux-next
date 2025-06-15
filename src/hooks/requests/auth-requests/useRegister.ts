'use client'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { BodyInit } from '@/types/fetchTypes'

const useRegister = async() =>{
    const {setError} = useGlobalMessage()

    async function register(body: BodyInit) {
        try {
            const resJson = await fetch('/api/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body, 
            })
            const res = await resJson.json()

            if(!resJson.ok) throw { response: { data: res } }

            return res
        } catch (err:any) {
            const {type} = err.response.data
            if (type == 'global') return setError(err.response.data.message)
                
            throw err.response.data
        } 
    }
    return {register}
    
}

export default useRegister