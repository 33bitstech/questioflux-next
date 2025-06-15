import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData'; // Seguro importar aqui

export async function POST(request: Request) {
    try {
        // 1. Pegamos o corpo da requisição (email, senha) que veio do useLogin.
        const body = await request.json();
        
        // 2. Usamos o ApiData para fazer a chamada para a API EXTERNA.
        //    É aqui que você pode usar suas chaves de ambiente do servidor.
        const externalApiResponse = await ApiData({
            path: 'login', // O caminho para o endpoint da API externa
            method: 'POST',
            body: JSON.stringify(body), // Enviamos o corpo para a API externa
            headerKey: 'Content-Type',
            headerValue: 'application/json',
            // Exemplo: Se sua API externa precisasse da sua chave secreta, seria aqui:
            // headerKey: 'X-API-KEY',
            // headerValue: env.OWN_API_KEY,
            cache: { cache: 'no-store' },
        });

        // 3. Pegamos a resposta da API externa para analisá-la.
        const responseData = await externalApiResponse.json();

        // 4. Se a API externa retornou um erro (ex: senha errada),
        //    repassamos esse erro para o nosso cliente (o hook useLogin).

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        
        // 5. Se tudo deu certo, repassamos a resposta de sucesso para o cliente.
        //    (Poderíamos adicionar o cookie de autenticação aqui também, se desejado)
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/login] Erro inesperado:', error);
        // Em caso de um erro inesperado, retornamos uma resposta de erro genérica.
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}