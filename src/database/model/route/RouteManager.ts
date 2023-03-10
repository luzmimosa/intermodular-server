
import * as mongoose from "mongoose";
import {Comment, GpsMeasure, PrivateRoute, Route, RouteModel} from "./RouteModel";
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

    if (await routeByUID(route.uid) !== undefined) {
        onError("ROUTE_ALREADY_EXISTS");
        return;
    }

    try {
        const newRoute = new RouteModel(route);
        await newRoute.save();

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

export async function randomRoutes(limit: number = 10): Promise<Route[]> {
    RouteModel.count().exec(async (err, count) => {
        if (err) throw new Error("ROUTE_COUNT_FAILED");

        return (await RouteModel.find().skip(Math.floor(Math.random() * count)).limit(limit).exec()).map(privateRouteToRoute);
    })

    return (await RouteModel.find({}).limit(limit).exec()).map(privateRouteToRoute);
}

export async function removeRoute(uid: string) {
    await RouteModel.deleteOne({uid: uid});
}

export async function commentRoute(routeUid: string, comment: Comment) {
    const route = await routeByUID(routeUid);
    if (route === undefined) {
        throw new Error("ROUTE_NOT_FOUND");
    }

    if (route.comments) {
        route.comments.push(comment);
    } else {
        route.comments = [comment];
    }
    await RouteModel.updateOne({uid: routeUid}, {comments: route.comments});
}

export function generateRouteUID(locations: GpsMeasure[]): string {

    let seed: string = "";

    for (const location of locations) {
        seed += location.latitude.toString() + location.longitude.toString();
    }

    return createHash("sha256").update(seed).digest("hex");

}

export async function deleteRoute(uid: string) {
    RouteModel.deleteOne({uid: uid});
}

export async function changeRouteCreator(uid: string, creator: string) {
    RouteModel.updateOne({uid: uid}, {creator: creator});
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
        creationDatetime: route.creationDatetime,
        comments: route.comments
    }
}