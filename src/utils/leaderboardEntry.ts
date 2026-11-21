import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'

// Entradas antigas sem a marca isGuest: o visitante tem o nome gravado com "guest_" na frente.
// Fica fora de leaderboardData (que busca na API) para os componentes do navegador usarem.
export const isGuestEntry = (entry: Pick<IUserLeaderBoardScore, 'isGuest' | 'name'>): boolean =>
    'isGuest' in entry && typeof entry.isGuest === 'boolean'
        ? entry.isGuest
        : typeof entry.name === 'string' && entry.name.startsWith('guest_')
