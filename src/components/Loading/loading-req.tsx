import LoadingComp from './loading-component'
import styles from './loading-req.module.scss'

export default function LoadingReq({loading}:{loading:boolean}) {
    return (
        <>
            {loading && <>
                <div className={styles.container}>
                    <LoadingComp/>
                </div>
                <div className={styles.overlay_loading}/>
            </>}
        </>
    )
}
