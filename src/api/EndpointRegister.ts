import {getUserEndpoint} from "./endpoints/GetUserEndpoint";


const REGISTER = new Map<Endpoint, EndpointPermission>();

export function registerEndpoints() {
    registerEndpoint(
        getUserEndpoint,
        EndpointPermission.PUBLIC
    );
}

function registerEndpoint(endpoint: Endpoint, permission: EndpointPermission) {
    if (!isPathAvaiable(endpoint.path)) {
        throw new Error(`Path ${endpoint.path} is already registered for method ${endpoint.method}`);
    }

    REGISTER.set(endpoint, permission);
}

function isPathAvaiable(path: string): boolean {
    const cleanPath = path.indexOf(":") === -1 ? path : path.substring(0, path.indexOf(":"));

    for (const endpoint of REGISTER.keys()) {
        const cleanEndpointPath = endpoint.path.indexOf(":") === -1 ? endpoint.path : endpoint.path.substring(0, endpoint.path.indexOf(":"));
        if (cleanEndpointPath === cleanPath && endpoint.method === endpoint.method) {
            return false;
        }
    }
    return true;
}


export interface Endpoint {
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    onCall: (args: string[], req: any, res: any) => void;
}

export enum EndpointPermission {
    PUBLIC,
    ONLY_USERS,
    ONLY_ADMIN
}

function getEndpoint(endpointPath: string, method: "GET" | "POST" | "PUT" | "DELETE"): Endpoint | undefined {
    for (const endpoint of REGISTER.keys()) {
        if (endpointPath.startsWith(endpoint.path) && endpoint.method === method) {
            return endpoint;
        }
    }
    return undefined;
}

export async function handleRequest(endpointPath: string, method: "GET" | "POST" | "PUT" | "DELETE", req: any, res: any) {
    const endpoint = getEndpoint(endpointPath, method);
    if (!endpoint) {
        res.status(404).send("Unknown endpoint");
        return;
    }

    if (!canAccessEndpoint(REGISTER.get(endpoint) as EndpointPermission, req)) {
        res.status(403).send("Forbidden");
        return;
    }

    endpoint.onCall(
        extractArgs(endpointPath, endpoint),
        req,
        res
    );
}

function extractArgs(endpointPath: string, endpoint: Endpoint): string[] {
    return endpointPath.replace(endpoint.path + "/", "").split("/", 20);
}

function canAccessEndpoint(permission: EndpointPermission, req: any): boolean {
    if (permission === EndpointPermission.PUBLIC) {
        return true;
    }

    return false;
}