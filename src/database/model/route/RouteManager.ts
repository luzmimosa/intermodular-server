
import * as mongoose from "mongoose";
import {GpsMeasure, PrivateRoute, Route, RouteModel} from "./RouteModel";
import {createHash} from "crypto";

const MAX_RESULTS = 200;

async function getRoutesBy(query: mongoose.FilterQuery<PrivateRoute>): Promise<PrivateRoute[]> {
    try {
        return await RouteModel.find(query).limit(MAX_RESULTS).exec();
    } catch (error: any) {
        throw new Error(error);
    }
}


// Internal API Functions

export async function createRoute(
    route: PrivateRoute,
    onSuccess: () => void = () => {},
    onError: (error: string) => void = () => {}
) {
    console.log("Creating route");

    if (await routeByUID(route.uid) !== undefined) {
        onError("ROUTE_ALREADY_EXISTS");
        return;
    }

    try {
        const newRoute = new RouteModel(route);
        await newRoute.save();

        console.log("Route created: ", newRoute.name);
        onSuccess();

    } catch (err: any) {
        onError("UNKNOWN_ERROR");
    }
}

export async function routeByUID(uid: string): Promise<Route | undefined> {
    const routes = await getRoutesBy({uid: uid});
    if (routes.length === 0) {
        return undefined;
    }
    return privateRouteToRoute(routes[0]);
}

export async function routesByLocation(location: {latitude: number, longitude: number}, kilometers: number): Promise<Route[]> {
    const routes = await getRoutesBy({
        startingLocation: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [location.longitude, location.latitude]
                },
                $maxDistance: kilometers * 1000
            }
        }
    });

    return routes.map(privateRouteToRoute);
}

export async function routesByCreator(creator: string): Promise<Route[]> {
    const routes = await getRoutesBy({creator: creator});
    return routes.map(privateRouteToRoute);
}

export async function removeRoute(uid: string) {
    await RouteModel.deleteOne({uid: uid});
}

export function generateRouteUID(locations: GpsMeasure[]): string {

    let seed: string = "";

    for (const location of locations) {
        seed += location.latitude.toString() + location.longitude.toString();
    }

    return createHash("sha256").update(seed).digest("hex");

}


function privateRouteToRoute(route: PrivateRoute): Route {
    return {
        uid: route.uid,
        name: route.name,
        description: route.description,
        image: route.image,
        startingLocation: route.startingLocation,
        locations: route.locations,
        types: route.types,
        length: route.length,
        difficulty: route.difficulty,
        creator: route.creator,
        creationDatetime: route.creationDatetime
    }
}