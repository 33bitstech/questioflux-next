'use client'
import { useState, useCallback } from 'react';

export interface ErrorsState {
    [key: string]: string;
}

const useErrors = () => {
    const [inputsErrors, setInputErrors] = useState<ErrorsState>({});

    const setError = useCallback((type: string, message: string): void => {
        setInputErrors(currentErrors => ({ ...currentErrors, [type]: message }));
    }, []);

    const getError = useCallback((type: string): string | undefined => {
        return inputsErrors[type];
    }, [inputsErrors]);

    const concatErrors = useCallback((errorsObject: ErrorsState): void => {
        setInputErrors(currentErrors => ({ ...currentErrors, ...errorsObject }));
    }, []);

    const hasErrors = useCallback((errorsObject: ErrorsState): boolean => {
        return Object.values(errorsObject).some(value => value !== '');
    }, []);

    const resetErrors = useCallback((): void => {
        setInputErrors({});
    }, []);

    return {
        setError,
        getError,
        concatErrors,
        inputsErrors,
        hasErrors,
        resetErrors,
    };
};

export default useErrors;