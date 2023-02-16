import {RequestPermission} from "../Permissions";
import {getUserEndpoint} from "./endpoints/GetUserEndpoint";
import {getRouteEndpoint} from "./endpoints/GetRouteEndpoint";
import {postCreateRouteEndpoint} from "./endpoints/PostCreateRouteEndpoint";
import {getNearlyRoutesEndpoint} from "./endpoints/GetNearlyRoutesEndpoint";
import {deleteRouteEndpoint} from "./endpoints/DeleteRouteEndpoint";
import {postCommentEndpoint} from "./endpoints/PostCommentEndpoint";
import {getRandomRoutesEndpoint} from "./endpoints/GetRandomRoutesEndpoint";
import {getUserRoutesEndpoint} from "./endpoints/GetUserRoutesEndpoint";


const REGISTER = new Map<Endpoint, RequestPermission>();

export function registerEndpoints() {

    registerEndpoint(
        getUserEndpoint,
        RequestPermission.PUBLIC
    );

    registerEndpoint(
        getRouteEndpoint,
        RequestPermission.USER
    );

    registerEndpoint(
        postCreateRouteEndpoint,
        RequestPermission.USER
    );

    registerEndpoint(
        getNearlyRoutesEndpoint,
        RequestPermission.USER
    );

    registerEndpoint(
        deleteRouteEndpoint,
        RequestPermission.USER
    );

    registerEndpoint(
        postCommentEndpoint,
        RequestPermission.USER
    );

    registerEndpoint(
        getRandomRoutesEndpoint,
        RequestPermission.USER
    );

    registerEndpoint(
        getUserRoutesEndpoint,
        RequestPermission.USER
    );

}

function registerEndpoint(endpoint: Endpoint, permission: RequestPermission) {
    if (!isPathAvaiable(endpoint.path, endpoint.method)) {
        throw new Error(`Path ${endpoint.path} is already registered for method ${endpoint.method}`);
    }

    REGISTER.set(endpoint, permission);
}

function isPathAvaiable(path: string, method: string): boolean {
    const cleanPath = path.indexOf(":") === -1 ? path : path.substring(0, path.indexOf(":"));

    for (const endpoint of REGISTER.keys()) {
        const cleanEndpointPath = endpoint.path.indexOf(":") === -1 ? endpoint.path : endpoint.path.substring(0, endpoint.path.indexOf(":"));
        if (cleanEndpointPath === cleanPath && endpoint.method === method) {
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
        res.status(404).json({message: "ENDPOINT_NOT_FOUND"});
        return;
    }

    if (!canAccessEndpoint(REGISTER.get(endpoint) as RequestPermission, req)) {
        res.status(403).json({message: "INSUFFICIENT_PERMISSIONS"});
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

function canAccessEndpoint(permission: RequestPermission, req: any): boolean {

    const requestPermission = req.permission as RequestPermission;
    return requestPermission >= permission;
}