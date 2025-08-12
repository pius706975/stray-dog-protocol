import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
    MainScreenTabNav,
    RequestForQuoteStackNav,
    TransactionStatusTabNav,
} from '.';
import { Color, FontFamily } from '../configs';
import {
    AboutUs,
    ChangeLanguage,
    Company,
    CompanyRegister,
    ContractDetail,
    ContractPreview,
    DetailShip,
    EditProfile,
    Payment,
    PaymetReceiptPreview,
    ProposalDetail,
    ProposalPreview,
    RemindedShips,
    RenterDocumentPreview,
    RequestDetail,
    SavedShips,
    Search,
    ShipAvailability,
    ShipByCategory,
    TrackTransactionsStat,
    TransactionDetail,
    VerifyEmail,
    VerifyPhone,
    Negotiate,
    PaymentHistory,
    DeleteAccount,
    AccountVerification,
    RenterShipTrackingDetail,
    ShipTrackingForm,
    AddReview,
} from '../screens';
import { MainStackParamList, RootState } from '../types';

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainScreenStack = () => {
    const { text } = useSelector((state: RootState) => state.documentName);
    const { t } = useTranslation('common');
    const screens: {
        name: keyof MainStackParamList;
        title: string;
        component: any;
    }[] = [
        {
            name: 'DetailShip',
            title: t('MainScreenStack.titleDetailShip'),
            component: DetailShip,
        },
        {
            name: 'RequestForAQuoteStack',
            title: t('MainScreenStack.titleRequestForAQuoteStack'),
            component: RequestForQuoteStackNav,
        },
        {
            name: 'TransactionStatusTab',
            title: t('MainScreenStack.titleTransactionStatusTabNav'),
            component: TransactionStatusTabNav,
        },
        {
            name: 'TransactionDetailStack',
            title: t('MainScreenStack.titleTransactionDetail'),
            component: TransactionDetail,
        },
        {
            name: 'Negotiate',
            title: t('MainScreenStack.titleNegotiation'),
            component: Negotiate,
        },
        {
            name: 'ProposalPreview',
            title: t('MainScreenStack.titleProposalPreview'),
            component: ProposalPreview,
        },
        {
            name: 'Payment',
            title: t('MainScreenStack.titlePayment'),
            component: Payment,
        },
        {
            name: 'PaymentHistory',
            title: t('MainScreenStack.titlePaymentHistory'),
            component: PaymentHistory,
        },
        {
            name: 'CompanyRegister',
            title: t('MainScreenStack.titleCompanyRegister'),
            component: CompanyRegister,
        },
        {
            name: 'SavedShips',
            title: t('MainScreenStack.titleSavedShips'),
            component: SavedShips,
        },
        {
            name: 'RemindedShips',
            title: t('MainScreenStack.titleRemindedShips'),
            component: RemindedShips,
        },
        {
            name: 'AboutUs',
            title: t('MainScreenStack.titleAboutUs'),
            component: AboutUs,
        },
        {
            name: 'EditProfile',
            title: t('MainScreenStack.titleEditProfile'),
            component: EditProfile,
        },
        {
            name: 'VerifEmail',
            title: t('MainScreenStack.titleVerifyEmail'),
            component: VerifyEmail,
        },
        {
            name: 'Company',
            title: t('MainScreenStack.titleCompanyProfile'),
            component: Company,
        },
        {
            name: 'RequestDetail',
            title: t('MainScreenStack.titleRequestDetail'),
            component: RequestDetail,
        },
        {
            name: 'ProposalDetail',
            title: t('MainScreenStack.titleProposalDetail'),
            component: ProposalDetail,
        },
        {
            name: 'ContractDetail',
            title: t('MainScreenStack.titleContractDetail'),
            component: ContractDetail,
        },
        {
            name: 'RenterDocumentPreview',
            title: `${text} ${t('MainScreenStack.titlePreview')}`,
            component: RenterDocumentPreview,
        },
        {
            name: 'PaymentReceipt',
            title: t('MainScreenStack.titlePaymentReceipt'),
            component: PaymetReceiptPreview,
        },
        {
            name: 'ContractPreview',
            title: t('MainScreenStack.titleContractPreview'),
            component: ContractPreview,
        },
        {
            name: 'TrackTransactionsStat',
            title: t('MainScreenStack.titleTrackTransaction'),
            component: TrackTransactionsStat,
        },
        {
            name: 'Search',
            title: t('MainScreenStack.titleSearch'),
            component: Search,
        },
        {
            name: 'ShipByCategory',
            title: t('MainScreenStack.titleShipByCategory'),
            component: ShipByCategory,
        },
        {
            name: 'ChangeLanguage',
            title: t('MainScreenStack.titleChangeLanguage'),
            component: ChangeLanguage,
        },
        {
            name: 'VerifPhone',
            title: t('MainScreenStack.titleVerifyPhoneNumber'),
            component: VerifyPhone,
        },
        {
            name: 'AccountVerification',
            title: t('MainScreenStack.titleAccountVerification'),
            component: AccountVerification,
        },
        {
            name: 'AddReview',
            title: t('MainScreenStack.titleAddReview'),
            component: AddReview,
        },
        {
            name: 'ShipAvailability',
            title: t('MainScreenStack.titleShipAvailability'),
            component: ShipAvailability,
        },
        {
            name: 'DeleteAccount',
            title: t('MainScreenStack.titleDeleteAccount'),
            component: DeleteAccount,
        },
        {
            name: 'ShipTrackingDetail',
            title: t('MainScreenStack.titleShipTrackingDetail'),
            component: RenterShipTrackingDetail,
        },
        {
            name: 'ShipTrackingForm',
            title: t('MainScreenStack.titleShipTrackingForm'),
            component: ShipTrackingForm,
        },
    ];

    return (
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen
                name="MainScreenTab"
                component={MainScreenTabNav}
            />
            {screens.map(screen => (
                <MainStack.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={{
                        headerTitle: screen.title,
                        headerBackTitleVisible: false,
                        headerShown: true,
                        headerTitleAlign: 'center',
                        headerTintColor: Color.primaryColor,
                        headerTitleStyle: {
                            fontFamily: FontFamily.semiBold,
                        },
                    }}
                />
            ))}
        </MainStack.Navigator>
    );
};

export default MainScreenStack;
