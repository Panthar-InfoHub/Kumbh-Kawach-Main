import {
    getTickets,
    getPoliceStations,
    PoliceStationPasswordCheck,
    getPoliceStationData
} from "@/controllers/police.station.controller";
import { createPoliceStation, updatePoliceStation } from "@/controllers/police.station.controller";
import { deletePoliceStation } from "@/controllers/police.station.controller";
import { Router } from "express";


const router = Router();

router.get("/", getPoliceStations); // Get All the police stations

router.post("/", createPoliceStation); // Create a new police station entry

router.get("/:police_station_id", getPoliceStationData); // Get details of a particular police station

router.put("/:police_station_id", updatePoliceStation); // Update information about an existing police station

router.delete("/:police_station_id", deletePoliceStation); // Delete a station

router.get("/:police_station_id/tickets", getTickets); // Get tickets attached to a police station

router.post("/:police_station_id/password-check", PoliceStationPasswordCheck); // Login password check for station


export default router;
