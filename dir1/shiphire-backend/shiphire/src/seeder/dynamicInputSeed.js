import DynamicInput from '../models/DynamicInput';

const dynamicInputs = [
    {
        formType: 'rfqForm',
        templateType: 'defaultRfq',
        inputType: 'textInput',
        label: 'Needs',
        fieldName: 'needs',
        fieldType: 'string',
        placeholder: 'Ex: for transporting',
    },
    {
        formType: 'rfqForm',
        templateType: 'bargeRfq',
        inputType: 'textInput',
        label: 'Commodity',
        fieldName: 'commodity',
        fieldType: 'string',
        placeholder: 'Ex: coal, sand, etc',
    },
    {
        formType: 'rfqForm',
        templateType: 'bargeRfq',
        inputType: 'numericInput',
        label: 'Tonnage',
        fieldName: 'tonnage',
        fieldType: 'number',
        unit: 'Tons',
    },
    {
        formType: 'rfqForm',
        templateType: 'bargeRfq',
        inputType: 'textInput',
        label: 'Load Address',
        fieldName: 'loadAddress',
        fieldType: 'string',
        placeholder: 'Ex: Palu, Sulawesi Tengah',
    },
    {
        formType: 'rfqForm',
        templateType: 'bargeRfq',
        inputType: 'textInput',
        label: 'Unloading Address',
        fieldName: 'unloadingAddress',
        fieldType: 'string',
        placeholder: 'Ex: Surabaya, Jawa Timur',
    },
    {
        formType: 'rfqForm',
        templateType: 'defaultRfq',
        inputType: 'datePickerCalendar',
        label: 'Rental Date',
        fieldName: 'rentalDate',
        fieldType: 'string',
        placeholder: 'Select date',
    },
    {
        formType: 'rfqForm',
        templateType: 'defaultRfq',
        inputType: 'textInput',
        label: 'Additional Information',
        fieldName: 'additionalInformation',
        fieldType: 'string',
        placeholder: 'Ex: Additioal Crew, etc',
    },
];

export const seedDynamicInput = async () => {
    try {
        for (const dynamicInput of dynamicInputs) {
            const newDynamicInput = new DynamicInput({
                formType: dynamicInput.formType,
                inputType: dynamicInput.inputType,
                label: dynamicInput.label,
                fieldName: dynamicInput.fieldName,
                fieldType: dynamicInput.fieldType,
                placeholder: dynamicInput.placeholder,
                unit: dynamicInput.unit,
            });

            await newDynamicInput.save();
        }
    } catch (error) {
        console.error(`Error seeding proposals:`, error);
    }
};
