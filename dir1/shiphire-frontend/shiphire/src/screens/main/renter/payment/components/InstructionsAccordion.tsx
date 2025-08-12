import { ListItem } from '@rneui/base';
import React from 'react';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';
import { useTranslation } from 'react-i18next';
import { InstructionsAccordionProps } from '../../../../../types';

const InstructionsAccordion: React.FC<InstructionsAccordionProps> = ({
    testID,
}) => {
    const [listmBankExpanded, setListmBankExpanded] =
        React.useState<boolean>(false);
    const [listiBankExpanded, setListiBankExpanded] =
        React.useState<boolean>(false);
    const [listATMExpanded, setListATMExpanded] =
        React.useState<boolean>(false);
    const { t } = useTranslation('payment');

    let instructionsAccordion: string[] | undefined = testID;
    if (instructionsAccordion !== undefined) {
        console.log(instructionsAccordion);
    }
    return (
        <>
            <ListItem.Accordion
                testID={instructionsAccordion?.[0]}
                content={
                    <CustomText
                        fontFamily="bold"
                        fontSize="md"
                        color="primaryColor">
                        {t('InstructionsAccordion.textMBanking')}
                    </CustomText>
                }
                containerStyle={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: Color.bgNeutralColor,
                    borderRadius: 6,
                    padding: 16,
                    alignItems: 'center',
                }}
                isExpanded={listmBankExpanded}
                onPress={() => {
                    setListmBankExpanded(!listmBankExpanded);
                    setListiBankExpanded(false);
                    setListATMExpanded(false);
                }}>
                <View
                    flex
                    row
                    spread
                    style={{
                        backgroundColor: Color.bgNeutralColor,
                        borderBottomEndRadius: 6,
                        borderBottomStartRadius: 6,
                        top: -28,
                        marginBottom: -28,
                        padding: 16,
                    }}>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {t('InstructionsAccordion.textInstruction')}
                    </CustomText>
                </View>
            </ListItem.Accordion>
            <ListItem.Accordion
                testID={instructionsAccordion?.[1]}
                content={
                    <CustomText
                        fontFamily="bold"
                        fontSize="md"
                        color="primaryColor">
                        {t('InstructionsAccordion.textIBanking')}
                    </CustomText>
                }
                containerStyle={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: Color.bgNeutralColor,
                    borderRadius: 6,
                    padding: 16,
                    alignItems: 'center',
                }}
                isExpanded={listiBankExpanded}
                onPress={() => {
                    setListiBankExpanded(!listiBankExpanded);
                    setListATMExpanded(false);
                    setListmBankExpanded(false);
                }}>
                <View
                    flex
                    row
                    spread
                    style={{
                        backgroundColor: Color.bgNeutralColor,
                        borderBottomEndRadius: 6,
                        borderBottomStartRadius: 6,
                        top: -28,
                        marginBottom: -28,
                        padding: 16,
                    }}>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {t('InstructionsAccordion.textInstruction')}
                    </CustomText>
                </View>
            </ListItem.Accordion>
            <ListItem.Accordion
                testID={instructionsAccordion?.[2]}
                content={
                    <CustomText
                        fontFamily="bold"
                        fontSize="md"
                        color="primaryColor">
                        {t('InstructionsAccordion.textATM')}
                    </CustomText>
                }
                containerStyle={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: Color.bgNeutralColor,
                    borderRadius: 6,
                    padding: 16,
                    alignItems: 'center',
                }}
                isExpanded={listATMExpanded}
                onPress={() => {
                    setListATMExpanded(!listATMExpanded);
                    setListmBankExpanded(false);
                    setListiBankExpanded(false);
                }}>
                <View
                    testID="instructions-accordion-content"
                    flex
                    row
                    spread
                    style={{
                        backgroundColor: Color.bgNeutralColor,
                        borderBottomEndRadius: 6,
                        borderBottomStartRadius: 6,
                        top: -28,
                        padding: 16,
                    }}>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {t('InstructionsAccordion.textInstruction')}
                    </CustomText>
                </View>
            </ListItem.Accordion>
        </>
    );
};

export default InstructionsAccordion;
