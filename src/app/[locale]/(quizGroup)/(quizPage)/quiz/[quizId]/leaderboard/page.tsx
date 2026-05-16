import { env } from '@/env';
import styles from './leaderboard.module.scss'
import LbUser from '@/components/Leaderboard/lb-user';
import ShareButton from '@/components/widgets/share-button';
import { TLeaderboard } from '@/types/leaderboardTypes';
import IQuizes from '@/interfaces/IQuizes';
import { IUser } from '@/interfaces/IUser';
import { getCookieHeader } from '@/utils/getCookieHeader'
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import GoogleAd from '@/components/Google/GoogleAd';
import { cookies } from 'next/headers';
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore';

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

/**
 * Determina se uma entrada da leaderboard é de um guest.
 *
 * Regras (em ordem de prioridade):
 * 1. Se a chave `isGuest` existir no objeto → usa seu valor booleano.
 * 2. Se a chave `isGuest` NÃO existir (sistema antigo) → verifica se o nome
 *    começa com "guest_". Caso sim, é um guest legado.
 */
function isGuestEntry(entry: IUserLeaderBoardScore): boolean {
    if ('isGuest' in entry) {
        return entry.isGuest === true;
    }
    // Compatibilidade com sistema antigo: sem a chave isGuest
    return entry.name.startsWith('guest_');
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { quizId, locale } = await params
    const t = await getTranslations({ locale, namespace: 'leaderboardPage.metadata' });
    const quiz = await getQuiz(quizId)

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}/leaderboard`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/quiz/${quizId}/leaderboard`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}/leaderboard`
    },
        names = {
            quiz_name: quiz?.title ?? ''
        }

    return {
        title: t('title', names),
        description: t('desc', names),
        robots: 'index, follow',
        keywords: "quiz, ranking, leaderboard, lb, users, answers",
        alternates: {
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}/leaderboard`,
            languages: langs
        },
        openGraph: {
            title: t('title', names),
            description: t('desc', names),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}/leaderboard`,
            siteName: 'QuestioFlux',
            images: quiz?.quizThumbnail ?? `${env.NEXT_PUBLIC_DOMAIN_FRONT}/trofeu.png`,
            type: 'website'
        },
        twitter: {
            title: t('title', names),
            description: t('desc', names),
            images: [quiz?.quizThumbnail ?? `${env.NEXT_PUBLIC_DOMAIN_FRONT}/trofeu.png`],
        }
    }
}

export async function getQuiz(quizId: string): Promise<IQuizes | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`, {
            method: 'GET',
        });
        const res = await response.json();
        return res.quiz;
    } catch (err: any) {
        console.log(err)
    }
}

export async function getLeaderboard(quizId: string): Promise<TLeaderboard | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/leaderboard/${quizId}`, {
            method: 'GET',
        });
        const res = await response.json();
        return res.scoreBoard;
    } catch (err: any) {
        console.log(err)
    }
}

export async function getUser(cookieHeader: string): Promise<IUser | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user`, {
            method: 'GET',
            headers: { 'cookie': cookieHeader },
        });
        const res = await response.json();
        return res.user;
    } catch (err) {
        console.log(err)
    }
}

export default async function Leaderboard({ params }: IProps) {
    const { quizId, locale } = await params
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll()),
        t = await getTranslations({ locale, namespace: 'leaderboardPage' }),

        [quizLb, quiz, user] = await Promise.all([
            getLeaderboard(quizId),
            getQuiz(quizId),
            getUser(cookieHeader)
        ])

    // ── Separação guests / usuários registrados ──────────────────────────────
    const registeredLb = quizLb?.filter(entry => !isGuestEntry(entry)) ?? [];
    const guestLb      = quizLb?.filter(entry =>  isGuestEntry(entry)) ?? [];

    // ── Posição do usuário logado em cada lista ───────────────────────────────
    const userInRegistered = registeredLb.find(lbUser => lbUser.userId === user?.userId);
    const userPositionReg  = userInRegistered ? registeredLb.indexOf(userInRegistered) : 999;

    // Guests nunca estão "logados", mas mantemos a busca para o fallback abaixo
    const userInGuests    = guestLb.find(lbUser => lbUser.userId === user?.userId);
    const userPositionGst = userInGuests ? guestLb.indexOf(userInGuests) : 999;

    // ── Permissão para ver tentativas ─────────────────────────────────────────
    // O usuário pode ver tentativas de uma entrada se:
    //   • a entrada pertence a ele mesmo  OU
    //   • ele é o dono do quiz
    const isQuizOwner = !!user && !!quiz && user.userId === quiz.userCreatorId;

    const leaderboardSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": t('metadata.schemaName', { quiz_name: quiz?.title ?? '' }),
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "itemListElement": quizLb?.map((player, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Person",
                "name": player.name,
                "url": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/user/${player.userId}`
            }
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(leaderboardSchema) }}
            />

            {!quizLb && (
                <p>{t('noResults')}</p>
            )}

            {/* ── Leaderboard de usuários registrados ── */}
            {registeredLb.length > 0 && (
                <section className={styles.lb_section}>
                    <h2 className={styles.lb_section_title}>
                        {t('sections.registered')}
                    </h2>

                    <div className={styles.leaderboard_container}>
                        {quiz && registeredLb.slice(0, 10).map((userLb, index) => (
                            <div className={styles.user_results} key={index}>
                                <LbUser
                                    locale={locale}
                                    index={index}
                                    styles={styles}
                                    userLb={userLb}
                                    quiz={quiz}
                                    quizLb={registeredLb}
                                    // true se é o próprio usuário OU se é o dono do quiz
                                    canSeeAttempts={isQuizOwner || userLb.userId === user?.userId}
                                />
                            </div>
                        ))}

                        {/* Entrada do usuário logado fora do top-10 */}
                        {quiz && userInRegistered && userPositionReg >= 10 && (
                            <div className={styles.user_results}>
                                <LbUser
                                    locale={locale}
                                    index={userPositionReg}
                                    styles={styles}
                                    userLb={userInRegistered}
                                    quiz={quiz}
                                    quizLb={registeredLb}
                                    canSeeAttempts={true} // sempre pode ver as próprias
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── Leaderboard de guests ── */}
            {guestLb.length > 0 && (
                <section className={styles.lb_section}>
                    <h2 className={styles.lb_section_title}>
                        {t('sections.guests')}
                    </h2>

                    <div className={`${styles.leaderboard_container} ${styles.leaderboard_container__guest}`}>
                        {quiz && guestLb.slice(0, 10).map((userLb, index) => (
                            <div className={styles.user_results} key={index}>
                                <LbUser
                                    locale={locale}
                                    index={index}
                                    styles={styles}
                                    userLb={userLb}
                                    quiz={quiz}
                                    quizLb={guestLb}
                                    // Guests nunca são o "usuário logado",
                                    // mas o dono do quiz pode ver tudo
                                    canSeeAttempts={isQuizOwner}
                                />
                            </div>
                        ))}

                        {/* Edge case: guest fora do top-10 que também está logado */}
                        {quiz && userInGuests && userPositionGst >= 10 && (
                            <div className={styles.user_results}>
                                <LbUser
                                    locale={locale}
                                    index={userPositionGst}
                                    styles={styles}
                                    userLb={userInGuests}
                                    quiz={quiz}
                                    quizLb={guestLb}
                                    canSeeAttempts={isQuizOwner || userInGuests.userId === user?.userId}
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            <ShareButton quizId={quizId} styles={styles} />

            <GoogleAd slot='6282931841' />
        </>
    )
}