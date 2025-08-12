import { useSubmitContract } from './../hooks/useShipOwner';
import { useSelector } from 'react-redux';
// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';
export * from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import DocumentPicker, {
    DocumentPickerResponse,
} from 'react-native-document-picker';

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');

    Reanimated.default.call = () => {};

    return Reanimated;
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-image-crop-picker', () => {
    openPicker: jest.fn(() => Promise.resolve({ path: 'path' }));
});

jest.mock('react-native-document-picker', () => {
    picker: jest.fn(() => Promise.resolve({ path: 'path' }));
});

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
}));

Object.defineProperty(window, 'FormData', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        append: jest.fn(),
    })),
});

const mockStatusCodes = {
    SIGN_IN_CANCELLED: 'mock_SIGN_IN_CANCELLED',
    IN_PROGRESS: 'mock_IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'mock_PLAY_SERVICES_NOT_AVAILABLE',
    SIGN_IN_REQUIRED: 'mock_SIGN_IN_REQUIRED',
};

jest.mock('@react-native-google-signin/google-signin', () => ({
    statusCodes: mockStatusCodes,
}));

jest.mock('@react-native-firebase/auth', () => ({
    GoogleAuthProvider: {
        credential: jest.fn().mockReturnValue('123'),
    },
}));

jest.mock('@notifee/react-native', () => {});
jest.mock('@react-native-firebase/messaging', () => {});

let mockDocumentPickerResolve = true;
const setMockDocumentPickerResolve = (value: boolean) => {
    mockDocumentPickerResolve = value;
};
jest.mock('react-native-document-picker', () => ({
    pick: jest.fn(() => {
        if (mockDocumentPickerResolve) {
            return Promise.resolve([{ uri: 'dummy.pdf', name: 'dummy.pdf' }]);
        } else {
            return Promise.reject(new Error('Error selecting PDF'));
        }
    }),
    types: {
        pdf: 'application/pdf',
    },
}));

let mockImagePickerResolve = true;
const setMockImagePickerResolve = (value: boolean) => {
    mockImagePickerResolve = value;
};
jest.mock('react-native-image-crop-picker', () => ({
    openPicker: jest.fn(() => {
        if (mockImagePickerResolve) {
            return Promise.resolve([{ uri: 'dummy.jpg', name: 'dummy.jpg' }]);
        } else {
            return Promise.reject(new Error('Error selecting Image'));
        }
    }),
    types: {
        pdf: 'application/pdf',
    },
}));

let mockImagePickerPathResolve = true;
const setMockImagePickerPathResolve = (value: boolean) => {
    mockImagePickerPathResolve = value;
};
jest.mock('react-native-image-crop-picker', () => ({
    openPicker: jest.fn(() => {
        if (mockImagePickerPathResolve) {
            return Promise.resolve([{ 
                creationDate: '1522437259',
                cropRect: null,
                data: null,
                duration: null,
                exif: null,
                filename: 'IMG_0006.HEIC',
                height: 3024,
                localIdentifier: 'CC95F08C-88C3-4012-9D6D-64A413D254B3/L0/001',
                mime: 'image/heic',
                modificationDate: '1530944178',
                path: '/Users/tabrezakhlaque/Library/Developer/CoreSimulator/Devices/3A21CC65-FCBF-4B7B-BE2C-87E18F17D6DC/data/Containers/Data/Application/C34290DF-2011-480C-9076-2B3CCFA8CD17/tmp/react-native-image-crop-picker/B02EB928-5871-4616-BA8F-05EF93037EB1.jpg',
                size: 2808983,
                sourceURL:
                    'file:///Users/tabrezakhlaque/Library/Developer/CoreSimulator/Devices/3A21CC65-FCBF-4B7B-BE2C-87E18F17D6DC/data/Media/DCIM/100APPLE/IMG_0006.HEIC',
                width: 4032,
             }]);
        } else {
            return Promise.reject(new Error('Error selecting Image'));
        }
    }),
    types: {
        image: 'image/jpg',
    },
}));

jest.mock('@gorhom/bottom-sheet', () => ({
    __esModule: true,
    ...require('@gorhom/bottom-sheet/mock'),
}));
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
    }),
}));

jest.useFakeTimers();

export { setMockDocumentPickerResolve, setMockImagePickerResolve, setMockImagePickerPathResolve };
