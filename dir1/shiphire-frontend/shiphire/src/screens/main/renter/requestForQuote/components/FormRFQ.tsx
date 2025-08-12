import { FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native-ui-lib';
import { CustomText, DynamicForm } from '../../../../../components';
import { Color, RentIcon } from '../../../../../configs';
import { FormRFQProps } from '../../../../../types';
import { generateRFQDocument } from '../../../../../utils';
import { useTranslation } from 'react-i18next';

const FormRFQ: React.FC<FormRFQProps> = ({
    navigation,
    categoryId,
    shipId,
    shipOwnerId,
    userData,
    companyData,
    shipCompany,
    shipCategory,
    renterCompanyAddress,
    dynamicForms,
}) => {
    const { t } = useTranslation('common');
    const filterDynamicForm = dynamicForms.filter(
        item => item.dynamicInput.active === true,
    );
    console.log('filterDynamicForm', dynamicForms);

    const handleForm = async (
        values: any,
        formikHelpers: FormikHelpers<any>,
    ) => {
        const dateSplit = values.rentalDate.split(' to ');
        const startDate = moment(dateSplit[0], 'DD MMM YYYY');
        const endDate = moment(dateSplit[1], 'DD MMM YYYY');
        const daysInRange = endDate.diff(startDate, 'days');

        await generateRFQDocument(
            values,
            dynamicForms,
            userData,
            companyData,
            daysInRange,
            shipCategory,
            shipCompany,
            renterCompanyAddress,
        );
        navigation.navigate('DocPreview', {
            categoryId,
            shipId,
            shipOwnerId,
            rentalDuration: daysInRange,
            rentalDate: values.rentalDate,
            needs: values.needs,
            locationDeparture: values.locationDeparture,
            locationDestination: values.locationDestination,
            shipRentType: values.shipRentType,
        });
    };

    return (
        <View br20 padding-16 backgroundColor={Color.bgNeutralColor}>
            <View
                row
                style={{
                    borderBottomWidth: 0.4,
                    paddingBottom: 16,
                    gap: 16,
                    alignItems: 'center',
                }}>
                <RentIcon />
                <CustomText
                    color="primaryColor"
                    fontFamily="bold"
                    fontSize="xl">
                    {t('RfqForm.titleRfqForm')}
                </CustomText>
            </View>
            <CustomText
                color="darkTextColor"
                fontFamily="regular"
                fontSize="lg">
                {t('RfqForm.descRfqForm')} :{' '}
            </CustomText>
            <DynamicForm
                data={filterDynamicForm}
                btnTitle={t('RfqForm.btnContinue')}
                onSubmit={handleForm}
                shipId={shipId}
            />
        </View>
    );
};

export default FormRFQ;
