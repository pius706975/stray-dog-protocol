import User from '../models/User';
import Admin from '../models/Admin';
import Renter from '../models/Renter';
import ShipOwner from '../models/ShipOwner';
import bcrypt from 'bcrypt';

const saltOrRound = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('admin123', saltOrRound);

const users = [
    // new User({
    //     name: 'Fauzan',
    //     email: 'muhammadnurazismujiono@gmail.com',
    //     isVerified: true,
    //     isCompanySubmitted: true,
    //     phoneNumber: '6289690746351',
    //     googleId: '104129863137629600944',
    //     roles: 'shipOwner',
    //     shipOwnerId: '123',
    //     imageUrl:
    //         'https://lh3.googleusercontent.com/a/ACg8ocLyu-ggfv1OwsT8CPVy3Zs8vnI9wRXg2FfessREO6h6=s120',
    // }),
    new User({
        name: 'Fauzan',
        email: 'mfauzan120202@gmail.com',
        isVerified: true,
        isPhoneVerified: true,
        isCompanySubmitted: true,
        phoneNumber: '6289690746351',
        firebaseId: 'jIVxiVRGssQWnMzEzLLEeTOJC6y2',
        emailVerifOTP: 9729,
        roles: 'shipOwner',
        shipOwnerId: '123',
    }),
    new User({
        name: 'Azis',
        email: 'muhammadnurazismu@gmail.com',
        isVerified: true,
        isPhoneVerified: true,
        isCompanySubmitted: true,
        phoneNumber: '6285348371038',
        firebaseId: 'QWHrvHkbYrQCZ37PVH6PQwKAFE83',
        emailVerifOTP: 9229,
        roles: 'renter',
        renterId: '123',
    }),
    new Admin({
        roles: 'admin',
        name: 'Gabriel',
        email: 'admin@admin.user',
        password: hashedPassword,
        level: 'superadmin',
    }),
];

const ownerCompany = {
    name: 'Fauzan Company',
    companyType: 'PT',
    address: 'Jl. Raudah',
    bankName: 'BRI',
    bankAccountName: 'Fauzan Corp',
    bankAccountNumber: 123456789,
    isVerified: true,
    documentCompany: [
        {
            documentName: 'Fauzan Corp Business License',
            documentUrl:
                'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Business%20Document%20test%20company?generation=1695198267402692&alt=media',
        },
        {
            documentName: 'Fauzan Corp Deed of Establishment',
            documentUrl:
                'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Deed%20Document%20test%20company?generation=1695198269027762&alt=media',
        },
    ],
    imageUrl:
        'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20test%20company?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=16446988800&Signature=niYNtvjuQFzcv6D%2Bj2h9ULeB6zzFEKk12TYuRAZ4jgYIKAoxFhB0njXXxWiIXuDCb9CCvArAgeLAaXNC47b0XnpfkE7f8KXmy0qEse0Olr168n8TTyvskAm1BSQgtLLHRd7aWJvI75gd3Ia3igKkf43hI1ivqLaoaOSiHz8YSs%2BP1JGjwdgXBBwHQMZlNkokHPaazMyqYIlOdncp4VLjvYfp73JBzOVYfCbam69dr8Jyrn4d5pWT%2Bjqyek24kOJ%2BbvioKc6GyJtynFP7cgpjBASrvtYtkRjma2jwVd3qB80nx%2FopwTO6I3XWunpD9vxrZlt8d%2Fm%2BHhkjrhZd%2FiWL5w%3D%3D',
};

const renterCompany = {
    name: 'Azis Company',
    companyType: 'CV',
    address: 'Jl. Pramuka 6',
    documentCompany: [
        {
            documentName: 'Azis Corp Business License',
            documentUrl:
                'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Business%20Document%20test%20company?generation=1695198267402692&alt=media',
        },
        {
            documentName: 'Azis Corp Deed of Establishment',
            documentUrl:
                'https://storage.googleapis.com/download/storage/v1/b/shiphire-fdb0e.appspot.com/o/Deed%20Document%20test%20company?generation=1695198269027762&alt=media',
        },
    ],
    isVerified: true,
    imageUrl:
        'https://storage.googleapis.com/shiphire-fdb0e.appspot.com/Image%20test%20company?GoogleAccessId=firebase-adminsdk-y4yk5%40shiphire-fdb0e.iam.gserviceaccount.com&Expires=16446988800&Signature=niYNtvjuQFzcv6D%2Bj2h9ULeB6zzFEKk12TYuRAZ4jgYIKAoxFhB0njXXxWiIXuDCb9CCvArAgeLAaXNC47b0XnpfkE7f8KXmy0qEse0Olr168n8TTyvskAm1BSQgtLLHRd7aWJvI75gd3Ia3igKkf43hI1ivqLaoaOSiHz8YSs%2BP1JGjwdgXBBwHQMZlNkokHPaazMyqYIlOdncp4VLjvYfp73JBzOVYfCbam69dr8Jyrn4d5pWT%2Bjqyek24kOJ%2BbvioKc6GyJtynFP7cgpjBASrvtYtkRjma2jwVd3qB80nx%2FopwTO6I3XWunpD9vxrZlt8d%2Fm%2BHhkjrhZd%2FiWL5w%3D%3D',
};

const renterPreference = [
    'Reputation and Track Record',
    'Cargo Capacity',
    'Experience',
];

export const seedRolesToUsers = async () => {
    try {
        for (const userObj of users) {
            // const user = new User(userObj);

            if (userObj.roles === 'renter') {
                const renter = new Renter({
                    userId: userObj._id,
                    name: userObj.name,
                });
                userObj.renterId = renter._id;
                renter.save();
            } else if (userObj.roles === 'shipOwner') {
                const shipowner = new ShipOwner({
                    userId: userObj._id,
                    name: userObj.name,
                });
                userObj.shipOwnerId = shipowner._id;
                shipowner.save();
            } else if (userObj.roles === 'admin') {
                const admin = new Admin(userObj);
                await admin.save();
            }
            await userObj.save();
            await ShipOwner.findOneAndUpdate(
                {
                    userId: userObj._id,
                },
                {
                    company: {
                        name: ownerCompany.name,
                        companyType: ownerCompany.companyType,
                        address: ownerCompany.address,
                        bankName: ownerCompany.bankName,
                        bankAccountName: ownerCompany.bankAccountName,
                        bankAccountNumber: ownerCompany.bankAccountNumber,
                        documentCompany: ownerCompany.documentCompany,
                        imageUrl: ownerCompany.imageUrl,
                        isVerified: ownerCompany.isVerified,
                    },
                },
            );
            await Renter.findOneAndUpdate(
                {
                    userId: userObj._id,
                },
                {
                    renterPreference: renterPreference,
                    company: {
                        name: renterCompany.name,
                        companyType: renterCompany.companyType,
                        address: renterCompany.address,
                        documentCompany: renterCompany.documentCompany,
                        imageUrl: renterCompany.imageUrl,
                        isVerified: renterCompany.isVerified,
                    },
                },
            );

            console.log(
                `User ${userObj.name} saved successfully as ${
                    userObj.roles === undefined ? 'Admin' : userObj.roles
                }`,
            );
        }
        console.log('Seeding users completed');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};
