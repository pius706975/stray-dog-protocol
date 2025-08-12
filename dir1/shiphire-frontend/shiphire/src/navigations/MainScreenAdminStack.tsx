import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Color, FontFamily } from '../configs';
import { MainAdminStackParamList } from '../types';
import MainScreenAdminTabNav from './MainScreenAdminTabNav';
import { DetailTransaction } from '../screens/main/admin/detailTransaction';
import {
    ShipHistoryDelete,
    RFQInputForm,
    AdminDocumentPreview,
    RFQFormInputManagement,
    RFQTemplateManagement,
    UserManagement,
    EditRFQInputForm,
} from '../screens/main/admin';
import { UserDetail } from '../screens/main/admin/userDetail';
import { ManageTransaction } from '../screens/main/admin/manageTransaction';
import { ChangeLanguage } from '../screens';
import { useTranslation } from 'react-i18next';
import { ShipManagement } from '../screens/main/admin/shipManagement';
import { DetailShipAdmin } from '../screens/main/admin/detailShipAdmin';
import { DocumentShipPreview } from '../screens/main/admin/documentShipPreview';
import { AddShipManagement } from '../screens/main/admin/addShipDynamicForm/addShipManagement';
import { AddShipInputManagement } from '../screens/main/admin/addShipDynamicForm/addShipInputManagement';
import { AddShipInputForm } from '../screens/main/admin/addShipDynamicForm/addShipInputForm';
import { AddRfqTemplate } from '../screens/main/admin/rfqDynamicForm/addRfqTemplate';
import { AddShipSpecificInfo } from '../screens/main/admin/addShipDynamicForm/addShipSpecificInfo';
import { AddShipInputEditForm } from '../screens/main/admin/addShipDynamicForm/addShipInputEditForm';
import { CompanyManagement } from '../screens/main/admin/companyManagement';
import { CompanyDetail } from '../screens/main/admin/companyDetail';

const MainAdminStack = createNativeStackNavigator<MainAdminStackParamList>();

const MainScreenAdminStack = () => {
    const { t } = useTranslation('common');

    const screens: {
        name: keyof MainAdminStackParamList;
        title: string;
        component: any;
        headerShown?: boolean;
    }[] = [
        {
            name: 'DetailTransaction',
            title: 'Detail Transaction',
            component: DetailTransaction,
        },
        {
            name: 'AdminDocumentPreview',
            title: 'Document Preview',
            component: AdminDocumentPreview,
        },
        {
            name: 'UserDetail',
            title: 'Detail User',
            component: UserDetail,
        },
        {
            name: 'UserManagement',
            title: 'User Management',
            component: UserManagement,
        },
        {
            name: 'ManageTransaction',
            title: 'Manage Transaction',
            component: ManageTransaction,
        },
        {
            name: 'ChangeLanguage',
            title: t('MainScreenStack.titleChangeLanguage'),
            component: ChangeLanguage,
        },
        {
            name: 'ShipManagement',
            title: 'Ship Management',
            component: ShipManagement,
        },
        {
            name: 'DetailShipAdmin',
            title: 'Detail Ship',
            component: DetailShipAdmin,
        },
        {
            name: 'DocumentShipPreview',
            title: 'Document Ship',
            component: DocumentShipPreview,
        },
        {
            name: 'ShipHistoryDelete',
            title: 'Ship History Delete Approval',
            component: ShipHistoryDelete,
        },
        {
            name: 'RFQTemplateManagement',
            title: 'RFQ Template Management',
            component: RFQTemplateManagement,
        },
        {
            name: 'RFQFormInputManagement',
            title: 'RFQ Input Management',
            component: RFQFormInputManagement,
        },
        {
            name: 'RFQInputForm',
            title: 'Add New Dynamic Input RFQ',
            component: RFQInputForm,
        },
        {
            name: 'AddShipManagement',
            title: 'Form Management',
            component: AddShipManagement,
        },
        {
            name: 'AddShipInputManagement',
            title: 'Input Management',
            component: AddShipInputManagement,
        },
        {
            name: 'AddShipInputForm',
            title: 'Add Dynamic Input',
            component: AddShipInputForm,
        },
        {
            name: 'AddRfqTemplate',
            title: 'Add New RFQ Template',
            component: AddRfqTemplate,
        },
        {
            name: 'EditRFQInputForm',
            title: 'Edit RFQ Input Form',
            component: EditRFQInputForm,
        },
        {
            name: 'AddShipSpecificInfo',
            title: 'Specification Ship',
            component: AddShipSpecificInfo,
        },
        {
            name: 'AddShipInputEditForm',
            title: 'Edit Dynamic Input',
            component: AddShipInputEditForm,
        },
        {
            name: 'CompanyManagement',
            title: 'Manage Company',
            component: CompanyManagement,
        },
        {
            name: 'CompanyDetail',
            title: 'Detail Company',
            component: CompanyDetail,
        },
    ];

    return (
        <MainAdminStack.Navigator screenOptions={{ headerShown: false }}>
            <MainAdminStack.Screen
                name="AdminHome"
                component={MainScreenAdminTabNav}
            />
            {screens.map(screen => (
                <MainAdminStack.Screen
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
        </MainAdminStack.Navigator>
    );
};

export default MainScreenAdminStack;
