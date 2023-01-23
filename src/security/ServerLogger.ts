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

export const serverProductionLogger = (req: any) => {
    const profile = {
        ip: req.ip,
        method: req.method,
        url: req.url
    } as RequestProfile;

    console.log(`[${Date.now()}] ${profile.ip} -> ${profile.method} ${profile.url}`);
}
