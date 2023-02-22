import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
// @ts-ignore
import {publicPath} from "../../Server";

export const imageRouter = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = 'uploads';
        const folderPath = path.join(publicPath, folder);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const filename = Buffer.from(file.fieldname + '-' + uniqueSuffix).toString('base64') + ext;

        cb(null, filename);
    },
});

const upload = multer({ storage });

imageRouter.post(
    "/image",
    upload.single("image",),
    (req: any, res: any) => {

        if (!req.isLogged) {
            res.status(401).json({message: "UNAUTHORIZED"});
            return;
        }

        try {
            res.status(200).json({id: req.file!!.filename});
        } catch (e) {
            res.status(400).json({message: "WRONG_IMAGE"});
        }
    }
);

imageRouter.get(
    "/image/:id",
    (req: any, res: any) => {

        if (!req.isLogged) {
            res.status(401).json({message: "UNAUTHORIZED"});
            return;
        }

        try {
            // get image from /public/uploads
            const publicFolder = path.join(publicPath, "uploads");
            const image = path.join(publicFolder, req.params.id);

            if (fs.existsSync(image)) {
                res.status(200).sendFile(image);
                return;
            }
        } catch (e) {}

        const image = path.join(publicPath, "images", "default.png");
        res.status(200).sendFile(image)
    }
)