import DynamicForm from '../models/DynamicForm';
import DynamicInput from '../models/DynamicInput';
import Ship from '../models/Ship';
import ShipCategory from '../models/ShipCategory';
import ShipHistory from '../models/ShipHistory';
import firebaseAdmin from '../utils/firebaseAdmin';
import { deleteFile } from '../utils/firebaseService';
import { findCoordinate } from '../utils/googleMaps';

export const getAllShip = async (req, res) => {
    try {
        const ship = await Ship.find()
            .populate('category')
            .populate('shipOwnerId');

        if (ship.length === 0) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Ship not found' });
        }

        res.status(200).json({ status: 'success', data: ship });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getTopRatedShips = async (req, res) => {
    try {
        const topRatedShips = await Ship.find({ rating: { $gte: 4 } })
            .sort({ rating: -1 })
            .limit(10)
            .populate('category', 'name');

        if (topRatedShips.length === 0) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No top-rated ships found' });
        }

        // const totalRate = topRatedShips
        // console.log(totalRate);

        res.status(200).json({ status: 'success', data: topRatedShips });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getPopularShips = async (req, res) => {
    try {
        const ships = await Ship.find()
            .sort({ totalRentalCount: -1 })
            .limit(10)
            .populate('category');

        if (ships.length === 0) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No popular ships found' });
        }

        res.status(200).json({ status: 'success', data: ships });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getShipCategories = async (req, res) => {
    try {
        const categories = await ShipCategory.find();

        if (categories.length === 0) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No categories found' });
        }

        res.status(200).json({ status: 'success', data: categories });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getShipbyId = async (req, res) => {
    const { id } = req.params;
    try {
        const ship = await Ship.findOne({ _id: id })
            .populate({
                path: 'facilities',
                select: 'name desc -_id',
            })
            .populate({
                path: 'specifications',
                select: 'name value -_id',
            })
            .populate({
                path: 'specifications.spesificationId',
                select: 'units -_id',
            })
            .populate({
                path: 'category',
            })
            .populate('shipOwnerId', 'company');

        if (!ship) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No ship found' });
        }

        const shipHistory = await ShipHistory.find({ shipId: id }).sort({
            rentStartDate: 1,
        });

        const totalRate = ship.rating.reduce((sum, rating) => sum + rating.rate, 0)
        const averageRate = Math.round(totalRate / ship.rating.length)

        const shipWithHistory = {
            ...ship._doc,
            averageRate,
            shipHistory,
        };

        // console.log('rate average: ', averageRate)
        // console.log(ship.rating);

        res.status(200).json({
            status: 'success',
            data: shipWithHistory,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getCoordinate = async (req, res) => {
    const {latitude, longitude} = req.query

    try {
        const foundLocation = await findCoordinate(latitude, longitude)

        res.status(200).json({status: 'success', data: foundLocation})
    } catch (error) {
        res.status(500).json({status: 'fail', message: error.message})
    }
}

export const getSearchShip = async (req, res) => {
    const { searchTerm, province, city, category, inputRentEndDate, inputRentStartDate, latitude, longitude } =
    req.query;

    try {
        let shipWithinCoordinate = [];
        let otherShips = [];

        const prioritizedFilters = searchTerm || province || city || category || inputRentEndDate || inputRentStartDate

        // get ship by coordinate
        if (latitude && longitude && !prioritizedFilters) {
            const {province: provinceCoodinate, city: cityCoordinate} = await findCoordinate(latitude, longitude);
            const filterProvince = provinceCoodinate ? {province: new RegExp(provinceCoodinate, 'i')} : null;
            const filterCity = cityCoordinate ? {city: new RegExp(cityCoordinate, 'i')} : null;

            shipWithinCoordinate = await Ship.aggregate([
                {
                    $match: {
                        ...(filterProvince && filterProvince),
                        ...(filterCity && filterCity)
                    }
                },
                
                {
                    $lookup: {
                        from: 'shipowners',
                        localField: 'shipOwnerId',
                        foreignField: '_id',
                        as: 'shipowners'
                    }
                },

                {
                    $unwind: {
                        path: '$shipowners',
                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $lookup: {
                        from: 'shipcategories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category',
                    },
                },

                {
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: 'shiphistories',
                        localField: '_id',
                        foreignField: 'shipId',
                        as: 'shiphistories',
                    }
                },

                { 
                    $unwind: { 
                        path: '$shiphistories', 
                        preserveNullAndEmptyArrays: true 
                    } 
                },
                
                {
                    $project: {
                        imageUrl: 1,
                        name: 1,
                        companyName: '$shipowners.company.name',
                        categories: '$category.name',
                        province: 1,
                        city: 1,
                        pricePerMonth: 1,
                        rating: 1,
                        rentStartDate: '$shiphistories.rentStartDate',
                        rentEndDate: '$shiphistories.rentEndDate',
                        shipApproved: 1,
                        totalRentalCount: 1,
                    }
                },
                
                { 
                    $match: { 
                        shipApproved: true 
                    } 
                },
                
                {
                    $group: {
                        _id: '$_id',
                        imageUrl: { $first: '$imageUrl' },
                        name: { $first: '$name' },
                        companyName: { $first: '$companyName' },
                        categories: { $first: '$categories' },
                        province: { $first: '$province' },
                        city: { $first: '$city' },
                        pricePerMonth: { $first: '$pricePerMonth' },
                        rating: { $first: '$rating' },
                        rentStartDate: { $first: '$rentStartDate' },
                        rentEndDate: { $first: '$rentEndDate' },
                        totalRentalCount: { $first: '$totalRentalCount' },
                    }
                },

                {
                    $project: {
                        imageUrl: 1,
                        name: 1,
                        companyName: 1,
                        categories: 1,
                        province: 1,
                        city: 1,
                        pricePerMonth: 1,
                        rating: 1,
                        rentStartDate: 1,
                        rentEndDate: 1,
                        totalRentalCount: 1,
                    },
                },
            ]);
        };

        const defaultFilter = searchTerm
            ? {
                  $match: {
                      $or: [
                          {
                              name: new RegExp(searchTerm, 'i'),
                          },
                          {
                              companyName: new RegExp(searchTerm, 'i'),
                          },
                      ],
                  },
              }
            : { $match: {} };
        
        const filterProvince = province ? {
            $match: {
                province: new RegExp(province, 'i')
            }
        } : {$match: {}}

        const filterCity = city ? {
            $match: {
                city: new RegExp(city, 'i')
            }
        } : {$match: {}}

        const filterCategory = category
            ? {
                  $match: {
                      $and: [{ categories: new RegExp(category, 'i') }],
                  },
              }
            : { $match: {} };

        const filterDate = inputRentStartDate
            ? {
                  $match: {
                      $and: [
                          {
                              $or: [
                                  {
                                      $and: [
                                          {
                                              rentStartDate: {
                                                  $lt: new Date(
                                                      inputRentStartDate,
                                                  ),
                                              },
                                          },
                                          {
                                              rentEndDate: {
                                                  $lt: new Date(
                                                      inputRentStartDate,
                                                  ),
                                              },
                                          },
                                      ],
                                  },
                                  {
                                      rentStartDate: null,
                                  },
                              ],
                          },
                      ],
                  },
              }
            : { $match: {} };

        const filterDateEnd = inputRentEndDate
            ? {
                  $match: {
                      $or: [
                          {
                              $and: [
                                  {
                                      rentStartDate: {
                                          $gt: new Date(inputRentEndDate),
                                      },
                                  },
                                  {
                                      rentEndDate: {
                                          $gt: new Date(inputRentEndDate),
                                      },
                                  },
                              ],
                          },
                          {
                              rentEndDate: null,
                          },
                      ],
                  },
              }
            : { $match: {} };

        const pipeline = await Ship.aggregate([
            {
                $lookup: {
                    from: 'shipowners',
                    localField: 'shipOwnerId',
                    foreignField: '_id',
                    as: 'shipowners',
                },
            },
            {
                $unwind: {
                    path: '$shipowners',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'shipcategories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'shiphistories',
                    localField: '_id',
                    foreignField: 'shipId',
                    as: 'shiphistories',
                },
            },
            {
                $unwind: {
                    path: '$shiphistories',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    imageUrl: 1,
                    name: 1,
                    companyName: '$shipowners.company.name',
                    categories: '$category.name',
                    province: 1,
                    city: 1,
                    pricePerMonth: 1,
                    rating: 1,
                    rentStartDate: '$shiphistories.rentStartDate',
                    rentEndDate: '$shiphistories.rentEndDate',
                    shipApproved: 1,
                    totalRentalCount: 1,
                },
            },
            {
                $match: {
                    shipApproved: true,
                },
                
            },
            filterCategory,
            filterProvince,
            filterCity,
            filterDate,
            filterDateEnd,
            defaultFilter,
            {
                $group: {
                    _id: '$_id',
                    imageUrl: { $first: '$imageUrl' },
                    name: { $first: '$name' },
                    companyName: { $first: '$companyName' },
                    categories: { $first: '$categories' },
                    province: {$first: '$province'},
                    city: {$first: '$city'},
                    pricePerMonth: { $first: '$pricePerMonth' },
                    rating: { $first: '$rating' },
                    rentStartDate: { $first: '$rentStartDate' },
                    rentEndDate: { $first: '$rentEndDate' },
                    totalRentalCount: { $first: '$totalRentalCount' },
                },
            },
            {
                $project: {
                    imageUrl: 1,
                    name: 1,
                    companyName: 1,
                    categories: 1,
                    province: 1,
                    city: 1,
                    pricePerMonth: 1,
                    rating: 1,
                    rentStartDate: 1,
                    rentEndDate: 1,
                    totalRentalCount: 1,
                },
            },
        ]);
        
        if (latitude && longitude && !prioritizedFilters) {
            const coordinate = shipWithinCoordinate.map(ship => ship._id.toString());
            otherShips = pipeline.filter(ship => !coordinate.includes(ship._id.toString()));
        } else {
            otherShips = pipeline;
        }

        const responseData = shipWithinCoordinate.concat(otherShips)

        res.status(200).json({ status: 'success', data: responseData });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

export const getShipRFQForm = async (req, res) => {
    const { id } = req.params;
    try {
        const dynamicForm = await DynamicForm.findOne({ _id: id }).populate({
            path: 'dynamicForms.dynamicInput',
            model: DynamicInput,
        });

        if (!dynamicForm) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No dynamic form found' });
        }

        res.status(200).json({ status: 'success', data: dynamicForm });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const deleteShipHistory = async (req, res) => {
    const { id } = req.body;
    try {
        const shipHistory = await ShipHistory.findOne({ _id: id });

        if (!shipHistory) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No ship history found' });
        }

        if (shipHistory.deleteStatus === 'undefined') {
            shipHistory.deleteStatus = 'pending';
        }

        await shipHistory.save();

        res.status(200).json({ status: 'success', data: shipHistory });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const getAllShipHistoryPending = async (req, res) => {
    try {
        const shipHistory = await ShipHistory.find({
            deleteStatus: 'pending',
        }).populate('shipId');

        if (!shipHistory) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No ship history found' });
        }

        res.status(200).json({ status: 'success', data: shipHistory });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const editShipHistory = async (req, res) => {
    const {
        price,
        rentStartDate,
        rentEndDate,
        locationDestination,
        locationDeparture,
        shipId,
    } = req.body;
    const { id } = req.params;
    const files = req.files;
    const bucket = firebaseAdmin.storage().bucket();
    if (!bucket) {
        return res
            .status(404)
            .json({ status: 'fail', message: 'Bucket not found' });
    }
    try {
        const shipHistory = await ShipHistory.findOne({ _id: id });
        const uploadedDocuments = [];
        if (!shipHistory) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'No ship history found' });
        }
        if (shipHistory.genericDocument.length > 0) {
            shipHistory.genericDocument.forEach(async item => {
                const isFileDeleted = await deleteFile(item.fileUrl);
                if (!isFileDeleted) {
                    return res.status(500).json({
                        status: 'fail',
                        message: 'Error Deleting file on firebase',
                    });
                }
            });
        }
        if (files.length > 0) {
            for (const file of files) {
                console.log(file.originalname);
                const uploadedFile = bucket.file(file.originalname);

                await uploadedFile.save(file.buffer, {
                    contentType: file.mimetype,
                    public: true,
                });

                const [docUrl] = await uploadedFile.getSignedUrl({
                    action: 'read',
                    expires: '02-08-2030',
                });
                uploadedDocuments.push({
                    fileName: file.originalname,
                    fileUrl: docUrl,
                });
            }
        }

        const startDate = new Date(rentStartDate);
        const endDate = new Date(rentEndDate);

        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
        await ShipHistory.findOneAndUpdate(
            { _id: id },
            {
                price,
                rentStartDate: startDate,
                rentEndDate: endDate,
                locationDestination,
                locationDeparture,
                genericDocument: uploadedDocuments,
            },
            { new: true },
        );
        const shipHistories = await ShipHistory.find({ shipId });
        res.status(200).json({ status: 'success', data: shipHistories });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const addShipRFQForm = async (req, res) => {
    const { shipId, dynamicFormId } = req.body;

    try {
        // Check if the dynamic form exists
        const dynamicForm = await DynamicForm.findOne({ _id: dynamicFormId });

        if (!dynamicForm) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'Dynamic form not found' });
        }

        const updatedShip = await Ship.findOneAndUpdate(
            { _id: shipId },
            { rfqDynamicForm: dynamicFormId },
            { new: true },
        );

        res.status(201).json({
            status: 'success',
            data: updatedShip,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};
