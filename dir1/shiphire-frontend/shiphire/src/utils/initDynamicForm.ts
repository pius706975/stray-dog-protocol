import * as yup from 'yup';
import { DynamicFormType } from '../types';

const initDynamicForm = (
    setDynamicInitialValue: React.Dispatch<any>,
    setDynamicValidationSchema: React.Dispatch<any>,
    data: DynamicFormType[],
) => {
    let initialValue: any = {};
    let validationSchema: any = {};

    for (const key of data) {
        if (key.dynamicInput.fieldType === 'string') {
            initialValue[key.dynamicInput.fieldName] = '';
            if (!key.required) {
                validationSchema[key.dynamicInput.fieldName] = yup.string();
            } else {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .string()
                    .required(`${key.dynamicInput.label} is required`);
            }
        } else if (key.dynamicInput.fieldType === 'number') {
            initialValue[key.dynamicInput.fieldName] = 0;
            if (key.validation?.min && key.validation?.max && key.required) {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .number()
                    .required(`${key.dynamicInput.label} is required`)
                    .min(
                        key.validation?.min,
                        `${key.dynamicInput.label} must be at least ${key.validation?.min}`,
                    )
                    .max(
                        key.validation?.max,
                        `${key.dynamicInput.label} must be ${key.validation?.max} or less`,
                    );
            } else if (key.validation?.min && key.required) {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .number()
                    .required(`${key.dynamicInput.label} is required`)
                    .min(
                        key.validation?.min,
                        `${key.dynamicInput.label} must be at least ${key.validation?.min}`,
                    );
            } else if (key.validation?.max && key.required) {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .number()
                    .required(`${key.dynamicInput.label} is required`)
                    .max(
                        key.validation?.max,
                        `${key.dynamicInput.label} must be ${key.validation?.max} or less`,
                    );
            } else if (key.required) {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .number()
                    .required(`${key.dynamicInput.label} is required`);
            } else {
                validationSchema[key.dynamicInput.fieldName] = yup.number();
            }
        } else if (key.dynamicInput.fieldType === 'date') {
            initialValue[key.dynamicInput.fieldName] = new Date();
            if (key.required) {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .date()
                    .required(`${key.dynamicInput.label} is required`);
            } else {
                validationSchema[key.dynamicInput.fieldName] = yup.date();
            }
        } else if (key.dynamicInput.fieldType === 'arrayOfString') {
            initialValue[key.dynamicInput.fieldName] = [];
            if (key.required && key.validation?.min) {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .array()
                    .of(yup.string())
                    .min(
                        key.validation?.min,
                        `${key.dynamicInput.label} must be at least ${key.validation?.min}`,
                    )
                    .required(`${key.dynamicInput.label} is required`);
            } else if (key.required) {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .array()
                    .of(yup.string())
                    .required(`${key.dynamicInput.label} is required`);
            } else {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .array()
                    .of(yup.string());
            }
        } else if (key.dynamicInput.fieldType === 'document') {
            initialValue[key.dynamicInput.fieldName] = {};
            if (key.required) {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .mixed()
                    .required(`${key.dynamicInput.label} is required`);
            } else {
                validationSchema[key.dynamicInput.fieldName] = yup.mixed();
            }
        } else if (key.dynamicInput.fieldType === 'image') {
            initialValue[key.dynamicInput.fieldName] = {};
            if (key.required) {
                validationSchema[key.dynamicInput.fieldName] = yup
                    .mixed()
                    .required(`${key.dynamicInput.label} is required`);
            } else {
                validationSchema[key.dynamicInput.fieldName] = yup.mixed();
            }
        }
    }

    const validationSchemaObject = {};
    for (const key in validationSchema) {
        if (validationSchema.hasOwnProperty(key)) {
            validationSchemaObject[key] = validationSchema[key];
        }
    }

    const formattedScheme = yup.object().shape(validationSchemaObject);

    return (
        setDynamicInitialValue(initialValue),
        setDynamicValidationSchema(formattedScheme)
    );
};

export default initDynamicForm;
