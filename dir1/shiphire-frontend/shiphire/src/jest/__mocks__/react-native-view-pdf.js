import React from 'react';

const MockedPDFView = jest.fn(({ onError }) => {
    // Simulate an error by calling the provided onError callback
    onError && onError(new Error('Simulated PDF loading error'));

    return <></>; // Render nothing for the purpose of this test
});

export default MockedPDFView;
