import express from 'express';
export const apiRouter = express.Router();


apiRouter.get('/api/*', async (req, res) => {
    const apiEndpoint = req.url.replace("/api/", "");

    console.log("Endpoint requested:", apiEndpoint);

    res.send("uwu")
})