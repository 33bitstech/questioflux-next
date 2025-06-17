import CorrectIconSvg from '../../Icons/CorrectIconSvg'
import styles from './VortexPlus.module.scss'

const VortexPlus = () => {
    return (
        <div className={styles.vortexplus_container}>
            <h3>Improve your experience with VortexPlus</h3>
            <ul className={styles.itens}>
                <li><p> Image as alternatives for answers </p> <span><CorrectIconSvg/></span></li>
                <li><p> Ilustrative images for your questions </p> <span><CorrectIconSvg/></span></li>
                <li><p> Unlimited questions for your quiz </p> <span><CorrectIconSvg/></span></li>
                <li><p> Up to 15 alternatives for your questions </p> <span><CorrectIconSvg/></span></li>
            </ul>
            <div className={styles.price}>
                <span>$2,50/mo</span>
                
                <a 
                    href='/subscription/vortexplus' 
                    target='_blank'
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    Subscribe Now
                </a>
            </div>
        </div>
    )
}

export default VortexPlus