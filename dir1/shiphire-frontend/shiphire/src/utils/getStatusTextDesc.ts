const getStatusTextDesc = (status: string, t) => {
    if (status === 'RFQ sent') {
        return t('StatusDesc.rfqSent');
    } else if (status === 'RFQ accepted') {
        return t('StatusDesc.rfqAccept');
    } else if (status === 'Draft contract sent') {
        return t('StatusDesc.draftContractSent');
    } else if (status === 'Negotiate draft contract sent') {
        return t('StatusDesc.negotiateSent');
    } else if (status === 'Contract received') {
        return t('StatusDesc.contractReceived');
    } else if (status === 'Payment approved') {
        return t('StatusDesc.paymentApproved');
    }
    return;
};

export default getStatusTextDesc;
