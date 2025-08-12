import firebaseAdmin from './firebaseAdmin';

const bucket = firebaseAdmin.storage().bucket();

export const uploadFile = async (res, file) => {
    if (!bucket) {
        return res.status(404).json({ error: 'Bucket not found' });
    }
    try {
        const uploadedFile = bucket.file(file.originalname);
        await uploadedFile.save(file.buffer, {
            contentType: file.mimetype,
            public: true,
        });

        const [imageUrl] = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: '02-08-2030',
            queryParams: { param: new Date().getTime().toString() },
        });
        return imageUrl;
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error });
    }
};

export const deleteFile = async imageUrl => {
    try {
        // Mendapatkan path file dari URL
        const url = new URL(imageUrl);
        const fileName = decodeURIComponent(url.pathname.split('/').pop());

        // Menghapus file dari Firebase Storage
        const file = bucket.file(fileName);

        await file.delete();

        return true;
    } catch (error) {
        // console.log('Error when deleting files', error);
        if (error.code === 404) {
            return true;
        }
        return false;
    }
};
