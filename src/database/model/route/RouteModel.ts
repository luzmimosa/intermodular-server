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
    WALKING = "WALKING",
    TREEKING = "TREEKING",
    RUNNING = "RUNNING",
    BYCYCLE = "BYCYCLE",
    PHOTOGRAPHY = "PHOTOGRAPHY",
    OTHER = "OTHER"
}

export enum RouteDifficulty {
    TRIVIAL = "TRIVIAL",
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
    EXPERT = "EXPERT"
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

export function calculateRouteLenght(measures: GpsMeasure[]) {
    let total = 0;
    for (let i = 0; i < measures.length - 1; i++) {
        total += calculateDistance(measures[i], measures[i + 1]);
    }
    return total;
}

function calculateDistance(a: GpsMeasure, b: GpsMeasure) {
    const R = 6371e3; // metres
    const angle1 = a.latitude * Math.PI / 180; // φ, λ in radians
    const angle2 = b.latitude * Math.PI / 180;
    const angle3 = (b.latitude - a.latitude) * Math.PI / 180;
    const angle4 = (b.longitude - a.longitude) * Math.PI / 180;

    const angle = Math.sin(angle3 / 2) * Math.sin(angle3 / 2) +
        Math.cos(angle1) * Math.cos(angle2) *
        Math.sin(angle4 / 2) * Math.sin(angle4 / 2);
    const c = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));

    return R * c; // in metres
}
