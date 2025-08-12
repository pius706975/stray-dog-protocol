const getOwnerStatusText = (status: string, t) => {
    if (status === 'rfq 1') {
        return t('OwnerStatusText.rfq 1');
    } else if (status === 'rfq 2') {
        return t('OwnerStatusText.rfq 2');
    } else if (status === 'proposal 1') {
        return t('OwnerStatusText.proposal 1');
    } else if (status === 'proposal 2') {
        return t('OwnerStatusText.proposal 2');
    } else if (status === 'proposal 3') {
        return t('OwnerStatusText.proposal 3');
    } else if (status === 'proposal 4') {
        return t('OwnerStatusText.proposal 4');
    } else if (status === 'contract 1') {
        return t('OwnerStatusText.contract 1');
    } else if (status === 'contract 2') {
        return t('OwnerStatusText.contract 2');
    } else if (status === 'payment 1') {
        return t('OwnerStatusText.payment 1');
    } else if (status === 'payment 2') {
        return t('OwnerStatusText.payment 2');
    } else if (status === 'payment 3') {
        return t('OwnerStatusText.payment 3');
    } else if (status === 'sailing 1') {
        return t('OwnerStatusText.sailing 1');
    } else if (status === 'sailing 2') {
        return t('OwnerStatusText.sailing 2');
    } else if (status === 'sailing 3') {
        return t('OwnerStatusText.sailing 3');
    } else if (status === 'sailing 4') {
        return t('OwnerStatusText.sailing 4');
    } else if (status === 'complete') {
        return t('OwnerStatusText.complete');
    }

    return 'Unknown Status';
};

export default getOwnerStatusText;
