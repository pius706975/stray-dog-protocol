export const parseStringToDate = dateString => {
    const dateParts = dateString.split(' '); // Memisahkan tanggal, bulan, dan tahun

    // Menentukan bulan dalam bentuk angka berdasarkan nama bulan
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const monthIndex = monthNames.indexOf(dateParts[1]);

    // Membuat objek Date
    const formattedDate = new Date(dateParts[2], monthIndex, dateParts[0]);

    return formattedDate;
};

export const parseDateToString = date => {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'Juli',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
};
