'use client'; // 1. Definir como Client Component

import { useTranslations, useLocale } from 'next-intl'; // 2. Importar os hooks
import styles from './VortexPlus.module.scss'
import CorrectIconSvg from '../../Icons/CorrectIconSvg'

// 3. Assinatura simplificada
const VortexPlusUniqueUse = () => {
    // 4. Usar os hooks
    const t = useTranslations('vortexPlus');
    const locale = useLocale();

    return (
        <div className={styles.vortexplus_container}>
            <h3>{t('singleUse.title')}</h3>
            <ul className={styles.itens}>
                <li><p>{t('sharedFeatures.feature1')}</p> <span><CorrectIconSvg/></span></li>
                <li><p>{t('sharedFeatures.feature2')}</p> <span><CorrectIconSvg/></span></li>
                <li><p>{t('sharedFeatures.feature3')}</p> <span><CorrectIconSvg/></span></li>
                <li><p>{t('sharedFeatures.feature4')}</p> <span><CorrectIconSvg/></span></li>
            </ul>
            <div className={styles.price}>
                <span>{t('singleUse.price')}</span>

                {/* 5. Usar o locale do hook para construir a URL */}
                <a 
                    href={`/${locale}/subscription/vortexplususage` }
                    target='_blank'
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    {t('singleUse.ctaButton')}
                </a>
            </div>
        </div>
    )
}

export default VortexPlusUniqueUse