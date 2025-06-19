import Link from 'next/link'
import React from 'react'
import styles from './contextual-header-action.module.scss'
import ToggleFilterContainer from './filtersWidgets/toggle-filter-container'

interface IProps {
    page: string
}

export default function ContextualHeaderActions({page} : IProps) {
    return (
        <div className={`${styles.nav_actions}`}>
            <Link href={'/create/quiz'}>Create Quiz</Link>

            {page === 'home' && (
                <Link href={'/explore'}>Explore Quizzes</Link>
            )}
            {page === 'explore' && (
                <ToggleFilterContainer styles={styles}/>
            )}
            {/* <>
                <div className={`${styles.filter_button} ${filterClicked ? styles.active : ''}`} onClick={handleFilterClick}>
                    <p>Filters</p>
                    <ArrowSvg color={reverseColor}/>
                </div>
                <div className={styles.filter_popup_container}>
                    {filterClicked && <Filters classTheme={classTheme} setFilterClicked={handleFilterClick}/>}
                </div>
            </> */}
            {/* {page === 'quiz' && isAuth && (
                <Link to={'/home'}>Home</Link>
            )}
            {page === 'quiz' && !isAuth && (
                <Link to={'/explore'}>Explore</Link>
            )}
            {filterClicked && <div className={styles.overlay_filter} onClick={()=>setFilterClicked(false)}></div>} */}
        </div>
    )
}
