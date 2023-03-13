import mongoose from "mongoose";

import { mongodburi } from "../config.js";

async function connect(){

    const db = await mongoose.connect(mongodburi, { useNewUrlParser: true });
    console.log("Database connected");

    return db;

}

export default connect;