'use client'; 

import { useTranslations, useLocale } from 'next-intl'; 
import CorrectIconSvg from '../../Icons/CorrectIconSvg'
import styles from './VortexPlus.module.scss'
import PlanPrice from '@/components/Pricing/plan-price'

const VortexPlus = () => {
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
                <PlanPrice plan='plus' />
                
                <a 
                    href={`/${locale}/subscription/questioplus` }
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