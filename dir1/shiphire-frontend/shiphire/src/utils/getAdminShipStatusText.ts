const getAdminShipStatusText = (shipApproved: boolean) => {
    if (shipApproved === true) {
        return 'Ship has been approved';
    } else if (shipApproved === false) {
        return 'Ship has not been approved yet';
    }
    return 'Unknown Status';
};

export default getAdminShipStatusText;
