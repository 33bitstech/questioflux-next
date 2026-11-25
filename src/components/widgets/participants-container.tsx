import React from 'react'
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import CloseSvg from '../Icons/CloseSvg';
import styles from './participants-container.module.scss'
import UserProfileImgRender from '../ImagesRender/user-profile-img-render';
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore';

// Uma entrada da lista: do ranking (quizzes com nota) ou das conclusões gravadas (formatos
// sem ranking), que trazem o resultado obtido e o link para ele.
//  nameStatus: 'chosen' (apelido da partida), 'anonymous' (visitante sem nome),
//  'unrecorded' (registro antigo, de quando o nome não era gravado), 'account'
export interface IParticipantItem {
    participationId?: string
    userId?: string
    name?: string
    nameStatus?: 'account' | 'chosen' | 'anonymous' | 'unrecorded'
    profileImg?: string
    isGuest?: boolean
    // personalidade: o perfil (mais de um quando foi combinado)
    results?: Array<{ resultId: string, title: string }>
    // resumo do resultado nos outros formatos (faixa, campeão, final...)
    summary?: string
}

interface IProps {
    quizId: string,
    users: IParticipantItem[],
    // quantas entradas podem ser listadas; o total inclui as ocultas e as antigas sem registro
    visible: number,
    total: number,
    hasMore: boolean,
    // a lista traz só parte das entradas visíveis (top 10 da trivia)
    partial?: boolean,
    loadingMore: boolean,
    onLoadMore: () => void,
    locale: string,
    closeParticipants: () => void
}

export default function ParticipantsContainer({ quizId, users, visible, total, hasMore, partial, loadingMore, onLoadMore, closeParticipants, locale }: IProps) {
    const t = useTranslations('quizInfoPage.participantsList')

    // visitante: o apelido da partida; sem apelido, anonimato ou registro antigo sem nome
    const guestLabel = (user: IParticipantItem) =>
        user.name || (user.nameStatus === 'unrecorded' ? t('unrecorded') : t('guest'))

    return (
        <div className={`${styles.container}`} role="dialog" aria-labelledby="participants-title">
            <button type="button" className={styles.close} onClick={closeParticipants} aria-label={t('close')}><CloseSvg/></button>
            <div className={styles.content}>
                {/* div, não header: o layout do site posiciona todo <header> como a barra do topo */}
                <div className={styles.header}>
                    <h2 id="participants-title">{t('title')} <span>{visible}</span></h2>
                    {(total > visible || partial) && <p>{t('note')}</p>}
                </div>

                {users.length === 0 && <p className={styles.empty}>{t('empty')}</p>}

                {users.map((user, index) => (
                    <div key={user.participationId ?? `${user.userId ?? 'guest'}-${index}`} className={styles.user}>
                        <div className={styles.profileImg}>
                            <UserProfileImgRender user={{ profileImg: user.profileImg ?? 'default' } as IUserLeaderBoardScore} />
                        </div>
                        <div className={styles.identity}>
                            {user.isGuest || !user.userId
                                ? <p className={user.name ? undefined : styles.unnamed}>{guestLabel(user)}</p>
                                : <Link locale={locale} href={`/user/${user.userId}`}>{user.name}</Link>}
                            {(!!user.results?.length || user.summary) && (
                                user.participationId
                                    ? <Link locale={locale} className={styles.result} href={`/quiz/${quizId}/result/${user.participationId}`} title={t('viewResult')}>
                                        {user.results?.length ? user.results.map(result => result.title).join(' + ') : user.summary}
                                    </Link>
                                    : <span className={styles.result}>{user.results?.length ? user.results.map(result => result.title).join(' + ') : user.summary}</span>
                            )}
                        </div>
                    </div>
                ))}

                {hasMore && (
                    <button type="button" className={styles.load_more} onClick={onLoadMore} disabled={loadingMore}>
                        {t('loadMore')}
                    </button>
                )}
            </div>
        </div>
    )
}
