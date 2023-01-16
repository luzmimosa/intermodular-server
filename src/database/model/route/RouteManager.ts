
import * as mongoose from "mongoose";
import {PrivateRoute, Route, RouteModel} from "./RouteModel";

async function getRoutesBy(query: mongoose.FilterQuery<PrivateRoute>): Promise<PrivateRoute[]> {
    try {
        return await RouteModel.find(query).exec();
    } catch (error: any) {
        throw new Error(error);
    }
}

async function getAllRoutes(): Promise<PrivateRoute[]> {
    return await getRoutesBy({});
}


// Internal API Functions

export async function createRoute(
    route: PrivateRoute,
    onSuccess: () => void = () => {},
    onError: (error: string) => void = () => {}
) {
    console.log("Creating route");

    try {
        const newRoute = new RouteModel(route);
        await newRoute.save();

        console.log("Route created: ", newRoute.name);
        onSuccess();

    } catch (err: any) {
        console.error(err);
        onError("Unknown error");
    }
}

export async function routeByID(id: string): Promise<Route | undefined> {
    const routes = await getRoutesBy({_id: id});
    if (routes.length === 0) {
        return undefined;
    }
    return privateRouteToRoute(routes[0]);
}

export async function routesByLocation(location: {latitude: number, longitude: number}, radius: number): Promise<Route[]> {
    const routes = await getRoutesBy({
        locations: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [location.longitude, location.latitude]
                },
                $maxDistance: radius
            }
        }
    });

    return routes.map(privateRouteToRoute);
}


function privateRouteToRoute(route: PrivateRoute): Route {
    return {
        name: route.name,
        description: route.description,
        image: route.image,
        locations: route.locations,
        types: route.types,
        length: route.length,
        difficulty: route.difficulty,
        creator: route.creator,
        creationDatetime: route.creationDatetime
    }
}