import { Schema } from 'mongoose';
import * as mongoose from "mongoose";

export interface Route {
    name: string,
    description: string,
    image: string,
    length: number,
    locations: GpsMeasure[],
    types: RouteType[],
    difficulty: RouteDifficulty,
    creator: string,
    creationDatetime: number
}

export interface PrivateRoute extends Route {
    // empty by now
}

export interface GpsMeasure {
    latitude: number,
    longitude: number
    waypoint?: Waypoint
}

export interface Waypoint {
    name: string,
    description: string,
    image: string,
}

export enum RouteType {
    WALK = "walk",
    TREEKING = "trekking",
    RUNNING = "running",
    BYCYCLE = "bycicle",
    PHOTOGRAPHY = "photography",
    OTHER = "other"
}

export enum RouteDifficulty {
    TRIVIAL = "trivial",
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
    EXPERT = "expert"
}

const waypointSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
});

const gpsMeasureSchema = new Schema({
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    waypoint: { type: waypointSchema, required: false }
});

const routeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    length: { type: Number, required: true },
    locations: { type: [gpsMeasureSchema], required: true },
    types: { type: [{ type: String, enum: Object.values(RouteType) }], required: true },
    difficulty: { type: String, enum: Object.values(RouteDifficulty), required: true },
    creator: { type: String, required: true },
    creationDatetime: { type: Number, required: true }
});

export const RouteModel = mongoose.model('route', routeSchema);
