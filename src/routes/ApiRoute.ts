import express from 'express';
import {handleRequest} from "../api/EndpointRegister";
export const apiRouter = express.Router();


apiRouter.get('/api/*', async (req, res) => {
    const apiEndpoint = req.url.replace("/api/", "");

    await handleRequest(apiEndpoint, "GET", req, res);
});

apiRouter.post('/api/*', async (req, res) => {
    const apiEndpoint = req.url.replace("/api/", "");

    await handleRequest(apiEndpoint, "POST", req, res);
});

apiRouter.put('/api/*', async (req, res) => {
    const apiEndpoint = req.url.replace("/api/", "");

    await handleRequest(apiEndpoint, "PUT", req, res);
});

apiRouter.delete('/api/*', async (req, res) => {
    const apiEndpoint = req.url.replace("/api/", "");

    await handleRequest(apiEndpoint, "DELETE", req, res);
});