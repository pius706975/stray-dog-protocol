import express from 'express';
import mongoose from 'mongoose';
// import axios from 'axios';
import os from 'os';

export const healthRouter = express.Router();

healthRouter.get('/health-check', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        dbStatus: dbState === 1 ? 'up' : 'down'
    };

    // TO CHECK EXTERNAL SERVICES
    // let externalServiceStatus = 'down';
    // try {
    //     const response = await axios.get('http://example.com/health');
    //     if (response.status === 200) {
    //         externalServiceStatus = 'up';
    //     }
    // } catch (error) {
    //     console.error('Error connecting to external service:', error);
    // }

    // TO CHECK NETWORK CONNECTION
    const netInterfaces = os.networkInterfaces();
    let networkStatus = {};
    for (const interfaceName in netInterfaces) {
        const interfaceDetails = netInterfaces[interfaceName];
        const status = interfaceDetails.some(detail => detail.internal) ? 'up' : 'down';
        networkStatus[interfaceName] = { ...interfaceDetails, status };
    }

    // TO CHECK CUSTOM ENDPOINT
    // let customEndpointStatus = 'down';
    // try {
    //     const response = await axios.get('http://example.com/custom-endpoint');
    //     if (response.status === 200) {
    //         customEndpointStatus = 'up';
    //     }
    // } catch (error) {
    //     console.error('Error calling custom endpoint:', error);
    // }

    const healthCheckResponse = {
        database: dbStatus,
        // externalService: externalServiceStatus,
        // diskSpace: diskSpaceStatus,
        network: networkStatus,
        // customEndpoint: customEndpointStatus,
    };

    res.status(200).json(healthCheckResponse);
});