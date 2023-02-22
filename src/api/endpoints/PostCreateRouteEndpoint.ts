import {Endpoint} from "../EndpointRegister";
import {createRoute, generateRouteUID} from "../../database/model/route/RouteManager";
import {
    calculateRouteLength,
    GpsMeasure,
    Route,
    RouteDifficulty,
    RouteType
} from "../../database/model/route/RouteModel";


export const postCreateRouteEndpoint = {
    method: "POST",
    path: "v1/route/create",
    onCall: async (args, req, res) => {
        try {

            const uid = generateRouteUID(req.body.locations !! as GpsMeasure[]);

            const measures = req.body.locations !! as GpsMeasure[];

            const route = {
                uid: uid,

                name: req.body.name !!,
                description: req.body.description !!,
                difficulty: req.body.difficulty !! as RouteDifficulty,
                image: req.body.image !!,

                startingLocation: {
                    latitude: measures[0].latitude,
                    longitude: measures[0].longitude
                },

                locations: measures,
                types: req.body.types !! as RouteType[],

                creator: req.username !!,

                length: calculateRouteLength([... req.body.locations] as GpsMeasure[]),
                creationDatetime: Date.now(),
            } as Route;

            await createRoute(
                route,
                () => {
                    res.status(200).json({message: "SUCCESS"});
                },
                (error) => {
                    res.status(500).json({message: error});
                }
            )
        } catch (error: any) {
            res.status(400).json({message: "INVALID_ARGUMENTS"});
        }
    }
} as Endpoint;