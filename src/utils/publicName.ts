// Mesma regra do backend: o nome público não pode ter formato de e-mail (o backend recusa).
// Formato de e-mail, não qualquer "@": "ana@maria" continua valendo como apelido.
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const looksLikeEmail = (value: string) => EMAIL_FORMAT.test(value.trim())
