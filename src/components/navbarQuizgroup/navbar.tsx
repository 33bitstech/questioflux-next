import { headers } from 'next/headers'
import styles from './navbar.module.scss'
import { userAgent } from 'next/server'
import { Link } from '@/i18n/navigation'
import QuizIcon from '../Icons/QuizIcon'
import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import ToggleMenuAsideContainer from './client/toggle-menu-aside-container'
import LogoutWidget from './client/logout-widget'
import ImgProfileConfig from './client/img-profile-config'
import SearchQuiz from './client/search-quiz'
import { getTranslations } from 'next-intl/server' // Importar

interface IProps {
    locale: string;
}

// O componente do layout que renderiza a Navbar passará os params
export default async function NavbarQuizgroup({ locale }: IProps) {
    const t = await getTranslations({ locale, namespace: 'navbar' });

    const { device } = userAgent({ headers: await headers() });
    const isMobile = device.type === 'mobile';
    const token = await getCookie('token', { cookies });

    return (
        <nav className={styles.navbar}>
            <ul className={styles.menus}>
                {/* A lógica de renderização mobile/desktop permanece a mesma */}
                {isMobile && (<>
                    {!token && <li><Link href='/' locale={locale}><QuizIcon/></Link></li>}
                    {token && <ToggleMenuAsideContainer styles={styles} token={token} className='menu_button_container'/>}
                </>)}
                {!isMobile && (<>
                    <li><Link locale={locale} href={token ? '/home' : '/'}><QuizIcon/></Link></li>
                    {token && <ToggleMenuAsideContainer styles={styles} token={token} className='menu_button_container'/>}
                </>)}
            </ul>
            <ul className={styles.actions}>
                {token ? (
                    <>
                        {!isMobile && <>
                            {/* Assumindo que SearchQuiz receberá o placeholder como prop */}
                            <SearchQuiz styles={styles} placeholder={t('searchPlaceholder')} />
                            <li>
                                <Link locale={locale} href='/create/quiz' className={`${styles.button} ${styles.first_button}`}>{t('createQuiz')}</Link>
                            </li>
                            <li>
                                <Link locale={locale} href='/profile/config'><ImgProfileConfig styles={styles}/></Link>
                            </li>
                            <li>
                                {/* Assumindo que LogoutWidget receberá o texto como prop */}
                                <LogoutWidget styles={styles} text={t('logout')} />
                            </li>
                        </>}
                    </>
                ) : (
                    <>
                        <li>
                            <Link locale={locale} href='/register' className={`${styles.button} ${styles.first_button}`}>{t('createAccount')}</Link>
                        </li>
                        <li>
                            <Link locale={locale} href='/login' className={`${styles.second_button}`}>{t('login')}</Link>
                        </li>
                        <ToggleMenuAsideContainer styles={styles} className='config_container'/>
                    </>
                )}
            </ul>
        </nav> 
    )
}