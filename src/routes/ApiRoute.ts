import express from 'express';
import {handleRequest} from "../api/EndpointRegister";
export const apiRouter = express.Router();


apiRouter.get('/api/*', async (req, res) => {
    const apiEndpoint = req.url.replace("/api/", "");

    await handleRequest(apiEndpoint, "GET", req, res);
})