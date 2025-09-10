"use server"
import mongoose from "mongoose"

let isConnected = false;
export const connectDB = async () => {

    if (isConnected) {
        console.debug("\nDatabase already connected...")
        return;
    }

    try {
        await mongoose.connect(process.env.DB_URI as string, {
            dbName: "kumb_kawach"
        })
        isConnected = true
        console.debug("\n Database connected..")
    } catch (error) {
        console.error("Error while connecting to database ==> ", error)
    }
}