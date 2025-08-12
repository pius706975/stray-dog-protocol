export type SignInRequest = {
    email: string;
    password: string;
};

export type SignUpRequest = SignInRequest & {
    name: string;
    phoneNumber: string;
    confirmPassword: string;
};

export type SignOutRequest = {
    refreshToken: string;
};

export type DefaultResponse = {
    status: string;
};

export type SignInResponse = {
    status: string;
    data: {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
        firebaseId: string;
        googleId: string;
        isVerified: boolean;
        isPhoneVerified: boolean;
        isCompanySubmitted: boolean;
        roles: string;
        imageUrl: string;
        renterId?: {
            _id: string;
            renterPreference: string[];
            company: {
                name: string;
                companyType: string;
                address: string;
                documentCompany: [
                    {
                        documentName: string;
                        documentUrl: string;
                    },
                ];
                imageUrl: string;
                isVerified: boolean;
                isRejected: boolean;
            };
        };
        shipOwnerId?: {
            _id: string;
            company: {
                name: string;
                companyType: string;
                address: string;
                bankName: string;
                bankAccountName: string;
                bankAccountNumber: number;
                documentCompany: [
                    {
                        documentName: string;
                        documentUrl: string;
                    },
                ];
                imageUrl: string;
                isVerified: boolean;
                isRejected: boolean;
            };
        };
        level?: string;
    };
    accessToken: string;
    refreshToken: string;
};

export type GetNewTokenResponse = {
    status: string;
    accessToken: string;
    refreshToken?: string;
};

export type GetUserProfileResponse = {
    status: string;
    data: {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
        firebaseId: string;
        isVerified: boolean;
        roles: string;
    };
};

export type SubmitUserRoleRequest = {
    roleSubmitted: string;
};

export type AddPhoneNumberRequest = {
    phoneNumber: string;
};

export type DeleteAccountRequest = {
    password?: string;
};

export type SubmitUserRoleResponse = GetUserProfileResponse;

export type ShipReminded = {
    ship: {
        id: {
            _id: string;
            name: string;
            imageUrl: string;
        };
        reminderDate: string;
    };
};

export type GetRenterDataResponse = {
    status: string;
    data: {
        _id: string;
        userId: {
            _id: string;
            name: string;
            email: string;
            phoneNumber: string;
            isVerified: boolean;
            isPhoneVerified: boolean;
            isCompanySubmitted: boolean;
            imageUrl: string;
        };
        renterPreference: string[];
        name: string;
        company: {
            name: string;
            companyType: string;
            address: string;
            documentCompany: [
                {
                    documentName: string;
                    documentUrl: string;
                },
            ];
            isVerified: boolean;
            isRejected: boolean;
            imageUrl: string;
        };
        shipReminded: ShipReminded[];
    };
};

export type RenterUserData = {
    name: string;
    email: string;
    phoneNumber: string;
    imageUrl: string;
    isVerified: boolean;
    isPhoneVerified: boolean;
    isCompanySubmitted: boolean;
    isCompanyVerified: boolean;
    isCompanyRejected: boolean;
};

export type RenterName = {
    name: string;
};

export type ShipOwnerUserData = {
    name: string;
    email: string;
    phone: string;
    isVerified: boolean;
    isCompanySubmitted: boolean;
    imageUrl?: string;
};

export type UserCompanyData = {
    name: string;
    companyType: string;
    address: string;
};

export type ShipOwnerCompanyData = {
    name: string;
    companyType: string;
    address: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: number;
};

export type SubmitRenterPreferenceRequest = {
    renterPreference: string[];
};

export type SubmitRenterPreferenceResponse = GetRenterDataResponse;

export type GetShipCategoriesResponse = {
    status: string;
    data: ShipCategoriesDatas[];
};

type ShipCategoriesDatas = {
    _id: string;
    name: string;
    __v: number;
};

type CategoryDatasForShipsResponse = {
    _id: string;
    name: string;
};

export type GetTopRatedShipsResponse = {
    status: string;
    data: ShipDatas[];
};

export type ShipDatas = {
    _id: string;
    size: {
        length: number;
        width: number;
        height: number;
    };
    shipOwnerId: {
        _id: string;
        company: {
            name: string;
            companyType: string;
            address: string;
            isVerified: boolean;
            isRejected: boolean;
        };
    };
    name: string;
    desc: string;
    tags: any[];
    pricePerMonth: number;
    city: string;
    province: string;
    category: CategoryDatasForShipsResponse;
    facilities: [
        {
            _id: string;
            name: string;
            type: string;
        },
    ];
    specifications: [
        {
            _id: string;
            name: string;
            spesificationId: { units: string };
            value: string;
        },
    ];
    rating: number;
    totalRentalCount: number;
    shipDocuments: any[];
    __v: number;
    imageUrl: string;
    shipHistory: [
        {
            _id: string;
            rentStartDate: string;
            rentEndDate: string;
            locationDeparture: string;
            locationDestination: string;
            needs: string;
            renterCompanyName: string;
            deleteStatus: string;
            price: string;
            genericDocument: [
                {
                    fileName: string;
                    fileUrl: string;
                },
            ];
        },
    ];
    rfqDynamicForm: string;
    shipApproved: ShipStatus[];
};

export type GetPopularShipsResponse = {
    status: string;
    data: ShipDatas[];
};

export type GetAllShipsResponse = {
    status: string;
    data: ShipDatas[];
};

export type GetShipByIdResponse = {
    status: string;
    data: ShipDatas;
};

export type RequestForaQuoteRequest = {
    needs: string;
    commodity: string;
    loadAddress: string;
    unloadingAddress: string;
    additionalInformation?: string;
};

export type SailingStatus = {
    trackedBy: {
        name: string;
        role: string;
    };
    status: string;
    desc: string;
    image: {
        imageName: string;
        imageUrl: string;
        _id: string;
    }[];
    date: Date;
    _id: string;
};

export type Transaction = {
    ship: {
        shipId: string;
        size: {
            length: number;
            width: number;
            height: number;
        };
        _id: string;
        shipOwnerId: string;
        name: string;
        category: {
            _id: string;
            name: string;
        };
        imageUrl: string;
        shipDocuments: any[];
        companyName: string;
        companyType: string;
    };
    rfq: {
        rfqId: string;
        rfqUrl: string;
    };
    proposal: {
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
    contract: {
        contractId: string;
        contractUrl: string;
    };
    _id: string;
    rentalId: string;
    renterId: string;
    rentalDuration: number;
    rentalStartDate: Date;
    rentalEndDate: Date;
    offeredPrice: number;
    needs: string;
    locationDestination: string;
    locationDeparture: string;
    shipRentType: string;
    status: TransactionStatus[];
    createdAt: string;
    updatedAt: string;
    ownerDetails?: {
        company?: {
            name?: string;
        };
    };
    sailingStatus: SailingStatus[];
    payment: {
        _id: string;
        paymentId: string;
        receiptUrl: string;
        paymentApproved: boolean;
        paymentExpiredDate: Date;
        paymentReminded: { reminderDate: string }[];
        createdAt: Date;
    }[];
    beforeSailingPictures: [
        {
            documentName: string;
            documentUrl: string;
            description: string;
        },
    ];
    afterSailingPictures: [
        {
            documentName: string;
            documentUrl: string;
        },
    ];
    __v: number;
};

export type TransactionStatus = {
    name: string;
    desc: string;
    date: Date;
    isOpened: boolean;
    _id: string;
};

export type TransactionResponse = {
    status: String;
    data: Transaction[];
};

export type GetShipFacilityResponse = {
    status: String;
    data: [
        {
            _id: string;
            name: string;
        },
    ];
};

export type GetShipSpesificationResponse = {
    status: String;
    data: [
        {
            _id: string;
            name: string;
            units: string;
        },
    ];
};

export type GetShipLocationsResponse = {
    status: String;
    data: [
        {
            _id: string;
            value: string;
        },
    ];
};

export type GetUserLocationResponse = {
    status: String;
    data: {
        province: string;
        city: string;
    };
};

export type GetTransactionByRentalId = {
    status: String;
    data: Transaction;
};

export type CompanyRegisterRequest = {
    companyName: string;
    typeOfCompany: string;
    companyAddress: string;
};

export type OwnerCompanyRegisterRequest = {
    companyName: string;
    typeOfCompany: string;
    companyAddress: string;
    bankName?: string;
    bankAccountName: string;
    bankAccountNumber: string;
};

export type VerifyEmailOTPRequest = {
    emailVerifOTP: number;
};

export type VerifySignProposalOTPRequest = {
    signProposalOTP: number;
    rentalId: string | String;
};

export type GeneralFormAddShipRequest = {
    shipName: string;
    shipCategory?: string;
    rentPrice: number;
    shipDescription: string;
    shipLocation?: string;
};

export type GetOwnerShipsResponse = {
    status: string;
    data: ShipDatas[];
};

export type GetTopRatedOwnerResponse = {
    status: string;
    data: ShipDatas[];
};

export type GetTopRentedOwnerResponse = {
    status: string;
    data: ShipDatas[];
};

export type GetShipCategoriesOwnerResponse = {
    status: string;
    data: ShipCategoriesDatas[];
};

export type SpecificFormAddShipRequest = {
    length: string;
    width: string;
    height: string;
    facilities?: (string | undefined)[];
    specifications?: { name: string; value: string }[];
};

export type GetShipFacilityRequest = {
    shipType: string;
};

export type GetShipSpesificationRequest = {
    shipType: string;
};

export type GetUserLocationRequest = {
    latitude: number;
    longitude: number;
};

export type SubmitShipRequest = {
    name: string;
    desc: string;
    category: string;
    pricePerMonth: string;
    location: string;
    length: string;
    width: string;
    height: string;
    facilities?: (string | undefined)[];
    specifications?: { name: string; value: string }[];
};

export type EditShipRequest = {
    shipId: string | String;
    name: string;
    desc: string;
    category: string;
    pricePerMonth: string;
    location: string;
    length: string;
    width: string;
    height: string;
    facilities?: (string | undefined)[];
    specifications?: { name: string; value: string }[];
};

export type SubmitShipResponse = {
    status: 'success';
    data: {
        shipId: string;
    };
};

export type EditShipResponse = {
    status: 'success';
    data: {
        shipId: string;
    };
};

export type OpenTransactionRequest = {
    rentalId: string | String;
};

export type VerifySignContractOTPRequest = {
    signContractOTP: number;
    rentalId: string | String;
};

export type ProposalOwnerRequest = {
    note: string;
};

export type RenterData = {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
        isVerified: boolean;
        isPhoneVerified: boolean;
        isCompanySubmitted: boolean;
        imageUrl: string;
    };
    renterPreference: string[];
    name: string;
    company: {
        name: string;
        companyType: string;
        address: string;
        documentCompany: [
            {
                documentName: string;
                documentUrl: string;
            },
        ];
        isVerified: boolean;
        isRejected: boolean;
        imageUrl: string;
    };
    shipReminded: ShipReminded[];
};
export type VerifyForgotPassOTPRequest = {
    email: string;
    forgotPassOTP: number;
};

export type ResetPasswordRequest = {
    email: string;
    newPassword: string;
};

export type AcceptRFQRequest = {
    rentalId: string;
};

export type OpenTransactionOwnerRequest = {
    rentalId: string;
    categoryId: string;
    shipOwnerId: string;
    renterId: string;
    shipId: string;
};

export type AcceptPaymentRequest = {
    rentalId: string | String;
};
export type GetTransactionByOwner = {
    status: String;
    data: Transaction;
};

export type GoogleSignInRequest = {
    email: string;
    name: string;
    googleId: string;
    imageUrl: string | null;
};

export type AppleSignInRequest = {
    email: string | null;
    name: string | null;
    appleId: string;
};

export type ShipList = {
    _id: string;
    name: string;
    categories: string;
    companyName: string;
    rating: number;
    totalRentalCount: number;
    imageUrl: string;
    city: string;
    pricePerMonth: number;
    shipApproved: ShipStatus[];
};

export type SearchShipsResponse = {
    status: string;
    data: ShipList[];
};

export type SearchRequest = {
    searchTerm?: string;
    category?: string;
    city?: string;
    province?: string;
    latitude?: string;
    longitude?: string;
    inputRentStartDate?: string | null;
    inputRentEndDate?: string | null;
};
export type AddTransactionHistoryRequest = {
    locationDestination: string;
    locationDeparture: string;
};

export interface DynamicInput {
    _id: string;
    formType: string;
    templateType: string;
    inputType: string;
    label: string;
    fieldName: string;
    fieldType: string;
    placeholder?: string;
    __v: number;
    unit?: string;
    active: boolean;
    docExpired?: boolean;
    order: number;
}

export interface ValidationForm {
    min?: number;
    multiline?: boolean;
    max: number;
}

export type DynamicFormType = {
    validation?: ValidationForm;
    dynamicInput: DynamicInput;
    required: boolean;
    option: [
        {
            value: string;
        },
    ];
    _id: string;
    active: boolean;
};

export type GetDynamicFormData = {
    _id: string;
    formType: string;
    shipId?: string;
    dynamicForms: DynamicFormType[];
    active: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type GetDynamicFormDataResponse = {
    status: string;
    data: GetDynamicFormData;
};

export type GetAllUserTransactions = {
    page: number;
    limit: number;
    query?: string;
};

export type GetRenterUserDataResponse = {
    status: string;
    data: RenterUserData;
};

export type UserCompanyDataForAdmin = {
    _id: string;
    company: {
        name: string;
        address: string;
    };
};
export type UserData = {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    roles: string;
    isActive: boolean;
    renterId?: UserCompanyDataForAdmin;
    shipOwnerId?: UserCompanyDataForAdmin;
    isVerified: boolean;
    isPhoneVerified: boolean;
    googleId?: string;
};

export type GetAllUserResponse = {
    status: string;
    data: UserData[];
};

export type UserActivation = {
    _id: string;
    isActive: boolean;
};

export type VerifyUserPhoneNumberRequest = {
    _id: string;
    isPhoneVerified: boolean;
};

export type DynamicInputAddShipActivation = {
    _id?: string;
    isActive?: boolean;
};

export type UpdateUserActivationResponse = {
    status: string;
    data: UserActivation;
};

export type VerifyUserPhoneNumberResponse = {
    status: string;
    data: VerifyUserPhoneNumberRequest;
};

export type VerifyPhoneOTPRequest = {
    phoneVerifOTP: number;
};
export type UserNotif = {
    _id: string;
    userId: string;
    shipId?: string;
    transactionId?: string;
    rentalId?: string;
    notifType: string;
    title: string;
    body: string;
    isReaded: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type GetUserNotifResponse = {
    status: string;
    data: UserNotif[];
};

export type ApprovedShipRequest = {
    _id: string | String;
};

export type ApprovalShipResponse = {
    status: string;
    data: ApprovedShipRequest;
};

export type ShipStatus = {
    name: string;
    desc: string;
    approvedShip: boolean;
    _id: string;
};

export type GetAddShipDynamicInputRequest = {
    templateType: string | String;
};
export type DeleteShipHistoryRequest = {
    id: string | String;
};
export type AddShipDynamicInput = {
    _id: string;
    formType: string;
    templateType: string;
    inputType: string;
    label: string;
    fieldName: string;
    fieldType: string;
    placeholder: string;
    active: boolean;
    expired: boolean;
    order?: number;
    unit?: string;
    required: boolean;
    option: { value: string; _id: string }[];
    validate?: { min?: number; multiline?: boolean; max?: number };
};

export type GetAllShipPending = {
    status: string;
    data: ShipDatas[];
};

export type ApproveDeleteShipHistoryRequest = {
    id: string | String;
};

export type EditShipHistoryResponse = {
    status: string;
    data: [
        ShipPendingDatas & {
            genericDocument: [
                {
                    fileName: string;
                    fileUrl: string;
                },
            ];
        },
    ];
};

export type EditShipHistoryRequest = {
    locationDestination: string;
    locationDeparture: string;
};

export type GetDocument = {
    shipHistory: {
        genericDocument: [
            {
                fileName: string;
                fileUrl: string;
            },
        ];
    };
};
export type RFQInputFormRequest = {
    label?: string;
    inputType?: string;
    required?: boolean;
    unit?: string;
    order?: number;
    templateType?: string | String;
    formType?: string | String;
    min?: string | number;
    multiline?: boolean;
    option?: { value: string }[];
};
export type DynamicInputRFQData = {
    _id: string;
    formType: string;
    templateType: string;
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
};
export type GetAddShipDynamicInputResponse = {
    status: string;
    data: AddShipDynamicInput[];
    unit?: string;
    active: boolean;
    expired: boolean;
    order?: number;
    required: boolean;
    option?: { value: string; _id: string }[];
    validate?: { min?: number; multiline?: boolean; max?: number };
};

export type GetDynamicInputRFQByTemplateTypeResponse = {
    status: string;
    data: {
        _id: string;
        formType: string;
        templateType: string;
        dynamicForms: DynamicInputRFQData[];
    };
    active: boolean;
    order?: number;
    unit?: string;
    required: boolean;
    option: { value: string; _id: string }[];
    validate?: { min?: number; multiline?: boolean };
};

export type AddShipDynamicInputRequest = {
    isTemplateNameDisplayed?: boolean;
    label: string;
    inputType: string;
    required?: boolean;
    unit?: string;
    order?: number;
    templateName?: string;
    min?: string;
    max?: string;
    multiline?: boolean;
    expired?: boolean;
    option?: { value: string }[];
};
export type AddShipDynamicInputResponse = {
    status: string;
    data: { templateType: String | string };
};
export type AddShipDropdownInputRequest = {
    label: string;
    inputType: string;
    required?: boolean;
    unit?: string;
    order?: number;
    templateName?: string;
};

export type UpdateDynamicFormAddShip = AddShipDynamicInputRequest & {
    id: string | String;
};
export type UpdateInputAddShipOrderRequest = {
    data: { _id: string; order: number }[];
};

export type GetSelectDropDownResponse = {
    status: string;
    data: DynamicInput[];
};
export type AddShipInputResponse = {
    status: string;
    data: string;
};
export type RemoveItemDropdownRequest = {
    id: string | undefined;
};

export type GetShipSpecificationResponse = {
    status: string;
    data: { templateType: string; value: string }[];
};
export type DynamicFormRFQ = {
    _id: string;
    formType: string;
    shipId?: string;
    templateType?: string;
    dynamicForms: DynamicInputRFQData[];
    active?: boolean;
};

export type GetAllTemplateRFQFormResponse = {
    status: string;
    data: DynamicFormRFQ[];
};

export type AddRFQTemplateRequest = {
    shipType?: string;
    templateType?: string;
};

export type RfqFormDropdownInputRequest = {
    id?: string | String;
    label?: string;
    inputType?: string;
    required?: boolean;
    unit?: string;
    order?: number;
    templateName?: string;
};

export type ActiveDynamicInputRFQRequest = {
    id: string | String;
};

export type DynamicInputRFQResponse = {
    dynamicInput: DynamicInputRFQData;
    required: boolean;
    option?: [
        {
            value: string;
        },
    ];
    validation?: ValidationForm;
    _id: string | String;
};

export type GetDynamicInputRFQByIdResponse = {
    status: string;
    data: DynamicInputRFQResponse;
};

export type ActiveDynamicFormRFQRequest = {
    id: string | String;
};

export type ShipPendingDatas = {
    _id: string;
    rentStartDate: string;
    rentEndDate: string;
    locationDeparture: string;
    locationDestination: string;
    needs: string;
    renterCompanyName: string;
    deleteStatus: string;
};

export type GetTemplateShipRFQFormResponse = {
    status: string;
    data: DynamicFormRFQ;
};

export type CompleteNegotiationRequest = {
    rentalId: string | String;
};

export type makeTemplateType = {
    templateType?: string | String;
};

export type RfqFormInputOwnerRequest = {
    id?: string | String;
    label?: string | String;
    inputType?: string | String;
    required?: boolean;
    unit?: string | String;
    order?: number;
    templateName?: string | String;
};

export type dynamicInputRequest = {
    shipId: string | String;
};

export type AddDynamicInputResponse = {
    status: string;
    data: { templateType: String | string };
};

export type RfqFormRequest = {
    id?: string | String;
    label?: string;
    inputType?: string;
    required?: boolean;
    unit?: string;
    order?: number;
    templateName?: string;
};

export type GetShipOwnerDataResponse = {
    status: string;
    data: {
        _id: string;
        userId: string;
        name: string;
        ships: [
            {
                shipId: string;
                shipName: string;
                _id: string;
            },
        ];
        company: {
            name: string;
            companyType: string;
            address: string;
            bankName: string;
            bankAccountName: string;
            bankAccountNumber: number;
            documentCompany: [
                {
                    documentName: string;
                    documentUrl: string;
                    _id: string;
                },
            ];
            imageUrl: string;
            isVerified: boolean;
            isRejected: boolean;
        };
    };
};

export type submitProposalRequest = {
    offeredPrice: number;
    note: string;
};

export type GetDynamicInputRFQByIdRFQ = {
    status: string;
    data: DynamicInputRFQByIdResponse;
};

export type DynamicInputRFQByIdResponse = {
    dynamicInput: DynamicInputRFQById;
    required: boolean;
    option?: [
        {
            value: string;
        },
    ];
    validation?: ValidationForm;
    _id: string | String;
};

export type DynamicInputRFQById = {
    _id: string | String;
    formType: string | String;
    templateType: string | String;
    inputType: string | String;
    label: string | String;
    fieldName: string | String;
    fieldType: string | String;
    placeholder: string | String;
    active: boolean;
};

export type ActiveDynamicInputOwnerRequest = {
    _id: string | String;
};

export type TransactionNego = {
    ship: {
        shipId: {
            size: {
                length: number;
                width: number;
                height: number;
            };
            _id: string;
            name: string;
            imageUrl: string;
            shipDocuments: {
                documentName: string;
                documentUrl: string;
                _id: string;
            }[];
        };
        shipOwnerId: {
            _id: string;
            name: string;
        };
    };
    _id: string;
    rentalId: string;
    renterId: {
        _id: string;
        name: string;
    };
    rentalDuration: number;
    rentalStartDate: string;
    rentalEndDate: string;
    proposal: {
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
        offeredPrice: number;
    }[];
    status: {
        name: string;
        desc: string;
        date: string;
        isOpened: boolean;
        _id: string;
    }[];
    shipRentType: string;
    createdAt: string;
    updatedAt: string;
    offeredPrice: number;
};

export type getTransactionNegoResponse = {
    status: string;
    data: TransactionNego;
};

export type sendContractNegoResponse = {
    ship: string;
    renter: string;
    shipOwner: string;
    draftContract: string;
    isAccepted: boolean;
    _id: string;
    otherDoc?: {
        documentName: string;
        documentUrl: string;
        _id: string;
    }[];
    createAt: string;
    updateAt: string;
    __v: number;
};

export type sendContractNego = {
    status: string;
    newProposal: sendContractNegoResponse;
};

export type getTransactionNegoOwnerResponse = {
    status: string;
    data: TransactionNego;
};

export type Company = {
    name: string;
    companyType: string;
    address: string;
    documentCompany: {
        documentName: string;
        documentUrl: string;
        _id: string;
    }[];

    imageUrl: string;
    isRejected: boolean;
    isVerified: boolean;
};

export type UserInfo = {
    _id: string;
    roles: string;
    shipOwnerId?: {
        company: Company;
        _id: string;
        name: string;
    };
    renterId?: {
        company: Company;
        _id: string;
        name: string;
    };
};

export type GetCompanies = {
    status: string;
    data: UserInfo[];
};

export type TransactionPaymentAccount = {
    name: string;
    companyType: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: number;
};

export type GetPaymentAccountTransactionResponse = {
    status: string;
    data: TransactionPaymentAccount;
};

export type Payment = {
    _id: string;
    paymentId: string;
    receiptUrl?: string;
    paymentApproved?: boolean;
    paymentExpiredDate?: Date;
    paymentReminded: { reminderDate: string }[];
    createdAt: Date;
};

export type GetPaymentHistoryResponse = {
    status: string;
    data: {
        _id: string;
        shipRentType: string;
        payment: Payment[];
    }[];
};

export type UpdateFirebaseTokenRequest = {
    token: string;
};

export type UpdateShipTrackingResponse = {
    status: String;
};

export type UpdateShipTrackingRequest = {
    rentalId: string | String;
    status: string;
    date: string;
    time: string;
};

export type AddReviewRequest = {
    shipId: string | String;
    rate: Number;
    review: String;
};

export type AddReviewResponse = {
    status: String;
};
