import React from 'react'
import '@/assets/styles/auth.scss'
import { Metadata } from 'next'
import RegisterFormComponent from '@/components/AuthForms/Auth-client-components/register-form-component'
import { getTranslations } from 'next-intl/server';

interface IProps{
    params: Promise<{
        locale:string
    }>
}

// 1. Atualizar generateMetadata para buscar o título traduzido
export async function generateMetadata({params}:IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'registerPage' });
    return {
        title: t('metadataTitle')
    }
}

// 2. A página agora é 'async' e recebe o 'locale'
export default async function Register({params}:IProps) {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'registerPage' });

    return (
        <div className={`container-section`}>
            <section className='register-section'>
                <div className='title-register'>
                    {/* 4. Usar t.rich para renderizar o título com negrito */}
                    <h1>
                        {t.rich('title', {
                            bold: (chunks) => <strong>{chunks}</strong>
                        })}
                    </h1>
                </div>

                <RegisterFormComponent 
                    absolute={false}
                    // Não precisamos passar a prop 'toLogin' aqui,
                    // pois com 'absolute={false}', o componente já renderiza
                    // um <Link> para a página de login.
                />
            </section>
        </div>
    )
}