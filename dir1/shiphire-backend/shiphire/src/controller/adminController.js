import DynamicInput from '../models/DynamicInput';
import Ship from '../models/Ship';
import ShipHistory from '../models/ShipHistory';
import ShipOwner from '../models/ShipOwner';
import Renter from '../models/Renter';
import Transaction from '../models/Transaction';
import User from '../models/User';
import DynamicForm from './../models/DynamicForm';
import _ from 'lodash';
import verifyToken from '../middleware/verifyToken';
import Admin from '../models/Admin';

export const getAddShipDynamicForm = async (req, res) => {
    try {
        const dynamicForm = await DynamicForm.findOne({
            formType: 'addShipForm',
        }).populate({
            path: 'dynamicForms.dynamicInput',
            model: DynamicInput,
        });

        if (!dynamicForm) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Form not found' });
        }

        res.status(200).json({ status: 'success', data: dynamicForm });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getAllUserTransaction = async (req, res) => {
    try {
        const { page, limit, query } = req.query;

        const transactions = await Transaction.aggregate([
            {
                $lookup: {
                    from: 'shipowners',
                    localField: 'ship.shipOwnerId',
                    foreignField: '_id',
                    as: 'ownerDetails',
                },
            },
            {
                $unwind: {
                    path: '$ownerDetails',
                },
            },
            {
                $lookup: {
                    from: 'ships',
                    localField: 'ship.shipId',
                    foreignField: '_id',
                    as: 'ship',
                },
            },
            {
                $unwind: '$ship',
            },
            {
                $match: {
                    $or: [
                        {
                            'ship.name': {
                                $regex:
                                    query !== 'undefined' ? `^${query}` : '',
                                $options: 'i',
                            },
                        },
                        {
                            'ownerDetails.company.name': {
                                $regex:
                                    query !== 'undefined' ? `^${query}` : '',
                                $options: 'i',
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    'ship.desc': 0,
                    'ship.tags': 0,
                    'ship.shipDocuments': 0,
                    'ship.pricePerMonth': 0,
                    'ship.facilities': 0,
                    'ship.specifications': 0,
                    'ship.rating': 0,
                    'ship.totalRentalCount': 0,
                    'ship.__v': 0,
                },
            },
            {
                $project: {
                    'ownerDetails.name': 0,
                    'ownerDetails.userId': 0,
                    'ownerDetails.ships': 0,
                    'ownerDetails.company.address': 0,
                    'ownerDetails.company.companyType': 0,
                    'ownerDetails.company.bankName': 0,
                    'ownerDetails.company.bankAccountName': 0,
                    'ownerDetails.company.bankAccountNumber': 0,
                    'ownerDetails.company.documentCompany': 0,
                    'ownerDetails.company.imageUrl': 0,
                },
            },
            {
                $lookup: {
                    from: 'shipcategories',
                    localField: 'ship.category',
                    foreignField: '_id',
                    as: 'ship.category',
                },
            },
            {
                $unwind: '$ship.category',
            },
            {
                $project: {
                    'ship.category.__v': 0,
                },
            },
        ])
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            status: 'success',
            data: transactions,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: 'Terjadi kesalahan dalam pencarian transaksi.',
        });
    }
};

export const getListUser = async (req, res) => {
    try {
        const userData = await User.find(
            {},
            {
                _id: 1,
                name: 1,
                email: 1,
                phoneNumber: 1,
                roles: 1,
                isActive: 1,
                isVerified: 1,
                isPhoneVerified: 1,
                googleId: 1,
                appleId: 1,
            },
        )
            .sort({ isPhoneVerified: 0 })
            .populate({
                path: 'renterId',
                strictPopulate: false,
                select: ['company.name', 'company.address'],
            })
            .populate({
                path: 'shipOwnerId',
                strictPopulate: false,
                select: ['company.name', 'company.address'],
            });

        if (!userData) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Form not found' });
        }

        res.status(200).json({ status: 'success', data: userData });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const activateUser = async (req, res) => {
    try {
        const { _id, isActive } = req.body;
        const userData = await User.findOneAndUpdate(
            { _id },
            { isActive },
            {
                projection: {
                    isActive: 1,
                },
                new: true,
            },
        );

        res.status(200).json({ status: 'success', data: userData });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const verifyUserMobilePhone = async (req, res) => {
    const { _id, isPhoneVerified } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { _id },
            { isPhoneVerified },
            {
                projection: {
                    isPhoneVerified: 1,
                },
                new: true,
            },
        );

        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getAllUsersWithUnverifiedPhoneNumber = async (req, res) => {
    try {
        const data = await User.find({ isPhoneVerified: 0 });

        if (data.length <= 0) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No user found' });
        }

        res.status(200).json({ status: 'fail', data: data });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const shipApproved = async (req, res) => {
    const { _id } = req.body;

    try {
        const ship = await Ship.findOne({ _id });

        if (!ship) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }

        ship.shipApproved = true;

        await ship.save();

        // console.log(ship)
        res.status(200).json({
            status: 'success',
            message: 'Ship has been approved',
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const unapproveShip = async (req, res) => {
    const { _id } = req.body;

    try {
        const ship = await Ship.findOne({ _id });

        if (!ship) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }

        ship.shipApproved = false;

        await ship.save();

        res.status(200).json({
            status: 'success',
            message: 'Ship has been unapproved',
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const approveDeleteShipHistory = async (req, res) => {
    const { id } = req.body;
    try {
        const shipHistory = await ShipHistory.findOne({ _id: id });

        if (!shipHistory) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No ship history found' });
        }

        if (shipHistory.deleteStatus === 'pending') {
            shipHistory.deleteStatus = 'approved';

            const updatedShipHistory = await shipHistory.save();

            return res.status(200).json({
                status: 'success',
                data: updatedShipHistory,
            });
        } else {
            return res.status(400).json({
                status: 'fail',
                message: 'Ship history status is not pending',
            });
        }
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};
export const getDynamicInputByTemplateName = async (req, res) => {
    const { templateName } = req.params;
    try {
        const addShipDynamicForm = await DynamicForm.aggregate([
            {
                $unwind: {
                    path: '$dynamicForms',
                    includeArrayIndex: 'string',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'dynamicinputs',
                    localField: 'dynamicForms.dynamicInput',
                    foreignField: '_id',
                    as: 'dynamicForms.dynamicInput',
                },
            },
            {
                $unwind: {
                    path: '$dynamicForms.dynamicInput',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    formType: 'addShipForm',
                    'dynamicForms.dynamicInput.templateType': templateName,
                },
            },
            {
                $sort: {
                    'dynamicForms.dynamicInput.order': 1,
                },
            },
            {
                $project: {
                    _id: '$dynamicForms.dynamicInput._id',
                    formType: '$dynamicForms.dynamicInput.formType',
                    templateType: '$dynamicForms.dynamicInput.templateType',
                    inputType: '$dynamicForms.dynamicInput.inputType',
                    label: '$dynamicForms.dynamicInput.label',
                    placeholder: '$dynamicForms.dynamicInput.placeholder',
                    expired: '$dynamicForms.dynamicInput.docExpired',
                    active: '$dynamicForms.dynamicInput.active',
                    order: '$dynamicForms.dynamicInput.order',
                    unit: '$dynamicForms.dynamicInput.unit',
                    required: '$dynamicForms.required',
                    option: '$dynamicForms.option',
                    validate: '$dynamicForms.validation',
                },
            },
        ]);

        res.status(200).json({ status: 'success', data: addShipDynamicForm });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getShipSpects = async (req, res) => {
    try {
        const shipSpects = await DynamicInput.distinct('templateType', {
            $or: [
                { templateType: /Spesific\b$/i },
                { templateType: 'spesificAddShip' },
            ],
        });
        const spesification = shipSpects.map(item => {
            const value = _.startCase(_.camelCase(item));
            return { templateType: item, value };
        });
        console.log(spesification);
        res.status(200).json({ status: 'success', data: spesification });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

const InputTypes = [
    { inputType: 'textInput', type: 'string' },
    { inputType: 'numericInput', type: 'number' },
    { inputType: 'selectDropDown', type: 'arrayOfString' },
    { inputType: 'imageSelect', type: 'image' },
    { inputType: 'docSelect', type: 'document' },
    { inputType: 'datePickerCalendar', type: 'string' },
    { inputType: 'datePicker', type: 'date' },
    { inputType: 'radioDropdown', type: 'string' },
];

export const addDynamicInputAddShip = async (req, res) => {
    const {
        label,
        inputType,
        required,
        unit,
        templateName,
        option,
        min,
        max,
        multiline,
        expired,
    } = req.body;
    try {
        const regexPattern = new RegExp(label, 'i');
        const labelNotUnique = await DynamicInput.findOne({
            templateType: templateName,
            label: { $regex: regexPattern },
        });
        if (labelNotUnique) {
            return res.status(400).json({
                status: 'fail',
                message: 'Label already exists',
            });
        }
        let order = 1;
        let camelTemplateName = _.camelCase(templateName);
        const existsTemplateType = await DynamicInput.findOne({
            templateType: camelTemplateName,
        }).sort({ order: -1 });

        if (!existsTemplateType) {
            camelTemplateName = `${camelTemplateName}Spesific`;
        } else {
            order = existsTemplateType.order + 1;
        }

        const fieldName = _.camelCase(label);
        const fieldType = InputTypes.filter(
            item => item.inputType === inputType,
        );
        parseInt(min, 10);
        parseInt(max, 10);
        let placeholder;
        if (
            inputType === 'textInput' ||
            inputType === 'selectDropDown' ||
            inputType === 'radioDropDown' ||
            inputType === 'datePickerCalendar'
        ) {
            placeholder = `Enter your ${label}`;
        }
        const addDynamicInput = new DynamicInput({
            label,
            fieldName,
            placeholder,
            inputType,
            formType: 'addShipForm',
            fieldType: fieldType[0].type,
            templateType: camelTemplateName,
            unit,
            docExpired: expired || undefined,
            order,
        });
        const savedDynamicInput = await addDynamicInput.save();
        let validation;
        if (min || multiline || max) {
            console.log(multiline);
            validation = {
                min,
                multiline,
                max,
            };
        }
        const updateDynamicForm = await DynamicForm.findOne({
            formType: 'addShipForm',
        });
        if (!updateDynamicForm) {
            const dynamicForm = new DynamicForm({
                formType: 'addShipForm',
                dynamicForms: [],
            });
            await dynamicForm.save();
            dynamicForm.addDynamicInput(
                savedDynamicInput._id,
                required,
                option,
                validation,
            );
            await dynamicForm.save();
        } else {
            updateDynamicForm.addDynamicInput(
                savedDynamicInput._id,
                required,
                option,
                validation,
            );
            await updateDynamicForm.save();
        }

        res.status(200).json({
            status: 'success',
            data: { templateType: camelTemplateName },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const editDynamicInputAddShip = async (req, res) => {
    const { id } = req.params;
    const {
        label,
        inputType,
        required,
        unit = '',
        option = [],
        min,
        max,
        multiline,
        expired,
    } = req.body;
    try {
        console.log(expired);
        const oldInput = await DynamicInput.findOne({ _id: id });
        if (label !== oldInput.label) {
            const regexPattern = new RegExp(label, 'i');
            const labelNotUnique = await DynamicInput.findOne({
                templateType: oldInput.templateType,
                label: { $regex: regexPattern },
            });
            if (labelNotUnique) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Label already exists',
                });
            }
        }
        const fieldName = _.camelCase(label);
        const fieldType = InputTypes.filter(
            item => item.inputType === inputType,
        );
        let validation = {};
        if (min || multiline || max) {
            parseInt(min, 10);
            parseInt(max, 10);
            validation = {
                min,
                multiline,
                max,
            };
        }
        let placeholder;
        if (
            inputType === 'textInput' ||
            inputType === 'selectDropDown' ||
            inputType === 'radioDropDown' ||
            inputType === 'datePickerCalendar'
        ) {
            placeholder = `Enter your ${label}`;
        }
        await DynamicInput.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    label,
                    fieldName,
                    placeholder,
                    inputType,
                    formType: 'addShipForm',
                    fieldType: fieldType[0].type,
                    unit,
                    docExpired: expired !== undefined ? expired : false,
                },
            },
            { new: true },
        );
        await DynamicForm.findOneAndUpdate(
            {
                formType: 'addShipForm',
                dynamicForms: {
                    $elemMatch: {
                        dynamicInput: id,
                    },
                },
            },
            {
                $set: {
                    'dynamicForms.$.required': required,
                    'dynamicForms.$.option': option,
                    'dynamicForms.$.validation': validation,
                },
            },
            { new: true },
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const activateDynamicInput = async (req, res) => {
    const { id, isActive } = req.body;
    try {
        await DynamicInput.findOneAndUpdate({ _id: id }, { active: isActive });

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const deleteSpecificCategories = async (req, res) => {
    const { templateType } = req.body;
    try {
        await DynamicInput.deleteMany({
            templateType,
        });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const deleteItemDropdownDynamicInput = async (req, res) => {
    const { id } = req.body;
    try {
        await DynamicInput.findByIdAndDelete({
            _id: id,
        });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const addDynamicInputDropDownItem = async (req, res) => {
    const { label, inputType, unit, templateName } = req.body;
    try {
        let order = 50;
        const getCurrentOrder = await DynamicInput.findOne({
            templateType: templateName,
        }).sort({ order: -1 });
        if (getCurrentOrder) {
            order = getCurrentOrder.order + 1;
        }
        const fieldName = _.camelCase(label);
        const fieldType = InputTypes.filter(
            item => item.inputType === inputType,
        );
        let placeholder;
        if (inputType === 'textInput') {
            placeholder = `Enter your ${label}`;
        }
        const addDynamicInput = new DynamicInput({
            label,
            fieldName,
            placeholder,
            inputType,
            formType: 'addShipForm',
            fieldType: fieldType[0].type,
            templateType: templateName,
            unit,
            order,
        });
        const savedDynamicInput = await addDynamicInput.save();

        res.status(200).json({
            status: 'success',
            data: savedDynamicInput._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const addDynamicInputRfqForm = async (req, res) => {
    const {
        formType,
        templateType,
        inputType,
        label,
        unit,
        option,
        min,
        multiline,
        order,
        required,
    } = req.body;

    try {
        const regexPattern = new RegExp(label, 'i');
        const labelNotUnique = await DynamicInput.findOne({
            templateType,
            label: { $regex: regexPattern },
        });

        // Check if the label exists in 'defaultRfq' when adding to other template types
        if (templateType !== 'defaultRfq') {
            const labelExistsInDefaultRfq = await DynamicInput.findOne({
                templateType: 'defaultRfq',
                label: { $regex: regexPattern },
            });

            if (labelExistsInDefaultRfq) {
                return res.status(400).json({
                    status: 'fail',
                    message: `Label exists in defaultRfq template type`,
                });
            }
        }

        // Check if the label exists in other template types when adding to 'defaultRfq'
        if (templateType === 'defaultRfq') {
            const labelExistsInOtherTemplate = await DynamicInput.findOne({
                templateType: { $ne: 'defaultRfq' }, // Exclude 'defaultRfq'
                label: { $regex: regexPattern },
            });

            if (labelExistsInOtherTemplate) {
                return res.status(400).json({
                    status: 'fail',
                    message: `Label exists in ${labelExistsInOtherTemplate.templateType} template type`,
                });
            }
        }

        const fieldName = _.camelCase(label);
        const fieldType = InputTypes.filter(
            item => item.inputType === inputType,
        );
        let placeholder;
        if (
            inputType === 'textInput' ||
            inputType === 'selectDropDown' ||
            inputType === 'radioDropDown' ||
            inputType === 'datePickerCalendar'
        ) {
            placeholder = `Enter your ${label}`;
        }

        const newDynamicInput = new DynamicInput({
            formType,
            templateType,
            inputType,
            label,
            fieldName,
            fieldType: fieldType[0].type,
            placeholder,
            unit,
            order,
        });

        const savedDynamicInput = await newDynamicInput.save();

        // Fetch the dynamic form based on templateType
        const dynamicForm = await DynamicForm.findOne({
            formType,
            templateType:
                templateType === 'defaultRfq' ? 'defaultRfq' : templateType,
        });

        let validation;
        if (min || multiline) {
            validation = {
                min,
                multiline,
            };
        }

        // Add the new dynamic input to the dynamic form
        dynamicForm.dynamicForms.push({
            dynamicInput: savedDynamicInput._id,
            required,
            option,
            validation,
        });

        // Save the updated dynamic form to the database
        await dynamicForm.save();

        // If the templateType is "default," update other dynamic forms
        if (templateType === 'defaultRfq') {
            const otherDynamicForms = await DynamicForm.find({
                formType,
                templateType: { $ne: 'defaultRfq' },
            });

            for (const otherForm of otherDynamicForms) {
                otherForm.dynamicForms.push({
                    dynamicInput: savedDynamicInput._id,
                    required,
                    option,
                    validation,
                });

                await otherForm.save();
            }
        }

        res.status(200).json({
            status: 'success',
            data: dynamicForm,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const getDynamicInputRFQByTemplateType = async (req, res) => {
    const { templateType } = req.params;

    try {
        const dynamicInput = await DynamicForm.findOne({
            formType: 'rfqForm',
            templateType,
        }).populate({
            path: 'dynamicForms.dynamicInput',
            model: DynamicInput,
        });

        console.log(dynamicInput);
        if (!dynamicInput) {
            return res.status(404).json({
                status: 'fail',
                message: 'Dynamic input not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: dynamicInput,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const createTemplateRFQForm = async (req, res) => {
    try {
        // Extract form type and template type from the request body or parameters
        const { templateType } = req.body;

        // Check if the templateType is set to "default"
        if (templateType === 'defaultRfq') {
            // Fetch the default dynamic inputs
            const defaultDynamicInputs = await DynamicInput.find({
                templateType: 'defaultRfq',
            });

            // Create a new dynamic form using the default dynamic inputs
            const dynamicForm = new DynamicForm({
                formType: 'rfqForm',
                templateType,
                dynamicForms: defaultDynamicInputs.map(input => ({
                    dynamicInput: input._id,
                    required: true, // Set your desired default value
                    option: [], // Set your desired default value
                    validation: {}, // Set your desired default value
                })),
            });

            // Save the dynamic form to the database
            const savedDynamicForm = await dynamicForm.save();

            // Update the Ship documents with the new RFQ dynamic form
            await Ship.updateMany(
                {},
                { $set: { rfqDynamicForm: savedDynamicForm._id } },
            );

            return res.status(201).json({
                status: 'success',
                data: savedDynamicForm,
            });
        }

        // If templateType is not "default", fetch the default dynamic forms
        let defaultDynamicForms = await DynamicForm.findOne({
            templateType: 'defaultRfq',
        });

        // If default dynamic forms do not exist, create an empty template
        if (!defaultDynamicForms) {
            defaultDynamicForms = { dynamicForms: [] };
        }

        // Use the default dynamic forms for the new dynamic form
        const dynamicForm = new DynamicForm({
            formType: 'rfqForm',
            templateType,
            dynamicForms: defaultDynamicForms.dynamicForms.map(form => ({
                dynamicInput: form.dynamicInput,
                required: true, // Set your desired default value
                option: [], // Set your desired default value
                validation: {}, // Set your desired default value
            })),
        });

        // Save the dynamic form to the database
        const savedDynamicForm = await dynamicForm.save();

        res.status(201).json({
            status: 'success',
            data: savedDynamicForm,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const getAllTemplateRFQForms = async (req, res) => {
    try {
        // Fetch dynamic forms with formType 'rfqForm' or 'defaultRfqForm'
        const templateRFQForms = await DynamicForm.find({
            formType: { $in: ['rfqForm', 'defaultRfqForm'] },
            shipId: { $exists: false },
        }).populate({
            path: 'dynamicForms.dynamicInput',
            model: DynamicInput,
        });

        // Check if template RFQ forms are found
        if (!templateRFQForms || templateRFQForms.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: [],
            });
        }

        res.status(200).json({
            status: 'success',
            data: templateRFQForms,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const activeDynamicInputRFQ = async (req, res) => {
    const { id } = req.body;
    try {
        const dynamicInput = await DynamicInput.findById(id);

        if (!dynamicInput) {
            return res.status(404).json({
                status: 'fail',
                message: 'Dynamic input not found',
            });
        }

        // Memperoleh nilai terakhir dan mengganti nilainya
        const existingValue = dynamicInput.active;
        await DynamicInput.findOneAndUpdate(
            { _id: id },
            { $set: { active: !existingValue } },
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const editDynamicInputRfqForm = async (req, res) => {
    const { id } = req.params;
    const {
        formType,
        templateType,
        inputType,
        label,
        unit,
        option,
        min,
        multiline,
        order,
        required,
    } = req.body;

    try {
        const oldInput = await DynamicInput.findOne({ _id: id });

        if (label !== oldInput.label) {
            // Check if the new label already exists in any template type
            const labelExistsInOtherTemplate = await DynamicInput.findOne({
                _id: { $ne: id }, // Exclude the current input being edited
                label: { $regex: new RegExp(`^${label}$`, 'i') },
            });

            if (labelExistsInOtherTemplate) {
                return res.status(400).json({
                    status: 'fail',
                    message: `Label exists in ${labelExistsInOtherTemplate.templateType} template type`,
                });
            }

            if (oldInput.templateType === 'defaultRfq') {
                // Check if the label exists in 'defaultRfq' when editing to a new label
                const labelExistsInDefaultRfq = await DynamicInput.findOne({
                    templateType: 'defaultRfq',
                    label: { $regex: new RegExp(`^${label}$`, 'i') },
                });

                if (labelExistsInDefaultRfq) {
                    return res.status(400).json({
                        status: 'fail',
                        message:
                            'Label already exists in defaultRfq template type',
                    });
                }
            }
        }
        const updatedFields = {
            formType,
            templateType,
            inputType,
            label,
            unit,
            order,
        };

        const fieldType = InputTypes.filter(
            item => item.inputType === inputType,
        );

        let placeholder;
        if (
            inputType === 'textInput' ||
            inputType === 'selectDropDown' ||
            inputType === 'radioDropDown' ||
            inputType === 'datePickerCalendar'
        ) {
            placeholder = `Enter your ${label}`;
        }

        updatedFields.fieldName = _.camelCase(label);
        updatedFields.fieldType = fieldType[0].type;
        updatedFields.placeholder = placeholder;

        console.log('updatedFields', updatedFields);
        if (min || multiline) {
            updatedFields.validation = {
                min,
                multiline,
            };
        } else {
            updatedFields.validation = undefined;
        }

        await DynamicInput.findByIdAndUpdate({ _id: id }, updatedFields, {
            new: true,
        });

        // Fetch the dynamic form based on templateType
        const dynamicForm = await DynamicForm.findOne({
            formType,
            templateType:
                templateType === 'defaultRfq' ? 'defaultRfq' : templateType,
        });

        // Find the index of the dynamic input in the dynamic form
        const dynamicInputIndex = dynamicForm.dynamicForms.findIndex(
            form => form.dynamicInput.toString() === id,
        );

        // Update the dynamic input in the dynamic form
        dynamicForm.dynamicForms[dynamicInputIndex].required = required;
        dynamicForm.dynamicForms[dynamicInputIndex].option = option;
        dynamicForm.dynamicForms[dynamicInputIndex].validation = {
            min,
            multiline,
        };

        // Save the updated dynamic form to the database
        await dynamicForm.save();

        res.status(200).json({
            status: 'success',
            data: dynamicForm,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const getDynamicInputRFQById = async (req, res) => {
    const { id } = req.params;

    try {
        const dynamicInput = await DynamicForm.findOne({
            formType: 'rfqForm',
            'dynamicForms.dynamicInput': id,
        }).populate({
            path: 'dynamicForms.dynamicInput',
            model: DynamicInput,
        });

        console.log(dynamicInput);
        if (!dynamicInput) {
            return res.status(404).json({
                status: 'fail',
                message: 'Dynamic input not found',
            });
        }

        const dynamicInputIndex = dynamicInput.dynamicForms.findIndex(
            form => form.dynamicInput._id.toString() === id,
        );

        res.status(200).json({
            status: 'success',
            data: dynamicInput.dynamicForms[dynamicInputIndex],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};
export const getSelectDropDownInput = async (req, res) => {
    try {
        const { templateType } = req.params;
        const dropDownInput = await DynamicInput.find({
            templateType: `${templateType}Spec`,
        });
        res.status(200).json({
            status: 'success',
            data: dropDownInput,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const editAddShipInputOrder = async (req, res) => {
    try {
        const { data } = req.body;
        const getLatestOrder = await DynamicInput.findOne({
            templateType: 'spesificAddShip',
        }).sort({ order: -1 });
        const isTemplateSpesific = await DynamicInput.findOne({
            _id: data[0]._id,
            templateType: { $regex: /Spesific/i },
        });
        let currentIteration = getLatestOrder.order;
        data.forEach(async item => {
            if (isTemplateSpesific) {
                currentIteration = currentIteration + 1;
                item.order = currentIteration;
            }
            await DynamicInput.findOneAndUpdate(
                { _id: item._id },
                { $set: { order: item.order } },
            );
        });
        res.status(200).json({
            status: 'success',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const activeDynamicFormRFQ = async (req, res) => {
    const { id } = req.body;
    try {
        const dynamicForm = await DynamicForm.findById(id);

        if (!dynamicForm) {
            return res.status(404).json({
                status: 'fail',
                message: 'Dynamic form not found',
            });
        }

        // Memperoleh nilai terakhir dan mengganti nilainya
        const existingValue = dynamicForm.active;
        await DynamicForm.findOneAndUpdate(
            { _id: id },
            { $set: { active: !existingValue } },
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const activateCompany = async (req, res) => {
    const { id, role, verified } = req.body;
    try {
        let updatedCompany;
        if (role === 'shipOwner') {
            updatedCompany = await ShipOwner.findOneAndUpdate(
                { _id: id },
                {
                    $set: { 'company.isVerified': verified },
                },
            );
        } else {
            updatedCompany = await Renter.findOneAndUpdate(
                { _id: id },
                {
                    $set: { 'company.isVerified': verified },
                },
            );
        }
        if (!updatedCompany) {
            return res
                .status(500)
                .json({ status: 'fail', message: 'Failed verified data' });
        }
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const rejectCompany = async (req, res) => {
    const { id, role } = req.body;
    try {
        let updatedCompany;
        if (role === 'shipOwner') {
            updatedCompany = await ShipOwner.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        'company.isVerified': false,
                        'company.isRejected': true,
                    },
                },
            );
        } else {
            updatedCompany = await Renter.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        'company.isVerified': false,
                        'company.isRejected': true,
                    },
                },
            );
        }
        if (!updatedCompany) {
            return res
                .status(500)
                .json({ status: 'fail', message: 'Failed rejected company' });
        }
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const companyList = async (req, res) => {
    try {
        const companies = await User.find(
            {
                roles: { $ne: 'user' },
            },
            { roles: 1 },
        )
            .populate({
                path: 'renterId',
                strictPopulate: false,
                match: {
                    'company.name': { $exists: true },
                },
                select: ['company', 'name'],
            })
            .populate({
                path: 'shipOwnerId',
                strictPopulate: false,
                match: {
                    'company.name': { $exists: true },
                },
                select: ['company', 'name'],
            });
        const arrCompany = companies.filter(item => {
            return item.renterId !== null && item.shipOwnerId !== null;
        });
        res.status(200).json({ status: 'success', data: arrCompany });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const updateFirebaseToken = async (req, res) => {
    const { _id } = req.admin;
    const { token } = req.body;

    try {
        const admin = await Admin.findOne({
            $or: [
                {_id: _id}
            ]
        })

        await admin.updateOne({
            fcmToken: token
        })

        return res.status(200).json({ status: 'success' });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error.message });
    }
};
