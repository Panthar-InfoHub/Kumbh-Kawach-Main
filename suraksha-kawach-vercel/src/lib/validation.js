import { z } from "zod"

export const stationRegisterSchema = z.object({
    station_name: z.string().min(3).max(100),
    station_latitude: z.number(),
    station_longitude: z.number(),
    station_address: z.string().min(5).max(500),
    station_phone: z.string().min(5),
    station_email: z.string().min(3),
    station_password: z.string().min(3).max(20),
})

export const stationLoginSchema = z.object({
    station_password: z.string({ required_error: "Password is required" }).min(8, "Password must be at least 8 characters long"),
    station_id: z.string({ required_error: "ID is required" }).min(2, "ID must be at least 2 characters long")
})

