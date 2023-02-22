import {isProduction} from "../ConfigurationProvider";



export interface RequestProfile {
    readonly ip: string;
    readonly method: string;
    readonly url: string;
}

export const serverDevelopmentLogger = (req: any, res: any, next: any) => {
    if (isProduction()) throw new Error("Using development logger in production environment");

    next();
}

export const serverProductionLogger = (req: any, res: any, next: any) => {
    const profile = {
        ip: req.ip,
        method: req.method,
        url: req.url
    } as RequestProfile;

    // formated date as dd/mm/yyyy hh:mm:ss
    const date = new Date().toLocaleString("es-ES", {timeZone: "Europe/Warsaw"});

    console.log(`[${date}] ${profile.ip} -> ${profile.method} ${profile.url}`);

    next();
}
