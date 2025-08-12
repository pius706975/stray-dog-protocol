import Status from '../models/Status';
import ShipFacilityCategory from '../models/ShipFacilityCategory';
import ShipCategory from '../models/ShipCategory';
import ShipFacility from '../models/ShipFacility';
import ShipSpecification from '../models/ShipSpecification';
import DynamicForm from '../models/DynamicForm';
import DynamicInput from '../models/DynamicInput';

export const submitStatus = async (req, res) => {
    const { name, desc } = req.body;

    try {
        const statusAdded = new Status({
            name,
            desc,
        });

        await statusAdded.save();

        res.status(200).json({ status: 'success', data: statusAdded });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const addFacilityCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const facilityCategoryAdded = new ShipFacilityCategory({
            name,
        });

        await facilityCategoryAdded.save();

        res.status(200).json({
            status: 'success',
            data: facilityCategoryAdded,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const addFacility = async (req, res) => {
    const { name, shipCategory, facilityCategory } = req.body;

    try {
        const facilityCategoryId = await ShipFacilityCategory.findOne({
            name: facilityCategory,
        }).select('_id');

        const shipCategoryId = await ShipCategory.findOne({
            name: shipCategory,
        }).select('_id');

        const facilityAdded = new ShipFacility({
            name,
            shipCategory: shipCategoryId,
            facilityCategory: facilityCategoryId,
        });

        await facilityAdded.save();

        res.status(200).json({ status: 'success', data: facilityAdded });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const addShipSpesification = async (req, res) => {
    const { name, shipCategory, units } = req.body;

    try {
        const shipCategoryId = await ShipCategory.findOne({
            name: shipCategory,
        }).select('_id');

        const shipSpecificationAdded = new ShipSpecification({
            name,
            units,
            shipCategory: shipCategoryId,
        });

        await shipSpecificationAdded.save();

        res.status(200).json({
            status: 'success',
            data: shipSpecificationAdded,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
        console.log(error);
    }
};

export const getShipFacilityByShipType = async (req, res) => {
    const { shipType } = req.params;
    try {
        const shipCategoryId = await ShipCategory.findOne({
            name: shipType,
        }).select('_id');

        if (!shipCategoryId) {
            return res.status(404).json({
                status: 'fail',
                message: 'Ship Category not found',
            });
        }

        const shipFacility = await ShipFacility.find({
            shipCategory: shipCategoryId,
        }).select('name');

        res.status(200).json({ status: 'success', data: shipFacility });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getShipSpesificationByShipType = async (req, res) => {
    const { shipType } = req.params;
    try {
        const shipCategoryId = await ShipCategory.findOne({
            name: shipType,
        }).select('_id');

        if (!shipCategoryId) {
            return res.status(404).json({
                status: 'fail',
                message: 'Ship Category not found',
            });
        }

        const shipSpecification = await ShipSpecification.find({
            shipCategory: shipCategoryId,
        })
            .select('name')
            .select('units');

        res.status(200).json({ status: 'success', data: shipSpecification });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getShipLocations = async (_req, res) => {
    try {
        const dynamicInputId = await DynamicInput.findOne({
            fieldName: 'shipLocation',
            templateType: 'generalAddShip',
            formType: 'addShipForm',
        }).select('_id');

        if (!dynamicInputId) {
            return res.status(404).json({
                status: 'fail',
                message: 'Dynamic Input not found',
            });
        }

        const dynamicFormsLocations = await DynamicForm.findOne(
            {
                formType: 'addShipForm',
                'dynamicForms.dynamicInput': dynamicInputId,
            },
            {
                'dynamicForms.$': 1,
            },
        );

        const locations =
            dynamicFormsLocations?.dynamicForms?.length > 0
                ? dynamicFormsLocations?.dynamicForms[0]?.option
                : [];

        res.status(200).json({ status: 'success', data: locations });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};