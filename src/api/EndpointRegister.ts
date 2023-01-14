

const REGISTER = new Map<Endpoint, EndpointPermission>();

function registerEndpoints() {
    //registerEndpoint({path: "v1/user", method: "GET", onCall: (req, res) => processGetUserEndpoint(req, res)}, EndpointPermission.USER);
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
    onCall: (req: Request, res: Response) => void;
}

export enum EndpointPermission {
    ONLY_ADMIN
}