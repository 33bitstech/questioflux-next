import { headers } from 'next/headers'
import styles from './navbar.module.scss'
import { userAgent } from 'next/server'
import Link from 'next/link'
import QuizIcon from '../Icons/QuizIcon'
import {getCookie} from 'cookies-next/server'
import {cookies} from 'next/headers'
import ToggleMenuAsideContainer from './client/toggle-menu-aside-container'
import LogoutWidget from './client/logout-widget'
import ImgProfileConfig from './client/img-profile-config'
import SearchQuiz from './client/search-quiz'

export default async function NavbarQuizgroup() {
    const {device} = userAgent({headers: await headers()}),
        isMobile = device.type === 'mobile',

        token = await getCookie('token', {cookies})

    return (
        <nav className={styles.navbar}>
            <ul className={styles.menus}>
                {isMobile && (<>
                    {!token && <li>
                        <Link href='/'>
                            <QuizIcon/>
                        </Link>
                    </li>}
                    {token && (
                        <ToggleMenuAsideContainer styles={styles} token={token} className='menu_button_container'/>
                    )}
                </>)}
                {!isMobile && (<>
                    <li>
                        <Link href={token ? '/home': '/'}>
                            <QuizIcon/>
                        </Link>
                    </li>
                    {token && (
                        <ToggleMenuAsideContainer styles={styles} token={token} className='menu_button_container'/>
                    )}
                </>)}
            </ul>
            <ul className={styles.actions}>
                {token ? (
                    <>
                        {!isMobile && <> 
                            <SearchQuiz styles={styles} />
                            <li>
                                <Link href='/create/quiz' className={`${styles.button} ${styles.first_button}`}>Create Quiz</Link>
                            </li>
                            <li>
                                <Link href='/profile/config'>
                                    <ImgProfileConfig styles={styles}/>
                                </Link>
                            </li>
                            <li>
                                <LogoutWidget styles={styles}/>
                            </li>
                        </>}
                    </>
                ) : (
                    <>
                        <li>
                            <Link href='/register' className={`${styles.button} ${styles.first_button}`}>Create Account</Link>
                        </li>
                        <li>
                            <Link href='/login' className={`${styles.second_button}`}>Login</Link>
                        </li>
                        <ToggleMenuAsideContainer styles={styles} className='config_container'/>
                    </>
                )}
            </ul>
        </nav> 
    )
}