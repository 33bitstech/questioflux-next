import { useEffect, useState } from 'react';
import { setErrorGlobal, reset } from '../lib/slices/globalErrorsSlice';
import { useAppDispatch } from '@/lib/hooks';

// Define a interface para o estado dos erros
interface ErrorsState {
    [key: string]: string;
}

const useErrors = () => {
    const [inputsErrors, setInputErrors] = useState<ErrorsState>({});
    const dispatch = useAppDispatch();

    const setError = (type: string, message: string): void => {
        setInputErrors(value => ({ ...value, [type]: message }));
    };

    const getError = (type: string): string | undefined => {
        return inputsErrors[type];
    };

    const concatErrors = (errorsObject: ErrorsState): void => {
        setInputErrors(value => ({ ...value, ...errorsObject }));
    };

    const hasErrors = (errorsObject: ErrorsState): boolean => {
        return Object.values(errorsObject).some(value => value !== '');
    };

    const resetErrors = (): void => {
        setInputErrors({});
    };

    const dispatchGlobalError = (message: string): void => {
        dispatch(setErrorGlobal({ message }));
    };

    useEffect(() => {
        dispatch(reset());
    }, [dispatch]);

    return {
        setError,
        getError,
        concatErrors,
        inputsErrors,
        hasErrors,
        resetErrors,
        dispatchGlobalError,
    };
};

export default useErrors;