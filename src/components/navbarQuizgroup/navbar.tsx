import { headers } from 'next/headers'
import styles from './navbar.module.scss'
import { userAgent } from 'next/server'
import Link from 'next/link'
import QuizIcon from '../Icons/QuizIcon'

export default function NavbarQuizgroup() {
    const {device} = userAgent({headers:headers()}),
        isMobile = device.type === 'mobile'

    const isAuth = false

    return (
        <nav className={styles.navbar}>
            <ul className={styles.menus}>
                {isMobile && (<>
                    {!isAuth && <li>
                        <Link href='/'>
                            <QuizIcon/>
                        </Link>
                    </li>}
                    {isAuth && (
                        {/* <li className={styles.menu_button_container}>
                            <span onClick={() => setMenuOpen(!menuOpen)}>
                                {menuOpen ? <CloseSvg color={'white'} /> : <MenuSvg id={styles.menu} themeColor={colorReverse} />}
                            </span>
                            {menuOpen && <Menu auth={isAuth} user={user} />}
                        </li> */}
                    )}
                </>)}
                {!isMobile && (<>
                    <li>
                        <Link href={isAuth ? '/home': '/'}>
                            <QuizIcon/>
                        </Link>
                    </li>
                    {isAuth && (
                        {/* <li className={styles.menu_button_container}>
                            <span onClick={() => setMenuOpen(!menuOpen)}>
                                {menuOpen ? <CloseSvg color={'white'} /> : <MenuSvg id={styles.menu} themeColor={colorReverse} />}
                            </span>
                            {menuOpen && <Menu auth={isAuth} user={user} />}
                        </li> */}
                    )}
                </>)}
            </ul>
            <ul className={styles.actions}>
                {/* input de pesquisa || clientComponent */}
                {isAuth ? (
                    <>
                        {!isMobile && <> 
                            <li>
                                <Link href='/create/quiz' className={`${styles.button} ${styles.first_button}`}>Create Quiz</Link>
                            </li>
                            <li>
                                <Link href='/profile/config'>
                                    <span className={styles.profile_image_span}>
                                        {/* {user
                                            ? (user?.profileImg && user.profileImg !== 'default' && imageExist
                                                ? <img src={user.profileImg} alt="Foto de perfil" onError={() => setImageExist(false)} />
                                                : <DefaultProfileImg />)
                                            : <DefaultProfileImg />
                                        } */}
                                    </span>
                                </Link>
                            </li>
                            {/* <li>
                                <button className={`${styles.second_button}`} onClick={handleLeave}>Leave</button>
                            </li> */}
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
                        {/* <li id={styles.config_container}>
                            <span onClick={() => setConfigOpen(!configOpen)}>
                                {configOpen ? <CloseSvg color={colorReverse} /> : <ConfigSvg themeColor={colorReverse} />}
                            </span>
                            {configOpen && <Menu auth={isAuth} />}
                        </li> */}
                    </>
                )}
            </ul>
        </nav> 
    )
}