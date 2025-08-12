import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { OwnerTransactionTabNav } from '.';
import { Color, FontFamily } from '../configs';
import {
    AboutUs,
    AddTransactionHistory,
    ChangeLanguage,
    ContractDocPreview,
    DeleteAccount,
    DeleteAccountOwner,
    DocumentForm,
    EditShipHistory,
    GeneralForm,
    ImageForm,
    ManageTransactionHistory,
    OwnerDetailShip,
    OwnerDocumentPreview,
    PaymentOwnerHistory,
    SeeShipPictures,
    SelectRFQTemplate,
    SendContract,
    ShipOwnerCompany,
    ShipOwnerTransactionDetail,
    ShipPictures,
    ShipPicturesAfterRent,
    SpecificForm,
} from '../screens';
import {
    EditDocumentForm,
    EditGeneralForm,
    EditImageForm,
    EditSpecificForm,
} from '../screens/main/shipowner/editShip';
import { Payment } from '../screens/main/shipowner/paymentOwner';
import { PaymentReceiptPreview } from '../screens/main/shipowner/paymentReceiptOwner';
import { ProposalDocPreview } from '../screens/main/shipowner/proposalDocPreview';
import ProposalOwner from '../screens/main/shipowner/proposalOwner/ProposalOwner';
import { MainOwnerStackParamList } from '../types';
import MainScreenOwnerTabNav from './MainScreenOwnerTabNav';
import { RFQTemplateOwnerManagement } from '../screens/main/shipowner/rfqDynamicFormOwner/rfqTemplateManagement';
import { RFQFormInputManagementOwner } from '../screens/main/shipowner/rfqDynamicFormOwner/rfqFormInputManagement';
import { RFQInputFormOwner } from '../screens/main/shipowner/rfqDynamicFormOwner/rfqInputForm';
import RFQFormInputCustomManagement from '../screens/main/shipowner/rfqDynamicFormOwner/rfqFormInputCustomManagement/RFQFormInputCustomManagementOwner';
import { RFQFormInputView } from '../screens/main/shipowner/rfqDynamicFormOwner/rfqFormInputView';
import { EditRFQInputFormOwner } from '../screens/main/shipowner/rfqDynamicFormOwner/editRfqFormInput';
import RFQInputFormOwnerDetail from '../screens/main/shipowner/rfqDynamicFormOwner/rfqInputFormOwnerDetail/RFQInputFormOwnerDetail';
import { NegotiateOwner } from '../screens/main/shipowner/negotiate';
import { OwnerDocumentRFQ } from '../screens/main/shipowner/documentRFQ';
import { ShipTrackingDetail } from '../screens/main/shipowner/shipTrackingDetail';

const MainOwnerStack = createNativeStackNavigator<MainOwnerStackParamList>();

const MainScreenOwnerStack = () => {
    const { t } = useTranslation('common');
    const screens: {
        name: keyof MainOwnerStackParamList;
        title: string;
        component: any;
        headerShown?: boolean;
        headerBackVisible?: boolean;
    }[] = [
        {
            name: 'GeneralForm',
            title: t('MainScreenOwnerStack.titleAddShip'),
            component: GeneralForm,
        },
        {
            name: 'SpecificForm',
            title: t('MainScreenOwnerStack.titleAddShip'),
            component: SpecificForm,
        },
        {
            name: 'DocumentForm',
            title: t('MainScreenOwnerStack.titleAddShip'),
            component: DocumentForm,
        },
        {
            name: 'ImageForm',
            title: t('MainScreenOwnerStack.titleAddShip'),
            component: ImageForm,
            headerBackVisible: false,
        },
        {
            name: 'DocPreviewProposalOwner',
            title: t('MainScreenOwnerStack.titleProposalPreview'),
            component: ProposalDocPreview,
        },
        { name: 'ProposalOwner', title: 'Proposal', component: ProposalOwner },
        {
            name: 'OwnerDetailShip',
            title: t('MainScreenOwnerStack.titleDetailShip'),
            component: OwnerDetailShip,
            headerShown: false,
        },
        {
            name: 'Payment',
            title: t('MainScreenOwnerStack.titlePaymentRenter'),
            component: Payment,
        },
        {
            name: 'PaymentOwnerHistory',
            title: t('MainScreenOwnerStack.titlePaymentHistory'),
            component: PaymentOwnerHistory,
        },
        {
            name: 'PaymentReceiptOwner',
            title: t('MainScreenOwnerStack.titlePaymentReceipt'),
            component: PaymentReceiptPreview,
        },
        {
            name: 'EditGeneralForm',
            title: t('MainScreenOwnerStack.titleEditGeneralForm'),
            component: EditGeneralForm,
        },
        {
            name: 'EditSpecificForm',
            title: t('MainScreenOwnerStack.titleEditGeneralForm'),
            component: EditSpecificForm,
        },
        {
            name: 'EditImageForm',
            title: t('MainScreenOwnerStack.EditImageForm'),
            component: EditImageForm,
        },
        {
            name: 'EditDocumentForm',
            title: t('MainScreenOwnerStack.EditDocumentForm'),
            component: EditDocumentForm,
        },
        {
            name: 'OwnerDocumentPreview',
            title: t('MainScreenOwnerStack.OwnerDocumentPreview'),
            component: OwnerDocumentPreview,
        },
        {
            name: 'OwnerTransactionTabNav',
            title: t('MainScreenOwnerStack.titleTransactionStatus'),
            component: OwnerTransactionTabNav,
        },
        {
            name: 'OwnerContractPreview',
            title: t('MainScreenOwnerStack.titleOwnerContractPreview'),
            component: ContractDocPreview,
        },
        {
            name: 'ChangeLanguage',
            title: t('MainScreenStack.titleChangeLanguage'),
            component: ChangeLanguage,
        },
        {
            name: 'AddTransactionHistory',
            title: t('MainScreenStack.titleAddTransactionHistory'),
            component: AddTransactionHistory,
        },
        {
            name: 'SelectRFQTemplate',
            title: 'Select RFQ Template',
            component: SelectRFQTemplate,
        },
        {
            name: 'ManageTransactionHistory',
            title: t('MainScreenStack.titleManageTransactionHistory'),
            component: ManageTransactionHistory,
        },
        {
            name: 'EditShipHistory',
            title: t('MainScreenStack.titleEditShipHistory'),
            component: EditShipHistory,
        },
        {
            name: 'RFQTemplateOwnerManagement',
            title: t('MainScreenOwnerStack.titleRFQTemplateManagement'),
            component: RFQTemplateOwnerManagement,
            headerBackVisible: false,
        },
        {
            name: 'RFQFormInputManagementOwner',
            title: t('MainScreenOwnerStack.titleRFQFormInputManagement'),
            component: RFQFormInputManagementOwner,
        },
        {
            name: 'RFQInputFormOwner',
            title: t('MainScreenOwnerStack.titleRFQInputForm'),
            component: RFQInputFormOwner,
        },
        {
            name: 'RFQFormInputCustomManagementOwner',
            title: t('MainScreenOwnerStack.titleRFQFormInput'),
            component: RFQFormInputCustomManagement,
            headerBackVisible: false,
        },
        {
            name: 'ShipOwnerCompany',
            title: t('MainScreenStack.titleShipOwnerCompany'),
            component: ShipOwnerCompany,
        },
        {
            name: 'RFQFormInputView',
            title: t('MainScreenOwnerStack.titleRFQFormInput'),
            component: RFQFormInputView,
        },
        {
            name: 'EditRFQInputFormOwner',
            title: t('MainScreenOwnerStack.titleEditInputForm'),
            component: EditRFQInputFormOwner,
        },
        {
            name: 'RFQInputFormOwnerDetail',
            title: t('MainScreenOwnerStack.titleRFQInputForm'),
            component: RFQInputFormOwnerDetail,
        },
        {
            name: 'ShipOwnerTransactionDetail',
            title: t('MainScreenOwnerStack.titleTransactionDetail'),
            component: ShipOwnerTransactionDetail,
        },
        {
            name: 'ShipPictures',
            title: t('MainScreenOwnerStack.titleShipPictures'),
            component: ShipPictures,
        },
        {
            name: 'ShipPicturesAfterRent',
            title: t('MainScreenOwnerStack.titleShipPicturesAfterRent'),
            component: ShipPicturesAfterRent,
        },
        {
            name: 'SeeShipPictures',
            title: t('MainScreenOwnerStack.titleSeeShipPictures'),
            component: SeeShipPictures,
        },
        {
            name: 'Negotiate',
            title: t('MainScreenOwnerStack.titleNegotiate'),
            component: NegotiateOwner,
        },
        {
            name: 'SendContract',
            title: t('MainScreenOwnerStack.titleSendContract'),
            component: SendContract,
        },
        {
            name: 'AboutUs',
            title: t('MainScreenOwnerStack.titleAboutUs'),
            component: AboutUs,
        },
        {
            name: 'OwnerDocumentRFQ',
            title: t('MainScreenOwnerStack.titleDocumentPreview'),
            component: OwnerDocumentRFQ,
        },
        {
            name: 'DeleteAccount',
            title: t('MainScreenOwnerStack.titleDeleteAccount'),
            component: DeleteAccount,
        },
        {
            name: 'ShipTrackingDetail',
            title: t('MainScreenOwnerStack.titleShipTrackingDetail'),
            component: ShipTrackingDetail,
        },
    ];

    return (
        <MainOwnerStack.Navigator screenOptions={{ headerShown: false }}>
            <MainOwnerStack.Screen
                name="ShipOwnerHome"
                component={MainScreenOwnerTabNav}
            />
            {screens.map(screen => (
                <MainOwnerStack.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={{
                        headerTitle: screen.title,
                        headerBackTitleVisible: false,
                        headerShown: !screen.headerShown
                            ? screen.headerShown
                            : true,
                        headerTitleAlign: 'center',
                        headerTintColor: Color.primaryColor,
                        headerTitleStyle: {
                            fontFamily: FontFamily.semiBold,
                        },
                        headerBackVisible: !screen.headerBackVisible
                            ? screen.headerBackVisible
                            : true,
                    }}
                />
            ))}
        </MainOwnerStack.Navigator>
    );
};

export default MainScreenOwnerStack;
