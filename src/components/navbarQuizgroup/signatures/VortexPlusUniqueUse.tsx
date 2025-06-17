import styles from './VortexPlus.module.scss'
import CorrectIconSvg from '../../Icons/CorrectIconSvg'

const VortexPlusUniqueUse = () => {
    return (
        <div className={styles.vortexplus_container}>
            <h3>Buy this pass to get premium quiz creation usage</h3>
            <ul className={styles.itens}>
                <li><p> Image as alternatives for answers </p> <span><CorrectIconSvg/></span></li>
                <li><p> Ilustrative images for your questions </p> <span><CorrectIconSvg/></span></li>
                <li><p> Unlimited questions for your quiz </p> <span><CorrectIconSvg/></span></li>
                <li><p> Up to 15 alternatives for your questions </p> <span><CorrectIconSvg/></span></li>
            </ul>
            <div className={styles.price}>
                <span>$1,99/use</span>

                <a 
                    href='/subscription/vortexplususage' 
                    target='_blank'
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    Buy Now
                </a>
            </div>
        </div>
    )
}

export default VortexPlusUniqueUse