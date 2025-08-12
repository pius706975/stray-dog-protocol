import { useTranslation } from 'react-i18next';
import { StatusText } from '../configs';

const getStatusText = (status: string, t) => {
    if (status === 'rfq 1') {
        return t('StatusText.rfq 1');
    } else if (status === 'rfq 2') {
        return t('StatusText.rfq 2');
    } else if (status === 'proposal 1') {
        return t('StatusText.proposal 1');
    } else if (status === 'proposal 2') {
        return t('StatusText.proposal 2');
    } else if (status === 'proposal 3') {
        return t('StatusText.proposal 3');
    } else if (status === 'proposal 4') {
        return t('StatusText.proposal 4');
    } else if (status === 'contract 1') {
        return t('StatusText.contract 1');
    } else if (status === 'contract 1') {
        return t('StatusText.contract 1');
    } else if (status === 'contract 2') {
        return t('StatusText.contract 2');
    } else if (status === 'payment 1') {
        return t('StatusText.payment 1');
    } else if (status === 'payment 2') {
        return t('StatusText.payment 2');
    } else if (status === 'payment 3') {
        return t('StatusText.payment 3');
    } else if (status === 'sailing 1') {
        return t('StatusText.sailing 1');
    } else if (status === 'sailing 2') {
        return t('StatusText.sailing 2');
    } else if (status === 'sailing 3') {
        return t('StatusText.sailing 3');
    } else if (status === 'sailing 4') {
        return t('StatusText.sailing 4');
    } else if (status === 'complete') {
        return t('StatusText.complete');
    }

    return 'Status undefined';
};

export default getStatusText;
