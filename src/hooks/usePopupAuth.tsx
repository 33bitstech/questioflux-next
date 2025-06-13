import { useState } from 'react';

// (Opcional, mas recomendado) Definir uma interface para o valor de retorno do hook
interface UsePopupAuthReturn {
    registering: boolean;
    toLogin: () => void;
    toRegister: () => void;
}

const usePopupAuth = (): UsePopupAuthReturn => {
    const [registering, setRegistering] = useState<boolean>(true);
    
    const toLogin = (): void => {
        setRegistering(false);
    };
    
    const toRegister = (): void => {
        setRegistering(true);
    };

    return { toLogin, toRegister, registering };
};

export default usePopupAuth;