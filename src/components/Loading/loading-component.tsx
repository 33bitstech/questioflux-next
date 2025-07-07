import styles from './loading-component.module.scss'
import QuizIcon from '../Icons/QuizIcon'

const LoadingComp = () => {
    return (
        <div className={styles.Loading}>
            <QuizIcon />
            <div className={`${styles.loading_bar}`}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    )
}

export default LoadingComp