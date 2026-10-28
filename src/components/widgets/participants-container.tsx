import React from 'react'
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import CloseSvg from '../Icons/CloseSvg';
import styles from './participants-container.module.scss'
import UserProfileImgRender from '../ImagesRender/user-profile-img-render';
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore';

// Uma entrada da lista: do ranking (quizzes com nota) ou das conclusões de um quiz de
// personalidade, que trazem o resultado obtido (mais de um quando foi combinado)
export interface IParticipantItem {
    userId?: string
    name?: string
    profileImg?: string
    isGuest?: boolean
    results?: Array<{ resultId: string, title: string }>
}

interface IProps {
    users: IParticipantItem[],
    // quantas entradas podem ser listadas; o total inclui as ocultas e as antigas sem registro
    visible: number,
    total: number,
    hasMore: boolean,
    loadingMore: boolean,
    onLoadMore: () => void,
    locale: string,
    closeParticipants: () => void
}

export default function ParticipantsContainer({ users, visible, total, hasMore, loadingMore, onLoadMore, closeParticipants, locale }: IProps) {
    const t = useTranslations('quizInfoPage.participantsList')

    return (
        <div className={`${styles.container}`} role="dialog" aria-labelledby="participants-title">
            <button type="button" className={styles.close} onClick={closeParticipants} aria-label={t('close')}><CloseSvg/></button>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h2 id="participants-title">{t('title')} <span>{visible}</span></h2>
                    {total > visible && <p>{t('note')}</p>}
                </header>

                {users.length === 0 && <p className={styles.empty}>{t('empty')}</p>}

                {users.map((user, index) => (
                    <div key={`${user.userId ?? 'guest'}-${index}`} className={styles.user}>
                        <div className={styles.profileImg}>
                            <UserProfileImgRender user={{ profileImg: user.profileImg ?? 'default' } as IUserLeaderBoardScore} />
                        </div>
                        <div className={styles.identity}>
                            {user.isGuest || !user.userId
                                ? <p>{user.name || t('guest')}</p>
                                : <Link locale={locale} href={`/user/${user.userId}`}>{user.name}</Link>}
                            {!!user.results?.length && (
                                <span className={styles.result}>{user.results.map(result => result.title).join(' + ')}</span>
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
