import {Endpoint} from "../EndpointRegister";
import {routesByLocation} from "../../database/model/route/RouteManager";


export const getNearlyRoutesEndpoint = {
    method: "GET",
    path: "v1/nearlyroutes",
    onCall: async (args, req, res) => {
        if (args.length < 2) {
            res.status(404).json({message: "MISSING_LOCATION_COORDINATES"})
            return;
        }

        let lat: number, lon: number

        try {
            lat = parseFloat(args[0])
            lon = parseFloat(args[1])
        } catch (error) {
            res.status(404).json({message: "MALFORMED_COORDINATES"})
            return;
        }

        let radius = 1;

        if (args.length >= 3) {
            try {
                radius = parseInt(args[2])

                if (radius <= 0 || radius > 100) radius = 1;

            } catch (error) {
                res.status(404).json({message: "MALFORMED_ZOOM"})
            }
        }

        const routes = await routesByLocation(
            {
                latitude: lat,
                longitude: lon
            },
            radius
        );

        console.log("Values: ", lat, lon, radius)
        console.log(routes);



        res.status(200).json(
            routes.map<string>(route => route.uid)
        );

    }
} as Endpoint