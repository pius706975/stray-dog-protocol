import { AxiosError } from 'axios';
import {
    useMutation,
    UseMutationOptions,
    UseMutationResult,
} from 'react-query';
import { useDispatch } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootParamList } from '../types';
import { networkErrorSlice } from '../slices';

const useErrorHandler = () => {
    const navigation = useNavigation<NavigationProp<RootParamList>>();
    const dispatch = useDispatch();

    const { setIsNetworkError } = networkErrorSlice.actions;
    return (error: AxiosError) => {
        if (!error?.request) {
            dispatch(setIsNetworkError(true));
            navigation.navigate('NetworkErrorScreen');
        }
    };
};

const useMutationWithErrorHandler = <
    TData,
    TError extends AxiosError,
    TVariables,
>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: UseMutationOptions<TData, TError, TVariables>,
): UseMutationResult<TData, TError, TVariables> => {
    const handleError = useErrorHandler();

    return useMutation<TData, TError, TVariables>(mutationFn, {
        ...options,
        onError: (error: TError, variables: TVariables, context: unknown) => {
            handleError(error);
            if (options?.onError) {
                options.onError(error, variables, context);
            }
        },
    });
};

export default useMutationWithErrorHandler;
