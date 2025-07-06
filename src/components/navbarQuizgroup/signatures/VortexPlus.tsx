'use client'; // 1. Definir como Client Component

import { useTranslations, useLocale } from 'next-intl'; // 2. Importar os hooks corretos
import CorrectIconSvg from '../../Icons/CorrectIconSvg'
import styles from './VortexPlus.module.scss'

// 3. A assinatura do componente é simplificada (não precisa de props)
const VortexPlus = () => {
    // 4. Usar os hooks para obter a função de tradução e o locale atual
    const t = useTranslations('vortexPlus');
    const locale = useLocale();

    return (
        <div className={styles.vortexplus_container}>
            <h3>{t('subscription.title')}</h3>
            <ul className={styles.itens}>
                <li><p>{t('sharedFeatures.feature1')}</p> <span><CorrectIconSvg/></span></li>
                <li><p>{t('sharedFeatures.feature2')}</p> <span><CorrectIconSvg/></span></li>
                <li><p>{t('sharedFeatures.feature3')}</p> <span><CorrectIconSvg/></span></li>
                <li><p>{t('sharedFeatures.feature4')}</p> <span><CorrectIconSvg/></span></li>
            </ul>
            <div className={styles.price}>
                <span>{t('subscription.price')}</span>
                
                {/* 5. Usar o locale do hook para construir a URL */}
                <a 
                    href={`/${locale}/subscription/vortexplus` }
                    target='_blank'
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    {t('subscription.ctaButton')}
                </a>
            </div>
        </div>
    )
}

export default VortexPlus