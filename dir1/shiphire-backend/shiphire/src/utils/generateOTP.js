export const generateOTP = length => {
    const characters =
        '3291837291837219831279874928174921847921873219837219832719';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
    }
    return otp;
};
