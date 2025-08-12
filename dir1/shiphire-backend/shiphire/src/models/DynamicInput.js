import mongoose from 'mongoose';

const dynamicInput = new mongoose.Schema({
    formType: {
        type: String,
        enum: ['rfqForm', 'addShipForm', 'defaultRfqForm'],
        default: 'rfqForm',
        required: true,
    },
    templateType: {
        type: String,
        required: true,
    },
    inputType: {
        type: String,
        enum: [
            'textInput',
            'numericInput',
            'datePicker',
            'radioDropdown',
            'selectDropDown',
            'docSelect',
            'imageSelect',
            'datePickerCalendar',
        ],
        default: 'textInput',
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    fieldName: {
        type: String,
        required: true,
    },
    fieldType: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
    },
    unit: {
        type: String,
    },
    docExpired: {
        type: Boolean,
    },
    active: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        required: false,
    },
});

const DynamicInput = mongoose.model('DynamicInput', dynamicInput);

export default DynamicInput;
