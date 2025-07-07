import LoadingComp from '@/components/Loading/loading-component'
import styles from './loading.module.scss'
import './globals.scss'

const Loading = () => {
    return (
        <div className={styles.container_loading}>
            <LoadingComp />
        </div>
    )
}

export default Loading