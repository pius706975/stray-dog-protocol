import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { IconNode } from '@rneui/base';
import { FormikErrors, FormikHelpers, FormikTouched } from 'formik';
import {
    GestureResponderEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleProp,
    TextInputFocusEventData,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {
    AuthParamList,
    HomeScreenParamList,
    MainGuestStackParamList,
    MainOwnerStackParamList,
    MainScreenGuestParamList,
    MainScreenOwnerParamList,
    MainScreenParamList,
    MainStackParamList,
    ProposalOwnerParamList,
    RequestForAQuoteParamList,
} from './Navigators';
import {
    DynamicFormType,
    Payment,
    RenterData,
    RenterUserData,
    SailingStatus,
    ShipDatas,
    ShipOwnerCompanyData,
    ShipOwnerUserData,
    SignInRequest,
    SignUpRequest,
    TransactionNego,
    UserCompanyData,
} from './Services';
import { DatePickerProps } from 'react-native-date-picker';
import { ImageOrVideo } from 'react-native-image-crop-picker';

export type ScreenLayoutProps = {
    children: React.ReactNode;
    backgroundColor: 'secondary' | 'light' | 'dark';
    testId: string;
    padding?: number;
    paddingV?: number;
    marginB?: number;
    center?: boolean;
    spread?: boolean;
    start?: boolean;
    flex?: boolean;
    gap?: number;
};

export type TextInputProps = {
    label?: string;
    placeholder: string;
    leftIcon?: IconNode;
    rightIcon?: any;
    onChange?: (e: string) => void;
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onIconTouch?: () => void;
    onPress?: () => void;
    editable?: boolean;
    secureTextEntry?: boolean;
    error?:
        | string
        | false
        | string[]
        | FormikErrors<any>
        | FormikErrors<any>[]
        | boolean
        | Date;
    value?: string;
    multiline?: boolean;
    rightIconTestId?: string;
    keyboardType?:
        | 'default'
        | 'number-pad'
        | 'decimal-pad'
        | 'numeric'
        | 'email-address'
        | 'phone-pad';
    fullBorder?: boolean;
    testId?: string;
};

export type ButtonProps = {
    title: string;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    size?: 'md' | 'sm';
    onSubmit: () => void;
    isSubmitting?: boolean;
    rightIcon?: any;
    leftIcon?: any;
    disable?: boolean;
    google?: boolean;
    disabled?: boolean;
    testID?: string;
};

export type TextInputErrorProps = {
    errorText: string;
};

export type CustomCheckBoxProps = {
    checked: boolean;
    title: string;
    onPress?: () => void;
    testId: string;
};

export type CustomSelectionProps = CustomCheckBoxProps;

export type CustomIconBottomNavType = {
    source: any;
    route: any;
    focused: any;
};

export type CustomLabelBottomNavType = {
    route: any;
    focused: any;
};

export type CustomNavbarType = {
    isActive: boolean;
    icon: any;
    label: string;
    onPress: () => void;
};

export type CustomTopNavbarType = {
    isActive: boolean;
    activeIndex: number;
    label: string;
    onPress: () => void;
};

export type CategoryContainerProps = {
    index?: number;
    label: string;
    onPress: () => void;
    size?: 'sm' | 'md';
    testId?: string;
};

export type ShipCardProps = {
    name: string;
    imageUrl: string;
    category: string;
    pricePerMonth: number;
    city: string;
    totalRental: number;
    onPress?: () => void;
    testId?: string;
};

export type ShipCardViewProps = {
    name: string;
    imageUrl: string;
    category: string;
    pricePerMonth: number;
    totalRental: number;
    onPress?: () => void;
};

export type ShipCardSearchProps = {
    name: string;
    imageUrl: string;
    category: string;
    pricePerMonth: number;
    shipCity: string;
    totalRental: number;
    onPress?: () => void;
    shipCompany: string;
};

export type TextInputRequestProps = {
    label: string;
    placeholder: string;
    onChange: (e: string) => void;
    onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    editable?: boolean;
    secureTextEntry?: boolean;
    error?: string | boolean;
    value?: string;
};

export type NotifCardProps = {
    docType: 'rfq' | 'proposal' | 'contract' | 'appInfo';
    title: string;
    body: string;
    time: string;
    appInfo?: string;
    navigation: NativeStackNavigationProp<
        MainScreenParamList & MainStackParamList,
        'Notification',
        undefined
    >;
    shipId?: string;
    transactionId?: string;
    rentalId?: string;
    notifId: string;
    testId?: string;
};

export type TransactionCardProps = {
    status: 'onProgress' | 'complete' | 'failed';
    statusText?: string;
    rentalID: string;
    rentalPeriod: string;
    onPress?: () => void;
    responded?: boolean;
    respondKey?: string;
    respondKeyAlert?: boolean;
    respondKeySuccess?: boolean;
    respondValue?: string;
    respondPressed?: () => void;
    newRespond?: boolean;
    shipSize?: {
        length: number;
        width: number;
        height: number;
    };
    shipName?: String;
    shipCategory?: String;
    imageUrl?: string;
    time: Date;
};

export type WizardProps = {
    label: string;
    complete: boolean;
};

export type OTPModalProps = {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    parentProp: NativeStackScreenProps<MainStackParamList, 'ProposalPreview'>;
    rentalId: string | String;
    renterEmail: string;
};

export type OTPFieldProps = {
    setPinReady: React.Dispatch<React.SetStateAction<boolean>>;
    setModalCode: React.Dispatch<React.SetStateAction<number>>;
    modalCode: number;
    testId?: string;
};

export type PaymentCDProps = {
    offeredPrice?: number;
    payIn: number;
    rentStartDate: Date;
    rentEndDate: Date;
};

export type HistoryCardProps = {
    navigation: NativeStackNavigationProp<
        MainStackParamList,
        'Payment',
        undefined
    >;
    rentalId: string | String;
};
export type HistoryCardOwnerProps = {
    navigation: NativeStackNavigationProp<
        MainOwnerStackParamList,
        'Payment',
        undefined
    >;
    payment: Payment[];
    rentType: string;
};

export type FormSignUpProps = {
    onSubmit: (
        values: SignUpRequest & { checkbox: boolean },
        actions: FormikHelpers<SignUpRequest & { checkbox: boolean }>,
    ) => void;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export type CustomTextProps = {
    children: React.ReactNode;
    fontFamily:
        | 'bold'
        | 'boldItalic'
        | 'medium'
        | 'mediumItalic'
        | 'regular'
        | 'semiBold'
        | 'semiBoldItalic';
    fontSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xl1' | 'xl2' | 'xxl' | 'xxxl';
    color:
        | 'bgColor'
        | 'softSecBgPrimary'
        | 'softGreyBgPrimary'
        | 'primaryColor'
        | 'softPrimaryColor'
        | 'secColor'
        | 'softSecColor'
        | 'darkTextColor'
        | 'lightTextColor'
        | 'bgSuccessColor'
        | 'boldSuccessColor'
        | 'successColor'
        | 'bgErrorColor'
        | 'boldErrorColor'
        | 'errorColor'
        | 'bgWarningColor'
        | 'boldWarningColor'
        | 'warningColor'
        | 'bgInfoColor'
        | 'boldInfoColor'
        | 'infoColor'
        | 'bgNeutralColor'
        | 'neutralColor'
        | 'primaryDisableColor';
    borderBottomColor?: string;
    lineHeight?: number;
    textAlign?: 'center' | 'left' | 'right' | 'auto' | 'justify' | undefined;
    numberOfLines?: number;
    ellipsizeMode?: boolean;
};

export type SignUpCheckBoxProps = {
    checked: boolean;
    onPress: (event: GestureResponderEvent) => void;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export type FormSignInProps = {
    onSubmit: (
        values: SignInRequest,
        actions: FormikHelpers<SignInRequest>,
    ) => void;
    navigation: NativeStackNavigationProp<AuthParamList, 'SignIn', undefined>;
    onGoogleSignIn: () => void;
    onAppleSignIn: () => void;
};

export type HeaderHomeProps = {
    navigation: NativeStackNavigationProp<
        HomeScreenParamList & MainStackParamList,
        'Home',
        undefined
    >;
};

export type SearchBarComponentProps = {
    navigation: NativeStackNavigationProp<
        HomeScreenParamList & MainStackParamList,
        'Home',
        undefined
    >;
};

export type ShipCategoryProps = {
    navigation: NativeStackNavigationProp<
        HomeScreenParamList & MainStackParamList,
        'Home',
        undefined
    >;
};

export type TopRateShipComponentProps = {
    navigation: NativeStackNavigationProp<
        HomeScreenParamList & MainStackParamList,
        'Home',
        undefined
    >;
};

export type PopularShipComponentProps = {
    navigation: NativeStackNavigationProp<
        HomeScreenParamList & MainStackParamList,
        'Home',
        undefined
    >;
};

export type ReccomendedShipComponentProps = {
    navigation: NativeStackNavigationProp<
        HomeScreenParamList & MainStackParamList,
        'Home',
        undefined
    >;
};

export type NewAccountSectionProps = {
    navigation: NativeStackNavigationProp<AuthParamList, 'SignIn', undefined>;
};

export type RPButtonsSectionProps = {
    onButtonSubmitPressed: () => void;
    onLinkPressed: (event: GestureResponderEvent) => void;
    confirm?: boolean;
};

export type CustomSearchBarProps = {
    testId: string;
    onPress: (event: GestureResponderEvent) => void;
    placeholder: string;
};

export type CarouselComponentProps = {
    testID?: string;
    onPress: (event: GestureResponderEvent) => void;
    imageUrl: string;
    categoryLabel: string;
    shipName: string;
    shipRating: number;
    testId?: string;
};

export type ShipListViewProps = {
    label: string;
    navigation: NativeStackNavigationProp<
        HomeScreenParamList & MainStackParamList,
        'Home',
        undefined
    >;
    onViewAllPressed: () => void;
    shipDatas: ShipDatas[];
    onLoading: boolean;
    slice?: number;
    testId?: string;
};

export type DetailShipSheetProps = {
    onClose: () => void;
    sheetRef: React.RefObject<BottomSheetMethods>;
    snapPoints: string[];
    size?: {
        length: number;
        width: number;
        height: number;
    };
    specifications?: {
        _id: string;
        name: string;
        spesificationId: { units: string };
        value: string;
    }[];
    testId?: string;
};

export type DetailShipProfileProps = {
    shipName?: string;
    shipPrice?: string;
    shipCity?: string;
    shipProvince?: string;
    shipSaved?: boolean;
    shipRating?: number;
    // shipDesc?: string;
    // shipHistory?: [
    //     {
    //         rentStartDate: string;
    //         rentEndDate: string;
    //         locationDeparture: string;
    //         locationDestination: string;
    //     },
    // ];
    shipRented?: number;
    shipCategory?: string;
    handleShipSaved: () => void;
};

export type OwnerDetailShipProfileProps = {
    shipName?: string;
    shipPrice?: string;
    shipCity?: string;
    shipProvince?: string;
    shipRating?: number;
    shipRentedCount?: number;
    shipDesc?: string;
    shipCategory?: string;
    handleEdit: () => void;
    shipHistory?: [
        {
            rentStartDate: string;
            rentEndDate: string;
            locationDeparture: string;
            locationDestination: string;
            deleteStatus: string;
        },
    ];
    navigationToAddHistory: () => void;
    navigationToManageHistory: () => void;
};

export type AccountHeaderProps = {
    navigation: NativeStackNavigationProp<
        MainScreenParamList & MainStackParamList,
        'Account',
        undefined
    >;
};

export type AccountMenuItemProps = {
    onClick: () => void;
    label: string;
    Icon: React.FC<{}>;
    testID?: string;
};

export type DocumentMenuItemProps = {
    onClick: () => void;
    label: string;
    Icon: React.FC<{}>;
    paddingLeft: number;
};

export type SelectedImageAccordionProps = {
    selectedImagePath: string;
    handleOpenImage: () => void;
    handleSendReceipt: () => void;
    isSubmittingSendReceipt: boolean;
    testID?: string;
};

export type InstructionsAccordionProps = {
    testID?: string[];
};

export type ShipInformationProps = {
    shipImageUrl: string;
    shipName: string;
    shipCategory: string;
    shipSize: {
        length: number;
        width: number;
        height: number;
    };
    shipCompany: string;
    shipDocument?: { documentName: string; documentUrl: string; _id: string }[];
    priceperMonth?: number | undefined;
};

export type ShipInformationContractProps = {
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
    shipImageUrl: string;
    shipName: string;
    shipCategory: string;
    shipSize: {
        length: number;
        width: number;
        height: number;
    };
    shipCompany: string;
    shipDocument?: { documentName: string; documentUrl: string; _id: string }[];
};

export type ShipInformationNegoProps = {
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
    shipImageUrl: string;
    shipName: string;
    shipSize: {
        length: number;
        width: number;
        height: number;
    };
    shipDocument?: { documentName: string; documentUrl: string; _id: string }[];
};

export type PersonalInformationProps = {
    renterName: string;
    renterEmail: string;
    renterPhone: string;
    renterAddress: string;
    renterCompany: string;
    renterCompanyType: string;
    handlePressEditProfile: () => void;
};

export type CalendarPickerModalProps = {
    // visible: boolean;
    // date: Date;
    // onClose: () => void;
    // onDateChange: (date: Date) => void;
    // minDate: Date;
    visible: boolean;
    onClose: () => void;
    shipHistory?: [
        {
            rentStartDate: string;
            rentEndDate: string;
            locationDeparture: string;
            locationDestination: string;
            deleteStatus: string;
        },
    ];
    handleSubmit: (date: string) => void;
    // shipId?: string | String;
    // onDateChange: (date: Date) => void;
    // minDate: Date;
    date: string;
    shipRentType?: string;
};

export type FormRFQProps = {
    userData: RenterUserData;
    renterCompanyAddress: string;
    companyData: UserCompanyData;
    navigation: NativeStackNavigationProp<
        RequestForAQuoteParamList,
        'ShipInformation',
        undefined
    >;
    categoryId: string | String;
    shipOwnerId: string | String;
    shipId: string | String;
    shipCompany: {
        name: string;
        companyType: string;
        address: string;
    };
    shipCategory: string;
    dynamicForms: DynamicFormType[];
    testId?: string;
};
export type CompanyProfileFieldProps = {
    renterDataLabel: string;
    renterDataValue: string | undefined;
};

export type DocumentMenuProps = {
    navigation: NativeStackNavigationProp<
        MainStackParamList,
        'Company',
        undefined
    >;
    pdfUrl: string | undefined;
    label: string;
};

export type EditDocumentMenuProps = {
    navigation: NativeStackNavigationProp<
        MainOwnerStackParamList,
        'OwnerDetailShip',
        undefined
    >;
    pdfUrl: string | undefined;
    label: string;
    shipId: string;
    documentName: string;
    documentExpired?: Date;
};

export type ShipListViewOwnerProps = {
    testID?: string;
    label?: string;
    navigation:
        | NativeStackNavigationProp<
              MainScreenOwnerParamList & MainOwnerStackParamList,
              'Home',
              undefined
          >
        | NativeStackNavigationProp<
              MainScreenOwnerParamList & MainOwnerStackParamList,
              'Ships',
              undefined
          >;
    onViewAllPressed?: () => void;
    shipDatas: ShipDatas[];
    onLoading: boolean;
    slice?: number;
};

export type ShipListOwnerProps = {
    testID?: string;
    label?: string;
    navigation:
        | NativeStackNavigationProp<
              MainScreenOwnerParamList & MainOwnerStackParamList,
              'Home',
              undefined
          >
        | NativeStackNavigationProp<
              MainScreenOwnerParamList & MainOwnerStackParamList,
              'Ships',
              undefined
          >;
    shipDatas: ShipDatas[];
    onLoading: boolean;
    slice?: number;
};

export type CustomDropDownInputProps = {
    label: string;
    items: Array<{ label: string; value: string }>;
    setItems: React.Dispatch<
        React.SetStateAction<Array<{ label: string; value: string }>>
    >;
    value: string[];
    setValue:
        | React.Dispatch<React.SetStateAction<string[]>>
        | React.Dispatch<React.SetStateAction<never[]>>;
    elevation: number;
};

export type EditCustomDropDownInputProps = {
    testID?: string;
    label: string;
    items: Array<{ label: string; value: string }>;
    setItems: React.Dispatch<
        React.SetStateAction<Array<{ label: string; value: string }>>
    >;
    value: (string | undefined)[] | undefined;
    setValue:
        | React.Dispatch<React.SetStateAction<string[]>>
        | React.Dispatch<React.SetStateAction<never[]>>
        | React.Dispatch<
              React.SetStateAction<(string | undefined)[] | undefined>
          >;
    elevation: number;
};

export type SizeFormProps = {
    value: string;
    onChange: (e: string) => void;
    onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    placeholder: string;
};

export type SpecificFormInputFieldProps = {
    testID?: string;
    onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onChange: (e: string) => void;
    value: string | undefined;
    label: string;
    units: string;
};
export type CustomDropdownProps = {
    label?: string;
    items: { label: string; value: string }[];
    value?: string | null;
    setValue: (value: string) => void;
};

export type OTPModalContractProps = {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    parentProp: NativeStackScreenProps<MainStackParamList, 'ContractPreview'>;
    rentalId: string | String;
    renterEmail: string;
};

export type FormProposalOwnerProps = {
    categoryId: string | String;
    shipOwnerId: string | String;
    shipId: string | String;
    shipName: string;
    shipCategory: string;
    renterId: string | String;
    navigation: NativeStackNavigationProp<
        ProposalOwnerParamList,
        'RFQData',
        undefined
    >;
    renterData: RenterData;
    rentalId: string | String;
    rentalDuration: number;
    rentalStartDate: Date;
    rentalEndDate: Date;
    renterUserData: RenterUserData;
    shipOwnerUserData: ShipOwnerUserData;
    shipOwnerCompanyData: ShipOwnerCompanyData;
    offeredPrice: number | undefined;
};

export type RenterInformationProps = {
    renterName: string;
    renterCompany: string;
    renterAddress: string;
};
export type CompleteFlagProps = {
    visible: boolean;
};

export type TransactionStatusCardProps = {
    rentalId: string | String;
    rentalPeriod: number;
    lastStatusText: string;
    status: 'rfq' | 'proposal' | 'contract' | 'complete' | 'failed';
    lastStatusName: string;
    newRespond: boolean;
    alertRespond: boolean;
    navigation: NativeStackNavigationProp<
        MainStackParamList,
        'TransactionDetailStack',
        undefined
    >;
    handleRespondPressed: () => void;
    offeredPrice: number;
    paymentDate?: Date;
    approveDate?: Date;
    statusLength: number;
    testId?: string;
};

export type ShipInformationCardProps = {
    shipImageUrl: string;
    shipName?: string;
    shipCategory?: string;
    formattedShipSize?: string;
};

export type DocumentCardProps = {
    documentType: 'rfq' | 'proposal' | 'contract' | 'receipt';
    documentUrl: string;
    navigation: NativeStackNavigationProp<
        MainStackParamList,
        'TransactionDetailStack',
        undefined
    >;
    testId?: string;
};

export type TransactionProgresProps = {
    rentalId: string | String;
    status: string[];
    statusLength: number;
    statusDate: Date[];
};

export type ShipListViewSearchProps = {
    shipDatas: ShipDatas[];
    navigation: NativeStackNavigationProp<
        MainStackParamList,
        'Search',
        undefined
    >;
    slice?: number;
};

export type FilterSheetProps = {
    onClose: () => void;
    sheetRef: React.RefObject<BottomSheetMethods>;
    snapPoints: string[];
    // shipCategory: string;
};

export type SelectedImageAccordionOwnerProps = {
    selectedImagePath: string;
    handleOpenImage: () => void;
    handleAcceptPayment: () => void;
};

export type DynamicFormProps = {
    data: DynamicFormType[];
    onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void;
    btnTitle: string;
    rightIcon?: any;
    addShipForm?: Boolean;
    shipId?: string | String;
};

export type DynamicTextFieldProps = TextInputProps & {
    errorText?: string;
};

export type TermsModalProps = {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export type PaymentReceiptOwnerProps = {
    url: string | undefined;
};

export type CustomCalendarProps = {
    testID?: string;
    visible: boolean;
    onClose: () => void;
    shipHistory?: [
        {
            rentStartDate: string;
            rentEndDate: string;
            locationDeparture: string;
            locationDestination: string;
            deleteStatus: string;
        },
    ];
    navigateToAddHistory?: () => void;
    navigateToManageHistory?: () => void;
};

export type CalendarAvailabilityProps = {
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

export type ModalConfirmationProps = {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    activeStatus?: boolean;
    customButtonText?: string;
    customBodyText?: string;
};
export type ModalConfirmationCompanyProps = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (isRejected: boolean, isVerified: boolean) => void;
    isSubmittingApprove: boolean;
    isSubmittingReject: boolean;
};

export type UserItemListProps = {
    onPress: () => void;
    name: string;
    role: string;
    isActive: boolean;
    isPhoneVerified: boolean;
    googleId?: string;
    index: number;
};

export type ShipReminderCardProps = {
    navigation: NativeStackNavigationProp<
        MainStackParamList & MainScreenParamList,
        'RemindedShips',
        undefined
    >;
    reminderDate: string;
    shipName: string;
    imageUrl: string;
    shipId: string;
    testID?: string;
};
export type ShipCardAdminProps = {
    name: string;
    imageUrl: string;
    category: string;
    onPress?: () => void;
    shipCompany: string;
};

export type DetailShipProfileAdminProps = {
    shipName?: string;
    shipPrice?: string;
    shipSaved?: boolean;
    shipRating?: number;
    shipCategory?: string;
    shipRented?: number;
};

export type DocumentShipProps = {
    url: any[];
};

export type CompanyFieldProps = {
    shipOwnerDataLabel: string;
    shipOwnerDataValue: string | undefined;
};

export type DocumentMenuShipOwnerProps = {
    navigation: NativeStackNavigationProp<
        MainOwnerStackParamList,
        'ShipOwnerCompany',
        undefined
    >;
    pdfUrl: string | undefined;
    documentName: string;
    label: string;
};

export type DocumentShipShipOwerProps = {
    pdfUrl: string | undefined;
    label: string;
    documentName: string;
    handlePress: () => void;
    index?: number;
};

export type NegotiateHistoryProps = {
    transaction: TransactionNego | undefined;
};
export type NegotiateFormProps = {
    rentalId: string | undefined;
    offeredPrice: number | undefined;
    navigation: NativeStackNavigationProp<MainStackParamList, 'Negotiate'>;
};
export type ShipOwnerTransactionStatusCardProps = {
    rentalId: string | String;
    rentalPeriod: number;
    lastStatusText: string;
    status:
        | 'rfq'
        | 'proposal'
        | 'contract'
        | 'complete'
        | 'failed'
        | 'sailing'
        | 'payment';
    lastStatusName: string;
    newRespond: boolean;
    alertRespond: boolean;
    navigation: NativeStackNavigationProp<
        MainOwnerStackParamList,
        'ShipOwnerTransactionDetail',
        undefined
    >;
    handleRespondPressed: () => void;
    offeredPrice: number;
    paymentDate?: Date;
    approveDate?: Date;
    statusLength: number;
};

export type ShipOwnerDocumentCardProps = {
    testID?: string;
    documentType: 'rfq' | 'proposal' | 'contract' | 'receipt';
    documentUrl: string;
    navigation: NativeStackNavigationProp<
        MainOwnerStackParamList,
        'ShipOwnerTransactionDetail',
        undefined
    >;
};

export type NegotiateFormOwnerProps = {
    rentalId: string | undefined;
    renterId: string | undefined;
    shipId: string | undefined;
    offeredPrice: number | undefined;
    navigation: NativeStackNavigationProp<MainOwnerStackParamList, 'Negotiate'>;
};

export type CompanyDocumentItemProps = {
    index: number;
    label: string;
    handlePress: () => void;
};

export type ShipOwnerAccProps = {
    transactionId: string;
};

export type HistoryListProps = {
    item: Payment;
    index: number;
    rentType: string;
};

export type AdditionalDocument = {
    id: number;
    name: string;
    uri: string;
    type: string;
};

export type AdditionalImage = {
    id: number;
    selectedImage: { path: string };
    imageNotes?: string;
};

export type ShipInformationTrackDetailProps = {
    shipImageUrl?: string;
    shipName?: string;
    shipDestination?: string;
    shipDeparture?: string;
    shipCompanyName?: string;
    shipCompanyType?: string;
    onRenterBtnPress?: () => void;
};

type BeforeSailingPictures = {
    documentName: string;
    documentUrl: string;
    description: string;
}[];

type AfterSailingPictures = {
    documentName: string;
    documentUrl: string;
}[];

export type ShipPictures = BeforeSailingPictures;

export type TrackHistoryProps = {
    rentalId: string | String;
    sailingStatus: SailingStatus[] | undefined;
    beforeSailingPictures: BeforeSailingPictures | undefined;
    afterSailingPictures: AfterSailingPictures | undefined;
    handlePress: (shipPictures: ShipPictures) => void;
    latestShipTrackingStatus: string | undefined;
    scrollViewRef: React.RefObject<ScrollView>;
};

export type UpdateStatusCardProps = {
    latestShipTrackingStatus: string | undefined;
    handlePress: (nextStatus: string) => void;
};

export type GuestShipListViewProps = {
    label: string;
    navigation: NativeStackNavigationProp<
        MainScreenGuestParamList & MainGuestStackParamList,
        'Home',
        undefined
    >;
    onViewAllPressed: () => void;
    shipDatas: ShipDatas[];
    onLoading: boolean;
    slice?: number;
    testId?: string;
};

export type GuestTopRateShipComponentProps = {
    navigation: NativeStackNavigationProp<
        MainScreenGuestParamList & MainGuestStackParamList,
        'Home',
        undefined
    >;
};

export type RentInformationTrackDetailProps = {
    sheetRef: React.RefObject<BottomSheetMethods>;
    departureLocation?: string;
    destinationLocation?: string;
    rentType?: string;
    rentDuration?: number;
    startDate?: Date;
    endDate?: Date;
};

export type ConfirmationModalProps = {
    testID?: string;
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    textBody?: string;
    textCancelButton?: string;
    textConfirmButton?: string;
};

// export type ReviewModalProps = {
//     isVisible: boolean;
//     onConfirm: () => void;
//     onCancel: () => void;
//     textBody?: string;
//     star: number;
//     review: string;
//     textCancelButton?: string;
//     textConfirmButton?: string;
// };

export type NavigationKebabMenuOptions = {
    label: string;
    action: () => void;
};

export type NavigationKebabMenuProps = {
    options: NavigationKebabMenuOptions[];
};

export type ShipPicturesModalProps = {
    testID?: string;
    isVisible: boolean;
    shipPictures: ShipPictures;
    onCloseModal: () => void;
};

export type DateTimePickerModalProps = DatePickerProps & {
    title?: string;
    visible: boolean;
    date: Date;
    onConfirmPress: (date: Date) => void;
    onCancelPress: () => void;
    testID?: string;
};

export type BasicButtonProps = {
    label: string;
    onClick: () => void;
    customStyles?: StyleProp<ViewStyle & TextStyle>;
};

export type ImageInputProps = {
    values: {
        images: ImageOrVideo[];
        descriptions: string[];
    };
    setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean,
    ) => void;
    touched: FormikTouched<{
        images: ImageOrVideo[];
        descriptions: string[];
    }>;
    errors: FormikErrors<{
        images: ImageOrVideo[];
        descriptions: string[];
    }>;
};
