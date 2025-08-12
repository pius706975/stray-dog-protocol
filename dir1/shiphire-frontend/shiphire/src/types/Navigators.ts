import { RFQFormInputManagementOwnerProps } from './Screens';
import {
    AddShipDynamicInput,
    Payment,
    ShipDatas,
    Transaction,
    TransactionResponse,
    TransactionStatus,
    UserData,
    UserInfo,
} from './Services';

export type AuthParamList = {
    SignIn: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    VerifyOTPForgotPass: {
        email: string;
    };
    ResetPassword: {
        email: string;
    };
    MainScreenStack: undefined;
    MainScreenGuestStack: undefined;
};

export type MainStackParamList = {
    MainStack: undefined;
    AuthScreenStacks: undefined;
    RoleAndPrefStack: undefined;
    ShipOwnerDocSubmit: undefined;
    MainScreenTab: undefined;
    DetailShip: {
        shipId: string | String;
    };
    RequestForAQuoteStack: {
        dynamicFormId: string | String;
        shipId: string | String;
        categoryId: string | String;
        shipOwnerId: string | String;
    };
    TransactionStatusTab: undefined;
    TransactionDetailStack: {
        rentalId: string | String;
        status: 'complete' | 'failed' | 'rfq' | 'proposal' | 'contract';
    };
    AddReview: {
        shipId: String;
        rate: Number;
        review: String;
    };
    ProposalPreview: {
        proposalUrl: string;
        rentalId: string | String;
    };
    Negotiate: {
        transactionId: string;
        status: TransactionStatus[];
    };
    Payment: {
        rentalId: string | String;
        transactionId: string;
    };
    PaymentHistory: {
        rentalId: string | String;
    };
    CompanyRegister: undefined;
    Company: undefined;
    SavedShips: undefined;
    RemindedShips: undefined;
    EditProfile: undefined;
    AboutUs: undefined;
    RequestDetail: undefined;
    ProposalDetail: undefined;
    ContractDetail: undefined;
    VerifEmail: undefined;
    PaymentReceipt: {
        paymentReceiptUrl: string;
    };
    ContractPreview: {
        contractUrl: string;
        rentalId: string | String;
    };
    TrackTransactionsStat: {
        rentalId: string | String;
    };
    RenterDocumentPreview: {
        documentUrl: string;
        isEditable?: boolean;
    };
    Search: undefined;
    ShipByCategory: undefined;
    ChangeLanguage: undefined;
    VerifPhone: undefined;
    AccountVerification: undefined;
    ShipAvailability: {
        shipId: string | String;
        shipHistory?: [
            {
                rentStartDate: string;
                rentEndDate: string;
                locationDeparture: string;
                locationDestination: string;
                needs: string;
                renterCompanyName: string;
                deleteStatus: string;
            },
        ];
    };
    DeleteAccount: undefined;
    ShipTrackingDetail: {
        rentalId: string | String;
    };
    ShipTrackingForm: {
        rentalId: string | String;
    };
};

export type MainOwnerStackParamList = {
    AboutUs: undefined;
    GeneralForm: undefined;
    SpecificForm: undefined;
    DocumentForm: undefined;
    ImageForm: undefined;
    ShipOwnerHome: undefined;
    DetailShip: undefined;
    OwnerCompanyRegister: undefined;
    AddShip: undefined;
    ProposalOwnerStack: undefined;
    ProposalOwner: {
        shipId: string | String;
        categoryId: string | String;
        shipOwnerId: string | String;
        rentalId: string | String;
        renterId: string | String;
        rentalDuration: number;
        rentalStartDate: Date;
        rentalEndDate: Date;
    };
    DocPreviewProposalOwner: undefined;
    OwnerDetailShip: {
        shipId: string;
    };
    EditGeneralForm: {
        shipId: string;
    };
    EditSpecificForm: {
        shipId: string;
    };
    EditDocumentForm: {
        shipId: string;
        documentName: string;
        documentUrl: string;
    };
    EditImageForm: {
        shipId: string;
        shipName: string;
    };
    OwnerDocumentPreview: {
        documentUrl: string;
        shipId?: string;
        rentalId?: string;
        isButtonActive?: boolean;
        clickName?: string;
        btnText?: string;
        documentName: string;
    };
    OwnerDocumentRFQ: {
        documentUrl: string;
        rentalId: string;
        shipId?: string;
        documentName: string;
    };
    TransactionDetailStack: {
        rentalId: string | String;
        status:
            | 'complete'
            | 'sailing'
            | 'failed'
            | 'rfq'
            | 'proposal'
            | 'contract';
    };
    TrackTransactionsStat: {
        rentalId: string | String;
    };
    OwnerTransactionTabNav: undefined;
    PaymentReceiptOwner: {
        paymentReceiptUrl: string;
    };
    Payment: {
        paymentReceiptUrl: string;
        rentalId: string;
        sailingStatus: string;
        beforeSailingPictures: {
            documentName: string;
            documentUrl: string;
            description: string;
        }[];
        payment: Payment[];
        rentType: string;
        lastStatus: string;
    };
    PaymentOwnerHistory: {
        payment: Payment[];
        rentType: string;
    };
    ContractPreview: {
        contractUrl: string;
        rentalId: string | String;
    };
    OwnerContractPreview: {
        shipId: string;
        renterId: string;
        rentalId: string;
        renterCompanyName: string | String;
    };
    ChangeLanguage: undefined;
    AddTransactionHistory: {
        shipId: string;
        shipName: string | undefined;
        shipCategory: string | undefined;
        shipImageUrl: string | undefined;
        shipSize: {
            length: number | undefined;
            width: number | undefined;
            height: number | undefined;
        };
        shipCompany: {
            name: string | undefined;
            companyType: string | undefined;
        };
    };
    ManageTransactionHistory: {
        shipId: string | String;
        shipHistory?: [
            {
                _id: string;
                rentStartDate: string;
                rentEndDate: string;
                locationDeparture: string;
                locationDestination: string;
                needs: string;
                renterCompanyName: string;
                deleteStatus: string;
                genericDocument: [
                    {
                        fileName: string;
                        fileUrl: string;
                    },
                ];
            },
        ];
    };
    EditShipHistory: {
        shipHistory: {
            _id: string;
            shipId: string;
            rentStartDate: string;
            rentEndDate: string;
            locationDeparture: string;
            locationDestination: string;
            needs: string;
            renterCompanyName: string;
            deleteStatus: string;
            price: number;
            genericDocument: [
                {
                    fileName: string;
                    fileUrl: string;
                },
            ];
        };
    };
    RFQTemplateOwnerManagement: {
        shipCategory: string | String;
        shipId: string | String;
    };
    AddRfqTemplateOwner: undefined;
    RFQFormInputManagementOwner: {
        shipId: string | String;
        dynamicForms:
            | {
                  _id: string;
                  formType: string;
                  templateType: string | String;
                  inputType: string;
                  label: string;
                  fieldName: string;
                  fieldType: string;
                  placeholder: string;
                  active: boolean;
                  order?: number;
                  unit?: string;
                  required: boolean;
                  option: { value: string; _id: string }[];
                  validate?: { min?: number; multiline?: boolean };
              }[];
        templateType?: string;
    };
    RFQInputFormOwner: {
        templateType?: string | String;
        formType?: string | String;
        shipId: string | String;
    };
    RFQFormInputCustomManagementOwner: {
        shipId: string | String;
        templateType?: string | String;
        formType?: string | String;
    };
    SelectRFQTemplate: undefined;
    Account: undefined;
    ShipOwnerCompany: undefined;
    RFQTemplateOwnerView: {
        shipCategory: string | String;
        shipId: string | String;
    };
    RFQFormInputView: {
        _id: string | String;
        category: string | String;
        shipId: string | String;
    };
    EditRFQInputFormOwner: {
        _id: string | String;
        templateType: string | String;
        formType: string | String;
    };
    RFQInputFormOwnerDetail: {
        templateType?: string | String;
        formType?: string | String;
        shipId: string | String;
    };
    ShipOwnerTransactionDetail: {
        rentalId: string | String;
        status:
            | 'complete'
            | 'sailing'
            | 'failed'
            | 'rfq'
            | 'proposal'
            | 'contract'
            | 'payment';
    };
    ShipPictures: {
        transactionId: string | String;
        sailingStatus: string | String;
        beforeSailingPictures?: [
            {
                documentName: string;
                documentUrl: string;
                description: string;
            },
        ];
        afterSailingPictures?: [
            {
                documentName: string;
                documentUrl: string;
            },
        ];
    };
    ShipPicturesAfterRent: {
        transactionId: string | String;
        sailingStatus: string | String;
        beforeSailingPictures?: [
            {
                documentName: string;
                documentUrl: string;
                description: string;
            },
        ];
        afterSailingPictures?: [
            {
                documentName: string;
                documentUrl: string;
            },
        ];
    };
    SeeShipPictures: {
        transactionId: string | String;
        sailingStatus: string | String;
        beforeSailingPictures?: [
            {
                documentName: string;
                documentUrl: string;
                description: string;
            },
        ];
        afterSailingPictures?: [
            {
                documentName: string;
                documentUrl: string;
            },
        ];
    };
    Negotiate: {
        transactionId: string;
        status: TransactionStatus[];
    };
    SendContract: {
        shipId: string;
        renterId: string;
        rentalId: string;
        renterCompanyName: string;
        renterCompanyAddress: string;
        renterName: string;
        shipName: string;
        shipCategory: string;
        shipSize: {
            length: number;
            width: number;
            height: number;
        };
        shipCompanyType: string;
        shipCompanyName: string;
        shipDocuments: any[];
        shipImageUrl: string;
        draftContract: {
            proposalId: {
                _id: string;
                otherDoc: {
                    documentName: string;
                    documentUrl: string;
                    _id: string;
                }[];
            };
            _id: string;
            proposalUrl?: string;
            notes?: string;
            proposalName?: string;
            additionalImage: {
                imageUrl: string;
                imageDescription: string;
            }[];
        }[];
    };
    DeleteAccount: undefined;
    ShipTrackingDetail: {
        rentalId: string | String;
    };
    ShipTrackingForm: {
        rentalId: string | String;
    };
};

export type RootParamList = {
    Splash: undefined;
    MainScreenOwnerStack: undefined;
    MainScreenStack: undefined;
    AuthScreenStack: undefined;
    RoleSelect: undefined;
    ShipOwnerDocSubmit: undefined;
    RenterPreferencesStack: undefined;
    OwnerCompanyRegister: undefined;
    MainScreenAdminStack: undefined;
    DeleteAccount: undefined;
    NetworkErrorScreen: undefined;
};

export type MainScreenParamList = {
    Home: undefined;
    Notification: undefined;
    Account: undefined;
};

export type RenterPreferenceParamList = {
    General: undefined;
    Category: undefined;
    Spesific: undefined;
};

export type HomeScreenParamList = {
    Home: undefined;
};

export type RequestForAQuoteParamList = {
    PersonalInformation: undefined;
    ShipInformation: {
        dynamicFormId: string | String;
        shipId: string | String;
        categoryId: string | String;
        shipOwnerId: string | String;
    };
    DocPreview: {
        shipId: string | String;
        categoryId: string | String;
        shipOwnerId: string | String;
        rentalDate: string;
        rentalDuration: number;
        needs?: string;
        locationDeparture?: string;
        locationDestination?: string;
        shipRentType?: string;
    };
};

export type TransactionParamList = {
    RequestForQuote: undefined;
    Proposal: undefined;
    Contract: undefined;
    PaymentStats: undefined;
    Complete: undefined;
    Failed: undefined;
    ShipTracking: undefined;
};

export type OwnerTransactionParamList = {
    RequestForQuote: undefined;
    Proposal: undefined;
    AcceptPayment: undefined;
    Contract: undefined;
    Complete: undefined;
    Failed: undefined;
    ShipTracking: undefined;
};

export type TransactionStackParamList = {
    Detail: undefined;
};

export type MainScreenOwnerParamList = {
    Home: undefined;
    Ships: undefined;
    // ProposalOwner: undefined;
    Account: undefined;
    Notification: undefined;
};

export type ProposalOwnerParamList = {
    RenterInformation: undefined;
    RFQData: {
        shipId: string | String;
        categoryId: string | String;
        shipOwnerId: string | String;
        renterId: string | String;
        rentalId: string | String;
        rentalDuration: number;
        rentalStartDate: Date;
        rentalEndDate: Date;
    };
    DocPreviewProposalOwner: {
        shipOwnerId: string | String;
        shipId: string | String;
        renterId: string | String;
        offeredPrice: number;
        rentalId: string | String;
        categoryId: string | String;
    };
};

export type MainAdminStackParamList = {
    AdminHome: undefined;
    DetailTransaction: {
        transactionData: Transaction;
    };
    AdminDocumentPreview: {
        documentUrl?: string;
        isButtonActive?: boolean;
        shipId?: string;
        documentName: string;
        btnText?: string;
    };
    UserManagement: undefined;
    UserDetail: {
        user: UserData;
    };
    ManageTransaction: undefined;
    ChangeLanguage: undefined;
    ShipManagement: undefined;
    DetailShipAdmin: {
        shipId: string | String;
    };
    DocumentShipPreview: {
        documentUrl: string;
    };
    ApprovedShip: {
        _id: string | String;
    };
    ShipHistoryDelete: undefined;
    RFQTemplateManagement: undefined;
    RFQFormInputManagement: {
        templateType: string | String;
        formType: string | String;
    };
    RFQInputForm: {
        templateType: string | String;
        formType: string | String;
    };
    AddShipManagement: undefined;
    AddShipInputManagement: {
        templateType: string | String;
    };
    AddRfqTemplate: undefined;
    EditRFQInputForm: {
        _id: string | String;
        templateType: string | String;
        formType: string | String;
    };
    AddShipInputForm: {
        templateType: string | String;
    };
    AddShipSpecificInfo: undefined;
    AddShipInputEditForm: {
        inputData: AddShipDynamicInput;
    };
    CompanyManagement: undefined;
    CompanyDetail: {
        companyInfo: UserInfo;
    };
};

export type MainScreenAdminParamList = {
    Home: undefined;
    Account: undefined;
};

export type MainGuestStackParamList = {
    GuestHome: undefined;
    Search: undefined;
    SignIn: undefined;
    ChangeLanguage: undefined;
};

export type MainScreenGuestParamList = {
    Home: undefined;
    Account: undefined;
};
