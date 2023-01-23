import {RequestHandler} from "express";

const errorDescriptionMap = new Map<number, string>();

errorDescriptionMap.set(400, "Bad Request");
errorDescriptionMap.set(401, "Unauthorized");
errorDescriptionMap.set(403, "Forbidden");
errorDescriptionMap.set(404, "Not Found");
errorDescriptionMap.set(405, "Method Not Allowed");
errorDescriptionMap.set(500, "Internal Server Error");
errorDescriptionMap.set(501, "Not Implemented");
errorDescriptionMap.set(502, "Bad Gateway");
errorDescriptionMap.set(503, "Service Unavailable");
errorDescriptionMap.set(504, "Gateway Timeout");

export const errorHandler: RequestHandler = (req, res) => {

    const status = 404;
    // render the error page
    res.status(status);
    res.render('error', {
        title: "Chocokrispies con nata | UwUloc ",

        errorMessage: "Oh, algo ha ido mal",
        errorDescription: errorDescriptionMap.get(status) || "Parece que ha habido un error",
        errorCode: status
    });
}