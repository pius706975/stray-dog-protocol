import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainOwnerStackParamList } from '../../../../types';
import { QueryClient, QueryClientProvider } from 'react-query';
import MockAdapter from 'axios-mock-adapter';
import httpRequest from '../../../../services/api';
import store from '../../../../store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { DocumentForm } from '../addShip';
import { useGetAddShipDynamicForm } from '../../../../hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { setMockDocumentPickerResolve } from '../../../../jest/setup';

jest.mock('../../../../hooks');
const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();
const queryClient = new QueryClient();
const mockAdapter = new MockAdapter(httpRequest);

const ownerStackMockComponent = (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <NavigationContainer>
                <MainOwnerStack.Navigator>
                    <MainOwnerStack.Screen
                        name="DocumentForm"
                        component={DocumentForm}
                    />
                </MainOwnerStack.Navigator>
            </NavigationContainer>
        </Provider>
    </QueryClientProvider>
);

const mockDynamicData = {
    dynamicForms: [
        {
            _id: '65a737c476517457909c4d6f',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d9a',
                active: true,
                docExpired: false,
                fieldName: 'certificateOfRegister',
                fieldType: 'document',
                formType: 'addShipForm',
                inputType: 'docSelect',
                label: 'Certificate of Register',
                order: 1,
                templateType: 'shipDoc',
            },
            option: [],
            required: true,
        },
        {
            _id: '65a737c476517457909c4d70',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d9b',
                active: true,
                docExpired: false,
                fieldName: 'seaworthyCertificate',
                fieldType: 'document',
                formType: 'addShipForm',
                inputType: 'docSelect',
                label: 'Seaworthy Certificate',
                order: 2,
                templateType: 'shipDoc',
            },
            option: [],
            required: true,
        },
        {
            _id: '65a737c476517457909c4d71',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d9c',
                active: true,
                docExpired: false,
                fieldName: 'safetyCertificate',
                fieldType: 'document',
                formType: 'addShipForm',
                inputType: 'docSelect',
                label: 'Safety Certificate',
                order: 3,
                templateType: 'shipDoc',
            },
            option: [],
            required: true,
        },
        {
            _id: '65a737c476517457909c4d72',
            dynamicInput: {
                __v: 0,
                _id: '65a737c476517457909c4d9d',
                active: true,
                docExpired: false,
                fieldName: 'derattingCertificate',
                fieldType: 'document',
                formType: 'addShipForm',
                inputType: 'docSelect',
                label: 'Deratting Certificate',
                order: 4,
                templateType: 'shipDoc',
            },
            option: [],
            required: true,
        },
    ],
};

beforeEach(() => {
    mockAdapter.onGet('/admin/get-dynamic-input').reply(200, {
        message: 'success',
        data: mockDynamicData,
    });
    (useGetAddShipDynamicForm as jest.Mock).mockImplementation(() => ({
        mutate: jest.fn().mockImplementation((data, options) => {
            const { onSuccess } = options;
            const mockResponseData = {
                data: {
                    data: mockDynamicData,
                },
            };
            onSuccess(mockResponseData);
        }),
    }));
});

describe('add ship document screen', () => {
    describe('Snapshot testing', () => {
        it('should render add ship document screen correctly', () => {
            const documentScreen = render(ownerStackMockComponent);
            expect(documentScreen).toMatchSnapshot();
        });
    });
    describe('Unit Testing', () => {
        it('should submit document ', async () => {
            const { getByTestId } = render(ownerStackMockComponent);
            const doc1 = getByTestId('doc-certificateOfRegister');
            const doc2 = getByTestId('doc-seaworthyCertificate');
            const doc3 = getByTestId('doc-safetyCertificate');
            const doc4 = getByTestId('doc-derattingCertificate');
            const btnSubmit = getByTestId('dynamic-button');
            act(() => {
                fireEvent.press(doc1);
                fireEvent.press(doc2);
                fireEvent.press(doc3);
                fireEvent.press(doc4);
            });

            setMockDocumentPickerResolve(true);
            fireEvent.press(btnSubmit);
            await waitFor(() => {
                const docState = store.getState().addShip;
                expect(docState).toEqual({
                    name: '',
                    desc: '',
                    category: '',
                    pricePerMonth: '',
                    length: '',
                    width: '',
                    height: '',
                    facilities: [],
                    specifications: [
                        {
                            name: '',
                            value: '',
                        },
                    ],
                    shipDocument: [
                        {
                            docExpired: undefined,
                            label: 'certificateOfRegister',
                            name: 'dummy.pdf',
                            uri: 'dummy.pdf',
                        },
                        {
                            docExpired: undefined,
                            label: 'seaworthyCertificate',
                            name: 'dummy.pdf',
                            uri: 'dummy.pdf',
                        },
                        {
                            docExpired: undefined,
                            label: 'safetyCertificate',
                            name: 'dummy.pdf',
                            uri: 'dummy.pdf',
                        },
                        {
                            docExpired: undefined,
                            label: 'derattingCertificate',
                            name: 'dummy.pdf',
                            uri: 'dummy.pdf',
                        },
                    ],
                });
            });
        });
    });
});
