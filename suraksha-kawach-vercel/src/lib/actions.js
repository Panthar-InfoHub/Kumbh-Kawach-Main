"use server"

import axios from "axios";
import { parseServerResponse } from "./utils";
import { auth, signIn } from "./auth";

export const registerStation = async (form) => {
    try {
        const { station_name, station_latitude, station_longitude, station_address, station_phone, station_email, station_password } = Object.fromEntries(Array.from(form));
        const payload = {
            station_name,
            station_latitude: Number(station_latitude),
            station_longitude: Number(station_longitude),
            station_address,
            station_phone: `91${station_phone}`,
            station_email,
            station_image: "https://google.com",
            station_password
        }
        console.log("payloadddd : ", payload)

        const res = await axios.post(`${process.env.BACKEND_PRODUCTION_URI}/v2/police-stations/`, payload)


        return parseServerResponse({ status: "SUCCESS" })

    } catch (error) {
        console.log("Registration Error  : ", error)
        return parseServerResponse({ status: "FAIL", message: error.message })
    }
}

export const signInStation = async (form) => {
    console.log("password ==> ", form.get("station_password"))
    console.log("station_id ==> ", form.get("station_id"))
    await signIn("credentials", {
        password: form.get("station_password"),
        station_id: form.get("station_id"),
        redirectTo: "/sos/police/dashboard"
    })
    return parseServerResponse({ status: "FAIL", message: "Success login" })
}

export const checkPassword = async (password, stationId) => {
    try {

        console.log("Data inside checkPassword : ", password, stationId)

        const { data } = await axios.post(
            `${process.env.BACKEND_PRODUCTION_URI}/v2/police-stations/${stationId}/password-check`,
            { station_password: password }
        );

        return data.data?.is_password_correct
    } catch (error) {
        if (error.response) {
            console.log("Login Error Response:", error.response.status);
            console.log("Login Error Data:", error.response.data);  // 🔍 This will show the exact reason for the 400 error
        } else if (error.request) {
            console.log("No Response from Server:", error.request);
        } else {
            console.log("Error:", error.message);
        }
    }
}

export const getTickets = async (page = 1, page_size = 10) => {
    try {
        const session = await auth()
        if (!session?.user) {
            return parseServerResponse({ status: "FAIL", message: "Unauthorized" })
        }

        const stationId = session.user.station_id;

        const { data } = await axios.get(`${process.env.BACKEND_PRODUCTION_URI}/v2/police-stations/${stationId}/tickets?type=all&sort_order=desc&page=${page}&page_size=${page_size}`)
        return parseServerResponse({ status: "SUCCESS", data: data.data.rows, total: data.data.count, pageSize: data.pagination.page_size })

    } catch (error) {
        console.log("Error in getTickets : ", error)
        return parseServerResponse({ status: "FAIL", message: error.message })
    }
}

export const getTicketDetails = async (firebaseUID, ticketId) => {
    try {
        const { data } = await axios.get(`${process.env.BACKEND_PRODUCTION_URI}/v2/user/${firebaseUID}/ticket/${ticketId}`)

        console.log("RESS ticket ==> ", data)
        return parseServerResponse({ status: "SUCCESS", data: data?.data, location: data?.data?.location_data })
    } catch (error) {
        console.log("Error in ticket details : ", JSON.stringify(error))
        return parseServerResponse({ status: "FAIL", message: error.message })
    }
}

export const getUser = async (userId) => {
    try {
        const { data } = await axios.get(`${process.env.BACKEND_PRODUCTION_URI}/v2/user/${userId}`)
        return parseServerResponse({
            status: "SUCCESS", data: {
                ...data.data.firebase,
                sex: data.data.db.sex
            }
        })
    } catch (error) {
        console.log("Error in getUser ==> ", JSON.stringify(error))
        return parseServerResponse({ status: "FAIL", message: error.message })
    }
}

export const getSumamry = async (firebaseUID, ticketId) => {
    try {
        const { data } = await axios.get(`${process.env.BACKEND_PRODUCTION_URI}/v2/user/${firebaseUID}/ticket/${ticketId}/summary`)
        return parseServerResponse({ status: "SUCCESS", data: data?.data?.summary || "", priority: data?.data?.priority.score })
    } catch (error) {
        console.log("Error in get summary : ", JSON.stringify(error))
        return parseServerResponse({ status: "FAIL", message: error.message })
    }
}