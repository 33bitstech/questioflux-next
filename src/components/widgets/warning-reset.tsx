import styles from './warning-reset.module.scss'

interface IProps {
    title: string,
    description: string
    confirmFunction: ()=>void
    cancelFunction: ()=>void
    cancelValue: string
    confirmValue: string
}

const WarningReset = ({title, description, cancelValue, confirmValue, confirmFunction, cancelFunction}: IProps) => {
    return (
        <div className={`${styles.container}`}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className={styles.actions}>
                <button onClick={cancelFunction}>{cancelValue}</button>
                <button onClick={confirmFunction}>{confirmValue}</button>
            </div>
        </div>
    )
}

export default WarningReset