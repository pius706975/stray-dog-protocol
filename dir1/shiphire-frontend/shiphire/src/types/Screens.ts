import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    AuthParamList,
    HomeScreenParamList,
    MainAdminStackParamList,
    MainGuestStackParamList,
    MainOwnerStackParamList,
    MainScreenGuestParamList,
    MainScreenOwnerParamList,
    MainScreenParamList,
    MainStackParamList,
    OwnerTransactionParamList,
    ProposalOwnerParamList,
    RenterPreferenceParamList,
    RequestForAQuoteParamList,
    RootParamList,
    TransactionParamList,
} from './Navigators';

export type SplashScreenProps = NativeStackScreenProps<RootParamList, 'Splash'>;

export type SignInProps = NativeStackScreenProps<AuthParamList, 'SignIn'>;

export type SignUpProps = NativeStackScreenProps<AuthParamList, 'SignUp'>;

export type ForgotPasswordProps = NativeStackScreenProps<
    AuthParamList,
    'ForgotPassword'
>;

export type VerifyOTPForgotPassProps = NativeStackScreenProps<
    AuthParamList,
    'VerifyOTPForgotPass'
>;

export type ResetPasswordProps = NativeStackScreenProps<
    AuthParamList,
    'ResetPassword'
>;

export type RoleSelectProps = NativeStackScreenProps<
    RootParamList,
    'RoleSelect'
>;

export type ShipOwnerDocProps = NativeStackScreenProps<
    RenterPreferenceParamList & MainStackParamList,
    'ShipOwnerDocSubmit'
>;

export type GeneralPrefProps = NativeStackScreenProps<
    RenterPreferenceParamList & RootParamList,
    'General'
>;

export type CategoryPrefProps = NativeStackScreenProps<
    RenterPreferenceParamList & RootParamList,
    'Category'
>;

export type SpesificPrefProps = NativeStackScreenProps<
    RenterPreferenceParamList & RootParamList,
    'Spesific'
>;

export type HomeProps = NativeStackScreenProps<
    HomeScreenParamList & MainStackParamList,
    'Home'
>;

export type NotificationProps = NativeStackScreenProps<
    MainScreenParamList & MainStackParamList,
    'Notification'
>;

export type DetailShipsProps = NativeStackScreenProps<
    MainStackParamList & RequestForAQuoteParamList & MainScreenParamList,
    'DetailShip'
>;

export type DeleteAccountProps = NativeStackScreenProps<
    MainStackParamList &
        MainScreenParamList &
        MainOwnerStackParamList &
        MainScreenOwnerParamList,
    'DeleteAccount'
>;

// export type DeleteAccountOwnerProps = NativeStackScreenProps<
//     MainOwnerStackParamList & MainScreenOwnerParamList,
//     'DeleteAccount'
// >;

export type RemindedShipsProps = NativeStackScreenProps<
    MainStackParamList & MainScreenParamList,
    'RemindedShips'
>;

export type RequestForaQuoteProps = NativeStackScreenProps<
    RequestForAQuoteParamList,
    'ShipInformation'
>;

export type RFQDocPreviewProps = NativeStackScreenProps<
    RequestForAQuoteParamList & MainStackParamList,
    'DocPreview'
>;

export type RFQTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<TransactionParamList, 'RequestForQuote'>,
    NativeStackScreenProps<MainStackParamList>
>;

export type ProposalTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<TransactionParamList, 'Proposal'>,
    NativeStackScreenProps<MainStackParamList>
>;

export type ContractTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<TransactionParamList, 'Contract'>,
    NativeStackScreenProps<MainStackParamList>
>;

export type CompleteTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<TransactionParamList, 'Complete'>,
    NativeStackScreenProps<MainStackParamList>
>;

export type FailedTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<TransactionParamList, 'Failed'>,
    NativeStackScreenProps<MainStackParamList>
>;

export type TransactionDetailProps = NativeStackScreenProps<
    MainStackParamList,
    'TransactionDetailStack'
>;

export type ReviewProps = NativeStackScreenProps<
    MainStackParamList,
    'AddReview'
>;

export type TrackTrasactionsStatProps = NativeStackScreenProps<
    MainStackParamList,
    'TrackTransactionsStat'
>;

export type OwnerRFQTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<OwnerTransactionParamList, 'RequestForQuote'>,
    NativeStackScreenProps<MainOwnerStackParamList>
>;

export type OwnerProposalTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<OwnerTransactionParamList, 'Proposal'>,
    NativeStackScreenProps<MainOwnerStackParamList>
>;

export type OwnerAcceptPaymentTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<OwnerTransactionParamList, 'AcceptPayment'>,
    NativeStackScreenProps<MainOwnerStackParamList>
>;

export type OwnerContractTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<OwnerTransactionParamList, 'Contract'>,
    NativeStackScreenProps<MainOwnerStackParamList>
>;

export type OwnerCompleteTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<OwnerTransactionParamList, 'Complete'>,
    NativeStackScreenProps<MainOwnerStackParamList>
>;

export type OwnerFailedTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<OwnerTransactionParamList, 'Failed'>,
    NativeStackScreenProps<MainOwnerStackParamList>
>;

export type OwnerTransactionDetailProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'TransactionDetailStack'
>;

export type OwnerTrackTrasactionsStatProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'TrackTransactionsStat'
>;

export type ProposalPreviewProps = NativeStackScreenProps<
    MainStackParamList,
    'ProposalPreview'
>;

export type PaymentProps = NativeStackScreenProps<
    MainStackParamList,
    'Payment'
>;

export type PaymentHistoryProps = NativeStackScreenProps<
    MainStackParamList,
    'PaymentHistory'
>;

export type NegotiateProps = NativeStackScreenProps<
    MainStackParamList,
    'Negotiate'
>;

export type RequestDetailProps = NativeStackScreenProps<
    MainStackParamList,
    'RequestDetail'
>;

export type ProposalDetailProps = NativeStackScreenProps<
    MainStackParamList,
    'ProposalDetail'
>;
export type ContractDetailProps = NativeStackScreenProps<
    MainStackParamList,
    'ContractDetail'
>;

export type AccountProps = NativeStackScreenProps<
    MainScreenParamList & MainStackParamList,
    'Account'
>;

export type AccountVerificationProps = NativeStackScreenProps<
    MainScreenParamList & MainStackParamList,
    'AccountVerification'
>;

export type CompanyRegisterProps = NativeStackScreenProps<
    MainStackParamList & MainScreenParamList,
    'CompanyRegister'
>;

export type EditProfileProps = NativeStackScreenProps<
    MainStackParamList & MainScreenParamList,
    'EditProfile'
>;

export type OwnerCompanyRegisterProps = NativeStackScreenProps<
    MainOwnerStackParamList & MainScreenOwnerParamList,
    'OwnerCompanyRegister'
>;

export type CompanyProps = NativeStackScreenProps<
    MainStackParamList,
    'Company'
>;

export type VerifyEmailProps = NativeStackScreenProps<
    MainScreenParamList & MainStackParamList,
    'VerifEmail'
>;

export type RenterDocumentPreviewProps = NativeStackScreenProps<
    MainStackParamList,
    'RenterDocumentPreview'
>;

export type OwnerDocumentPreviewProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'OwnerDocumentPreview'
>;
export type OwnerDocumentRFQProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'OwnerDocumentRFQ'
>;

export type ShipOwnerHomeProps = NativeStackScreenProps<
    MainScreenOwnerParamList & MainOwnerStackParamList,
    'Home'
>;

export type OwnerShipsProps = NativeStackScreenProps<
    MainScreenOwnerParamList & MainOwnerStackParamList,
    'Ships'
>;

export type GeneralFormProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'GeneralForm'
>;

export type SpecificFormProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'SpecificForm'
>;

export type DocumentFormProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'DocumentForm'
>;

export type EditDocumentFormProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'EditDocumentForm'
>;

export type ImageFormProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'ImageForm'
>;

export type EditImageFormProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'EditImageForm'
>;

export type OwnerDetailShipProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'OwnerDetailShip'
>;

export type PaymentReceiptProps = NativeStackScreenProps<
    MainStackParamList,
    'PaymentReceipt'
>;

export type ContractPreviewProps = NativeStackScreenProps<
    MainStackParamList,
    'ContractPreview'
>;

export type OwnerContractPreviewProps = NativeStackScreenProps<
    MainOwnerStackParamList & MainScreenOwnerParamList,
    'OwnerContractPreview'
>;

export type EditGeneralFormProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'EditGeneralForm'
>;

export type EditSpecificFormProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'EditSpecificForm'
>;

export type ProposalOwnerProps = NativeStackScreenProps<
    ProposalOwnerParamList,
    'RFQData'
>;

export type ProposalDocPreviewProps = NativeStackScreenProps<
    ProposalOwnerParamList & MainOwnerStackParamList,
    'DocPreviewProposalOwner'
>;

// export type PaymentReceiptOwnerProps = NativeStackScreenProps<
//     MainOwnerStackParamList,
//     'PaymentReceiptOwner'
// >;

export type PaymentOwnerProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'Payment'
>;

export type PaymentHistoryOwnerProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'PaymentOwnerHistory'
>;

export type AdminHomeProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'AdminHome'
>;

export type DetailTransactionProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'DetailTransaction'
>;

export type AdminDocumentPreviewProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'AdminDocumentPreview'
>;

export type SearchHomeProps = NativeStackScreenProps<
    MainStackParamList & MainGuestStackParamList,
    'Search'
>;

export type AddTransactionHistoryProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'AddTransactionHistory'
>;

export type UserManagementProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'UserManagement'
>;
export type DetailUserProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'UserDetail'
>;

export type VerifyPhoneProps = NativeStackScreenProps<
    MainStackParamList & MainScreenParamList,
    'VerifPhone'
>;
export type ShipManagementProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'ShipManagement'
>;

export type DetailShipsAdminProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'DetailShipAdmin'
>;

export type DocumentShipPreviewProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'DocumentShipPreview'
>;

export type ShipAvailabilityProps = NativeStackScreenProps<
    MainStackParamList & MainScreenParamList,
    'ShipAvailability'
>;

export type RFQTemplateManagementProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'RFQTemplateManagement'
>;

export type RFQFormInputManagementProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'RFQFormInputManagement'
>;

export type RFQInputFormProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'RFQInputForm'
>;

export type AddShipManagementProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'AddShipManagement'
>;
export type AddShipInputManagementProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'AddShipInputManagement'
>;
export type AddShipInputFormProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'AddShipInputForm'
>;
export type AddShipInputEditFormProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'AddShipInputEditForm'
>;
export type AddShipSpecificInfoProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'AddShipSpecificInfo'
>;

export type AddRfqTemplateProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'AddRfqTemplate'
>;

export type EditRFQInputFormProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'EditRFQInputForm'
>;

export type SelectRFQTemplateProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'SelectRFQTemplate'
>;
export type ManageTransactionHistoryProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'ManageTransactionHistory'
>;

export type ShipHistoryDeleteProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'ShipHistoryDelete'
>;

export type EditShipHistoryProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'EditShipHistory'
>;

export type RFQTemplateManagementOwnerProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'RFQTemplateOwnerManagement'
>;

export type RFQFormInputManagementOwnerProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'RFQFormInputManagementOwner'
>;

export type RFQInputFormOwnerProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'RFQInputFormOwner'
>;

export type AddRfqTemplateOwnerProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'AddRfqTemplateOwner'
>;

export type RFQFormInputManagementCustomOwnerProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'RFQFormInputCustomManagementOwner'
>;

export type ShipOwnerAccountProps = NativeStackScreenProps<
    MainOwnerStackParamList & MainScreenOwnerParamList,
    'Account'
>;

export type ShipOwnerCompanyProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'ShipOwnerCompany'
>;

export type RFQTemplateOwnerViewProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'RFQTemplateOwnerView'
>;

export type RFQFormInputViewProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'RFQFormInputView'
>;

export type EditRFQInputFormOwnerProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'EditRFQInputFormOwner'
>;

export type RFQInputFormOwnerDetailProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'RFQInputFormOwnerDetail'
>;

export type ShipOwnerTransactionDetailProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'ShipOwnerTransactionDetail'
>;

export type ShipPictureProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'ShipPictures'
>;

export type ShipPicturesAfterRentProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'ShipPicturesAfterRent'
>;

export type SeeShipPicturesProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'SeeShipPictures'
>;

export type NegotiateOwnerProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'Negotiate'
>;

export type SendContractProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'SendContract'
>;

export type CompanyManagementProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'CompanyManagement'
>;
export type CompanyDetailProps = NativeStackScreenProps<
    MainAdminStackParamList,
    'CompanyDetail'
>;

export type PaymentTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<TransactionParamList, 'PaymentStats'>,
    NativeStackScreenProps<MainStackParamList>
>;

export type ShipTrackingDetailProps = NativeStackScreenProps<
    MainStackParamList,
    'ShipTrackingDetail'
>;

export type OwnerShipTrackingDetailProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'ShipTrackingDetail'
>;

export type ShipTrackingFormProps = NativeStackScreenProps<
    MainOwnerStackParamList,
    'ShipTrackingForm'
>;

export type OwnerShipTrackingTransactionStatusProps = CompositeScreenProps<
    MaterialTopTabScreenProps<OwnerTransactionParamList, 'ShipTracking'>,
    NativeStackScreenProps<MainOwnerStackParamList>
>;

export type GuestHomeProps = NativeStackScreenProps<
    MainScreenGuestParamList & MainGuestStackParamList,
    'Home'
>;

export type GuestAccountProps = NativeStackScreenProps<
    MainGuestStackParamList & MainScreenGuestParamList,
    'Account'
>;
