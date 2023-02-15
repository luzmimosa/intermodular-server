import fs from "fs";
import {publicPath} from "../../Server";

export const ImageController = {
    imageExists(imageID: string): boolean {
        return fs.existsSync(publicPath + "/uploads/" + imageID)
    },

    deleteImage(imageID: string) {
        const path = publicPath + "/uploads/" + imageID;

        if (!this.imageExists(imageID)) return

        fs.unlinkSync(path)
    }
}