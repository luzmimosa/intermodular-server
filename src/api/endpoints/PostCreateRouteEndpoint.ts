import {Endpoint} from "../EndpointRegister";
import {createRoute} from "../../database/model/route/RouteManager";
import {
    calculateRouteLenght,
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

            const rawRoute = req.body;

            console.log(rawRoute);


            const route = {
                name: req.body.name !!,
                description: req.body.description !!,
                difficulty: req.body.difficulty !! as RouteDifficulty,
                image: req.body.image !!,
                locations: req.body.locations !! as GpsMeasure[],
                types: req.body.types !! as RouteType[],

                creator: req.username !!,

                length: calculateRouteLenght([... req.body.locations] as GpsMeasure[]),
                creationDatetime: Date.now(),
            } as Route;

            createRoute(
                route,
                () => {
                    res.status(200).json({message: "SUCCESS"});
                },
                (error) => {
                    console.log("DATABASE ERROR:", error);
                    res.status(500).json({message: "UNKNOWN_ERROR"});
                }
            )
        } catch (error: any) {
            console.log(error)
            res.status(400).json({message: "INVALID_ARGUMENTS"});
        }
    }
} as Endpoint;