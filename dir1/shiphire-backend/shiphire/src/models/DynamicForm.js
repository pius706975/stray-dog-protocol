import mongoose from 'mongoose';

const dynamicFormSchema = new mongoose.Schema(
    {
        formType: {
            type: String,
            enum: ['rfqForm', 'addShipForm', 'defaultRfqForm'],
            default: 'rfqForm',
            required: true,
        },
        shipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ship',
        },
        templateType: {
            type: String,
        },
        dynamicForms: [
            {
                dynamicInput: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'DynamicInput',
                },
                required: {
                    type: Boolean,
                    required: true,
                },
                option: [
                    {
                        value: {
                            type: String,
                        },
                    },
                ],
                validation: {
                    min: {
                        type: Number,
                    },
                    max: {
                        type: Number,
                    },
                    multiline: {
                        type: Boolean,
                    },
                },
            },
        ],
        active: {
            type: Boolean,
            default: true,
        },
        categories: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shipCategories',
        },
    },
    { timestamps: true },
);

dynamicFormSchema.methods.addDynamicInput = function (
    dynamicInput,
    required = false,
    option = [],
    validation,
) {
    this.dynamicForms.push({ dynamicInput, required, option, validation });
};
const DynamicForm = mongoose.model('DynamicForm', dynamicFormSchema);

export default DynamicForm;
