'use client'
import { ImagePlus, X } from 'lucide-react'
import styles from '../experiences.module.scss'
import { useImageDrop } from './use-image-drop'

interface IProps {
    // imagem mostrada: a nova escolhida (prévia local) ou a salva
    image?: string
    pickLabel: string
    removeLabel: string
    onPick: (file: File) => void
    onRemove: () => void
    disabled?: boolean
    // wide: a ilustração da cena, na largura do cartão; senão, o quadrado das alternativas
    wide?: boolean
    // texto do botão vazio na versão larga
    emptyText?: string
}

// Espaço de uma imagem no editor: clicar escolhe o arquivo, ou arraste a imagem para cima dele;
// o "x" no canto tira a imagem.
export default function ImageSlot({ image, pickLabel, removeLabel, onPick, onRemove, disabled, wide, emptyText }: IProps) {
    const { dragging, dropProps } = useImageDrop(onPick, disabled)

    return (
        <div className={`${styles.image_slot} ${wide ? styles.image_slot_wide : ''}`}>
            <label className={`${wide ? styles.scene_image_pick : styles.option_image} ${dragging ? styles.image_dragging : ''}`}
                title={pickLabel} {...dropProps}>
                {image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={image} alt="" />
                    : <>
                        <ImagePlus aria-hidden="true" />
                        {wide && emptyText && <span>{emptyText}</span>}
                    </>}
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    aria-label={pickLabel}
                    disabled={disabled}
                    onChange={event => {
                        const file = event.target.files?.[0]
                        if (file) onPick(file)
                        event.target.value = ''
                    }}
                />
            </label>
            {image && (
                <button type="button" className={styles.image_slot_remove} onClick={onRemove} disabled={disabled}
                    aria-label={removeLabel} title={removeLabel}>
                    <X aria-hidden="true" />
                </button>
            )}
        </div>
    )
}
