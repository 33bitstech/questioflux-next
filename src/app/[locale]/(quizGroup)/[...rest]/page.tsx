import { notFound } from 'next/navigation'

// Qualquer URL que não case com uma rota cai aqui e responde 404 com a página localizada.
export default function CatchAll() {
    notFound()
}
