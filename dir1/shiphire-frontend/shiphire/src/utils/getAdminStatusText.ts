const getOwnerStatusText = (status: string) => {
    if (status === 'rfq 1') {
        return 'RFQ Not Accepted Yet';
    } else if (status === 'rfq 2') {
        return 'Waiting Proposal';
    } else if (status === 'proposal 1') {
        return 'Proposal Sent';
    } else if (status === 'proposal 2') {
        return 'Waiting Contract';
    } else if (status === 'contract 1') {
        return 'Contract sent';
    } else if (status === 'payment 1') {
        return 'Waiting Payment';
    } else if (status === 'payment 2') {
        return 'Waiting Payment approval';
    } else if (status === 'complete') {
        return 'Transaction Complete';
    }

    return 'Unknown Status';
};

export default getOwnerStatusText;
