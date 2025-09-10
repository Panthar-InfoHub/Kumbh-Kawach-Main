import { NextFunction, Request, Response } from "express";
import ticket from "@/models/ticket.data.model";
import Joi from "joi";
import { getAuth, FirebaseAuthError, UserRecord } from "firebase-admin/auth";
import { v4 as uuidv4 } from "uuid";
import police_station  from "@/models/police.station.model";
import sequelize from "@/lib/seq";
import { Op } from "sequelize";
import user_data from "@/models/user.data.model";
import user_permission from "@/models/user.permission.model";
import emergency_contact from "@/models/emergency.contact.model";
import Mailer from "@/lib/mailer";
import { SendSOS_SMS } from "@/lib/msg91";

// Schema for ticket ID validation
const ticketIdSchema = Joi.object({
    ticket_id: Joi.string().required(),
    user_id: Joi.string().allow()
});



// Get ticket status
/**
 * Asynchronously retrieves the status of a ticket based on the provided ticket ID and user ID.
 *
 * Validates the request parameters using the `ticketIdSchema` and responds with an error
 * if the validation fails.
 * If the validation passes, the function queries the `ticket` database
 * to fetch the ticket record that matches the provided ticket ID and user ID.
 *
 * If the ticket record is found, it responds with the status and additional ticket details.
 * If the ticket is not found, it responds with a 404 status and an appropriate message.
 * Handles errors during the database operation and forwards them to the next middleware.
 *
 * @param {Request} req - The HTTP request object containing `params` with `ticket_id` and `user_id`.
 * @param {Response} res - The HTTP response object used to send back the results of the request.
 * @param {NextFunction} next - The next middleware function in the request-response cycle for handling errors.
 */
export const getTicketStatus = async (req: Request, res: Response, next: NextFunction) => {
    console.debug(`Getting status for ticket: ${req.params.ticket_id}`);

    const { error } = ticketIdSchema.validate(req.params);
    if (error) {
        console.debug(`Validation error for ticket ID: ${error.message}`);
        res.status(400).json({
            message: error.message
        });
        return;
    }

    const { ticket_id } = req.params;
    const user_id = req.params.user_id;

    try {
        console.debug(`Fetching ticket record for user ${user_id}, ticket ${ticket_id}`);
        const ticketRecord = await ticket.findOne({
            where: { ticket_id, user_id },
            attributes: ['status', 'ticket_priority', 'updatedAt']
        });

        if (!ticketRecord) {
            console.debug(`No ticket found for ID: ${ticket_id}`);
            res.status(404).json({
                message: "Ticket not found"
            });
            return;
        }

        console.debug(`Successfully retrieved status for ticket ${ticket_id}`);
        res.status(200).json({
            message: "Ticket status retrieved successfully",
            data: ticketRecord
        });

    } catch (e) {
        console.error("Error getting ticket status:", e);
        next(e);
    }
}

// Close ticket
/**
 * Handles the logic for closing a ticket based on provided parameters.
 *
 * This asynchronous function validates the ticket ID in the request parameters,
 * updates the status of the specified ticket to "Closed" if validation succeeds,
 * and returns a response indicating the outcome.
 *
 * Validation errors or scenarios where the ticket is not found are appropriately
 * handled, and corresponding HTTP status codes with error messages are sent.
 *
 * If an unexpected error occurs during the ticket update process, the error
 * is passed to the next middleware for appropriate handling.
 *
 * Parameters:
 * - `req` (Request): The HTTP request object, expected to contain `ticket_id`
 *   and optionally `user_id` in the request parameters.
 * - `res` (Response): The HTTP response object used to return an appropriate
 *   response to the client.
 * - `next` (NextFunction): The middleware function used to pass errors to the
 *   error-handling middleware if they occur.
 */
export const closeTicket = async (req: Request, res: Response, next: NextFunction) => {
    console.debug(`Attempting to close ticket: ${req.params.ticket_id}`);

    const { error } = ticketIdSchema.validate(req.params);
    if (error) {
        console.debug(`Validation error for ticket ID: ${error.message}`);
        res.status(400).json({
            message: error.message
        });
        return;
    }

    const { ticket_id } = req.params;
    const user_id = req.params.user_id;

    try {
        console.debug(`Updating ticket status to Closed for ticket ${ticket_id}`);
        const affectedRows = await ticket.update(
            { status: "Closed" },
            { where: { ticket_id, user_id } }
        );

        if (affectedRows[0] === 0) {
            console.debug(`No ticket found to close with ID: ${ticket_id}`);
            res.status(404).json({
                message: "Ticket not found"
            });
            return;
        }

        console.debug(`Successfully closed ticket ${ticket_id}`);
        res.status(200).json({
            message: "Ticket closed successfully",
            data: {
                affectedRows
            }
        });

    } catch (e) {
        console.error("Error closing ticket:", e);
        next(e);
    }
}


// Get latest location
/**
 * Asynchronously retrieves the latest location for a given ticket based on the provided request parameters.
 * Validates the ticket ID from the request parameters and queries the database for the relevant ticket.
 * If the ticket is found, it retrieves the most recent location data from the ticket's associated location data array.
 * If the ticket is not found or a validation error occurs, appropriate error responses are sent back to the client.
 * Delegates unhandled errors to the next middleware for further processing.
 *
 * @param {Request} req - The request object containing ticket and user ID in the parameters.
 * @param {Response} res - The response object used to send the returned data or error messages.
 * @param {NextFunction} next - The next middleware function for handling unhandled errors.
 */
export const getLatestLocation = async (req: Request, res: Response, next: NextFunction) => {
    console.debug(`Getting latest location for ticket: ${req.params.ticket_id}`);

    const { error } = ticketIdSchema.validate(req.params);
    if (error) {
        console.debug(`Validation error: ${error.message}`);
        res.status(400).json({
            message: error.message
        });
        return;
    }

    const { ticket_id } = req.params;
    const user_id = req.params.user_id;

    try {
        console.debug(`Fetching location data for ticket ${ticket_id}`);
        const ticketRecord = await ticket.findOne({
            where: { ticket_id, user_id },
            attributes: ['location_data'],
        });

        if (!ticketRecord) {
            console.debug(`No ticket found with ID: ${ticket_id}`);
            res.status(404).json({ message: "Ticket not found" });
            return;
        }

        const locations = ticketRecord.location_data;
        const latestLocation = locations[locations.length - 1];

        console.debug(`Successfully retrieved latest location for ticket ${ticket_id}`);
        res.status(200).json({
            message: "Latest location retrieved successfully",
            data: latestLocation
        });

    } catch (e) {
        console.error("Error getting latest location:", e);
        next(e);
    }
}

// Add location to ticket
// Location validation schema
const locationSchema = Joi.object({
    latitude: Joi.number().required().min(-90).max(90),
    longitude: Joi.number().required().min(-180).max(180),
    created_at: Joi.date().required().max('now')
});

/**
 * Adds a location entry to a ticket identified by ticket_id and user_id from the request parameters.
 *
 * This asynchronous function validates the request parameters and body against defined schemas
 * before processing.
 * If validation fails, it sends a 400 Bad Request response with the validation error.
 * If the ticket is not found in the database, a 404 Not Found response is sent.
 *
 * Locations are stored uniquely based on the created_at timestamp, allowing for duplicate prevention.
 * The function attempts to update the location data for the ticket after appending the new entry
 * and returns an appropriate response indicating whether the location was added or already existed.
 *
 * If an error occurs during execution, it is passed to the next middleware for error handling.
 *
 * @param {Request} req - The incoming HTTP request containing ticket_id in the params and location data in the body.
 * @param {Response} res - The HTTP response to send back to the client after processing the request.
 * @param {NextFunction} next - The next middleware function for handling errors or passing control.
 */
export const addTicketLocation = async (req: Request, res: Response, next: NextFunction) => {
    console.debug(`Adding location to ticket: ${req.params.ticket_id}`);

    const { error: paramsError } = ticketIdSchema.validate(req.params);
    const { error: bodyError } = locationSchema.validate(req.body);

    if (paramsError || bodyError) {
        console.debug(`Validation error: ${paramsError?.message || bodyError?.message}`);
        res.status(400).json({
            message: paramsError?.message || bodyError?.message
        });
        return;
    }

    const { ticket_id } = req.params;
    const user_id = req.params.user_id;

    try {
        console.debug(`Finding ticket record for location addition`);
        const ticketRecord = await ticket.findOne({ where: { ticket_id, user_id }});

        if (!ticketRecord) {
            console.debug(`No ticket found for location addition: ${ticket_id}`);
            res.status(404).json({ message: "Ticket not found" });
            return;
        }

        const { latitude, longitude, created_at } = req.body;

        // Using Set with created_at as a uniqueness key
        // since locations at the same time should be considered duplicates
        const locationMap = new Map(
            ticketRecord.location_data.map(loc => [new Date(loc.created_at).getTime(), loc])
        );

        locationMap.set(new Date(created_at).getTime(), { latitude, longitude, created_at });
        const updatedLocations = Array.from(locationMap.values());

        console.debug(`Updating ticket with new location, total locations: ${updatedLocations.length}`);
        await ticketRecord.update({ location_data: updatedLocations });

        res.status(200).json({
            message: ticketRecord.location_data.length === updatedLocations.length ? "Location entry already existed" : "Location added successfully",
            data: updatedLocations
        });

    } catch (e) {
        console.error("Error adding location to ticket:", e);
        next(e);
    }
}



/**
 * Asynchronously handles the retrieval of a ticket summary based on the provided ticket ID and user ID.
 * Validates the request parameters using `ticketIdSchema` and responds with appropriate status codes
 * and messages in case of validation errors or missing tickets.
 *
 * Upon successful retrieval, the endpoint returns a 200 status code with a JSON object containing
 * the ticket's initial analysis.
 *
 * Handles errors by forwarding them to the next middleware.
 *
 * @param {Request} req - The request object containing parameters `ticket_id` and optional `user_id`.
 * @param {Response} res - The response object used to send back the ticket summary or an error message.
 * @param {NextFunction} next - The next middleware function to handle any errors.
 */
export const getTicketSummary = async (req: Request, res: Response, next: NextFunction) => {
    const {error} = ticketIdSchema.validate(req.params);
    if (error) {
        res.status(400).json({
            message: error.message
        });
        return;
    }

    const {ticket_id} = req.params;
    const user_id = req.params.user_id;

    try {
        console.debug("Fetching ticket summary for ticket: ", ticket_id);

        const ticketRecord = await ticket.findOne({where: {ticket_id, user_id}});

        if (!ticketRecord) {
            res.status(404).json({
                message: "Ticket not found"
            });
            return;
        }

        res.status(200).json({
            message: "Ticket summary fetched successfully",
            data: ticketRecord.initial_analysis
        });

        return;
    } catch (e) {
        console.error("Error in fetching ticket summary: ", e);
        next(e);
    }

}






/**
 * Retrieves ticket details based on the provided ticket ID and user ID.
 *
 * This function validates the `ticket_id` and `user_id` parameters received from the request,
 * fetches the ticket details from the database, and sends an appropriate JSON response.
 *
 * @param {Request} req - The HTTP request object containing route parameters `ticket_id` and `user_id`.
 * @param {Response} res - The HTTP response object used to send the response back to the client.
 * @param {NextFunction} next - The next middleware function in the application's request-response cycle.
 *
 * @throws {Error} Passes any unexpected errors to the next middleware for centralized error handling.
 *
 * Responses:
 * - 200: Returns the fetched ticket details in a JSON object with a success message.
 * - 400: Returns a JSON object with an error message if validation of the request parameters fails.
 * - 404: Returns a JSON object with an error message if no ticket is found with the provided `ticket_id` and `user_id`.
 */
export const getTicketDetailsById = async (req: Request, res: Response, next: NextFunction) => {
    const {error} = ticketIdSchema.validate(req.params);
    if (error) {
        res.status(400).json({
            message: error.message
        });
        return;
    }

    const {ticket_id, user_id} = req.params;

    try {
        const ticketRecord = await ticket.findOne({ where: { ticket_id, user_id }});

        if (!ticketRecord) {
            res.status(404).json({
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            message: "Ticket details fetched successfully",
            data: ticketRecord
        });

        return;
    }

    catch (e) {
        console.error("Error in fetching ticket details: ", e);
        next(e);
    }

}



/**
 * Asynchronous function to get tickets associated with a specific user.
 *
 * This function retrieves all tickets for a user, based on the user_id provided
 * in the request parameters.
 * It assumes that middleware has already
 * validated the user_id (for example, user_id_checker).
 *
 * Logs debug information about the ticket retrieval process and handle errors
 * if an issue arises during data fetching.
 *
 * @param {Request} req - The request object containing user_id as a route parameter.
 * @param {Response} res - The response object used to send back the fetched tickets or an error message.
 * @param {NextFunction} next - The next middleware function in the request-response cycle, used for error propagation.
 *
 * @returns {Promise<void>} Resolves when tickets are successfully retrieved and sent in the response.
 *
 * @throws Passes errors to the next middleware function through the `next` parameter in case of issues during ticket retrieval.
 */
export const getUserTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user_id = req.params.user_id; // Already checked for user_id in the user_id_checker middleware

    try {
        console.debug("Fetching tickets for user: ", user_id);
        const tickets = await ticket.findAll(
            {where: {user_id},
            attributes: ["ticket_id","station_id", "status", "createdAt"]
        });

        console.debug("Tickets fetched successfully");

        res.status(200).json({
            message: "Tickets fetched successfully",
            data: tickets
        });

        return;

    } catch(e) {
        console.error("Error in fetching tickets: ", e);
        next(e);
    }
}

/**
 * Asynchronous function to delete a ticket associated with a specific user.
 * This function validates the presence of the `ticket_id` in the request parameters
 * and attempts to delete the corresponding ticket from the database.
 *
 * @param {Request} req - The Express request object, containing the `user_id` and `ticket_id` in its parameters.
 * @param {Response} res - The Express response object, used to send back the appropriate response to the client.
 * @param {NextFunction} next - The Express next middleware function for error handling.
 *
 * @throws Will forward the error to the `next` middleware in case of unforeseen issues during the deletion process.
 *
 * Response:
 * - 200: When the ticket is successfully deleted. Returns a success message.
 * - 400: When `ticket_id` is missing in the request parameters.
 * Returns an error message.
 * - 404: When no ticket is found matching the provided `ticket_id` and `user_id`.
 * Returns an error message.
 */
export const deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.user_id; // Already checked for user_id in the user_id_checker middleware
    const ticket_id = req.params.ticket_id;

    if (!ticket_id) {
        res.status(400).json({
            message: "Ticket ID is required"
        });
        return;
    }

    try {
        console.debug("Deleting ticket: ", ticket_id, " for user: ", user_id);
        const deleted_rows = await ticket.destroy({where: {ticket_id, user_id}});

        if (deleted_rows === 0) {
            res.status(404).json({
                message: "Ticket not found"
            });
            return;
        }


        res.status(200).json({
            message: "Ticket deleted successfully"
        });

    } catch(e) {
        console.error("Error in deleting ticket: ", e);
        next(e);
    }

}


type createTicketBody = {
    latitude: number;
    longitude: number;
    created_at: Date;
}

const createTicketSchema = Joi.object({
    latitude: Joi.number().required().min(-90).max(90),
    longitude: Joi.number().required().min(-180).max(180),
    created_at: Joi.date().required().max('now')
});



/**
 * Asynchronously creates a new ticket for a user.
 * The ticket represents an SOS alert with location data,
 * a relation to a police station (if one exists nearby), and any associated metadata such as attachments
 * (to be added later).
 * The ticket is created only if the user has valid permissions and the necessary validations pass.
 *
 * This function performs the following steps:
 * 1. Validates the request body using the `createTicketSchema`.
 * 2. Verifies if the user exists in Firebase and the database.
 * 3. Checks the user's permissions to ensure they can generate SOS alerts.
 * 4. Closes any active tickets for the user before creating a new one.
 * 5. Finds the nearest police station to associate with the ticket.
 * 6. Creates a new ticket and populates its initial data, including location and status.
 * 7. Notifies the user's emergency contacts about the newly created ticket.
 *
 * The function sends appropriate HTTP responses depending on the outcome:
 * - Status 400 for validation errors or malformed input.
 * - Status 404 if the user is not found in Firebase or the database.
 * - Status 403 if the user lacks permissions to create SOS alerts.
 * - Status 201 when the ticket is created successfully.
 *
 * @param {Request} req - The HTTP request object, containing user_id in params and ticket data in the body.
 * @param {Response} res - The HTTP response object used to send the response.
 * @param {NextFunction} next - The next middleware function in the request pipeline, used for forwarding errors.
 *
 * @throws {Error} Propagates unexpected errors to the next middleware if not related to validation or foreign key constraints.
 */
export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.user_id; // Already checked for user_id in the user_id_checker middleware

    const {error, value} = createTicketSchema.validate(req.body);
    if (error) {
        res.status(400).json({
            message: error.message
        });
        return;
    }

    const {latitude, longitude, created_at} : createTicketBody = value;


    try {

        // Verify firebase uid exists
        let firebaseUserRecord : UserRecord;
        let dbUserRecord : user_data;
        // Calculate a user's age based on the date of birth (dob)
       
            
        
        try {

            firebaseUserRecord = await getAuth().getUser(user_id);
            const dbUser = await user_data.findOne({where: {id: user_id}, include: [user_permission, emergency_contact]});

            if (!dbUser) {
                console.warn("User not found in database while creating ticket for user: ", user_id);
                res.status(404).json({
                    message: "User not found in database"
                });
                return;
            }

            console.debug("User found in database while creating ticket for user: ", user_id);
            dbUserRecord = dbUser;
        } catch (e) {
            if (e instanceof FirebaseAuthError) {
                res.status(404).json({
                    message: "User not found in Firebase"
                });
                return;
            }
            throw e;
        }

        // Check user permissions
        if (!dbUserRecord.permissions.generate_sos_alerts) {
            res.status(403).json({
                message: "User does not have permission to generate SOS alerts"
            });
            return;
        }
        
        // Close any active tickets

        // Close any active tickets
        try {
            const activeTickets = await ticket.update(
                {status: "Closed"},
                {where: {user_id, status: "Active"}}
            );

            if (activeTickets[0] > 0) {
                console.debug(`Closed ${activeTickets[0]} active ticket(s) for user: ${user_id}`);
            } else {
                console.debug(`No active tickets found for user: ${user_id}`);
            }
        } catch (e) {
            console.warn("Failed to close active tickets for user:", user_id, "Error:", e);
        }

        // Create a ticket with initial data
        const ticket_id = uuidv4();

        // Find the closest police station if possible
        let station_id = null;

            const nearest_station = await findNearestPoliceStation(latitude, longitude); // can be null if no station is found
            if (nearest_station) {
                station_id = nearest_station.station_id;
            }


        const new_ticket = await ticket.create({
            ticket_id,
            user_id,
            station_id,
            status: "Active",
            location_data: [{
                latitude,
                longitude,
                created_at
            }],
            summary: "Ticket created. Waiting for more media to arrive.", // Can be updated later with more details
            images: [],
            audio: [],
            transfer_reason: null,
            ticket_priority: 0
        });
            
            console.debug({new_ticket})



        res.status(201).json({
            message: "Ticket created successfully",
            data: new_ticket
        });

        // Notify emergency contacts
        await notifyEmergencyContacts(req, dbUserRecord, firebaseUserRecord, new_ticket, nearest_station);

        console.debug("Ticket created successfully:", ticket_id);

        return;


    } catch(e) {
        console.error("Error in creating ticket: ", e);
        if (e instanceof Error) {
            if (e.name === "SequelizeValidationError") {
                res.status(400).json({
                    message: e.message
                });
                return;
            } if (e.name === "SequelizeForeignKeyConstraintError") {
                res.status(400).json({
                    message: "Invalid user_id is provided. Unable to attached ticket to the user."
                });
                return;
            }
        }
        next(e);
    }
}


// Returns the station_id of the nearest police station
/**
 * Finds the nearest police station to the specified geographic coordinates (latitude and longitude).
 * The search is conducted within a 10-kilometer radius.
 *
 * @param {number} latitude - The latitude of the location to search from.
 * @param {number} longitude - The longitude of the location to search from.
 * @return {Promise<police_station|null>} A promise that resolves to the nearest police station object if found,
 * or null if no police station is within the range or an error occurs.
 */
async function findNearestPoliceStation(latitude: number, longitude: number) : Promise<police_station | null> {

    const radius = 10; // kilometers
    // Approximation: 1 degree latitude is ~111.045 km
    const latRange = radius / 111.045;
    // Longitude degrees vary with latitude
    const lonRange = radius / (111.045 * Math.cos(latitude * (Math.PI / 180)));

    try {
        // Note: This is a basic example – you may want to use more sophisticated geolocation queries
        const closest_station = await police_station.findOne({
            where: {
              station_latitude: {
                [Op.not]: null,
                [Op.between]: [latitude - latRange, latitude + latRange]
              },
              station_longitude: {
                [Op.not]: null,
                [Op.between]: [longitude - lonRange, longitude + lonRange]
              }
            },
            order: [
              [
                sequelize.literal(`(
                  6371 * acos(
                    cos(radians(${latitude})) * 
                    cos(radians(station_latitude)) * 
                    cos(radians(station_longitude) - radians(${longitude})) + 
                    sin(radians(${latitude})) * 
                    sin(radians(station_latitude))
                  )
                )`),
                'ASC'
              ]
            ],
            limit: 1
          });

        if (closest_station) {
            console.debug("Closest station found:", closest_station.station_name, "at", closest_station.station_latitude, closest_station.station_longitude);
            return closest_station;
        } else {
            console.warn("No police station found within 10 km");
            return null;
        }
    } catch (err) {
        console.warn("Error finding closest police station:", err);
        // Continue without station assignment
        return null;
    }



}

/**
 * Sends notifications to emergency contacts via phone and email.
 * Additionally, notifies the police station
 * if station data is provided.
 *
 * @param {Request} req - The HTTP request object.
 * @param {user_data} dbUserRecord - The user data record from the database.
 * @param {UserRecord} firebaseUserRecord - The user record from Firebase.
 * @param {ticket} new_ticket - The ticket detailing the emergency information.
 * @param {police_station|null} station_data - The police station data to notify, or null if not applicable.
 *
 * @return {Promise<void>} A promise that resolves when all notifications (phone, email, police station) are sent.
 */
async function notifyEmergencyContacts(req: Request, dbUserRecord: user_data, firebaseUserRecord: UserRecord, new_ticket: ticket, station_data: police_station| null): Promise<void> {

    const mailer = new Mailer();
    // Email to emergency contacts

    // Notify Police station first (if any)
    if (station_data) {
        await notifyPoliceStation(req, station_data, new_ticket, dbUserRecord, firebaseUserRecord, mailer);
    }

    const sms_notification_promises = await notifyEmergencyContactsViaPhone(req, new_ticket, dbUserRecord, firebaseUserRecord);
    const email_notification_promises = await notifyEmergencyContactsViaEmail(req, dbUserRecord, firebaseUserRecord, new_ticket, mailer);

    console.debug("Notifying emergency contacts via phone and email in parallel");

    try {
        await Promise.all([...sms_notification_promises, ...email_notification_promises]);
    } catch (e) {
        console.error("Error in notifying emergency contacts via phone and email: ", e);
    }


}

/**
 * Sends email notifications to the emergency contacts of a user informing them of an SOS event.
 *
 * @param {Request} req - The HTTP request object, used to retrieve contextual information such as the user's IP address.
 * @param {user_data} dbUserRecord - The database record of the user containing emergency contact details.
 * @param {UserRecord} firebaseUserRecord - The Firebase user record containing additional user information.
 * @param {ticket} new_ticket - The newly created ticket representing the SOS event.
 * @param {Mailer} mailer - The Mailer instance used to send emails to contacts.
 * @return {Promise<Array<Promise<any>>>} A promise that resolves to an array of promises for the email notifications sent to emergency contacts.
 */
async function notifyEmergencyContactsViaEmail(req: Request, dbUserRecord: user_data, firebaseUserRecord: UserRecord, new_ticket: ticket, mailer: Mailer): Promise<Array<Promise<any>>> {
    const email_notification_promises = [];
    
    if (dbUserRecord.emergency_contacts.length === 0) {
        console.debug("No emergency contacts found for user: ", dbUserRecord.id);
    }
    
    for (const contact of dbUserRecord.emergency_contacts) {
        console.debug("Email of emergency contact: ", contact.email);
        email_notification_promises.push(mailer.sendEmailSOSAlertToEmergencyContacts(contact.email, req.ip || "Unknown", new_ticket, dbUserRecord, firebaseUserRecord));
    }

    return email_notification_promises;
}

/**
 * Notifies emergency contacts of a user via SMS when an emergency ticket is created.
 *
 * @param {Request} req - The HTTP request object initiating the operation.
 * @param {ticket} new_ticket - The newly created emergency ticket containing ticket details.
 * @param {user_data} dbUserRecord - The user data record retrieved from the database, including emergency contacts.
 * @param {UserRecord} firebaseUserRecord - The Firebase user record related to the user initiating the request.
 * (if applicable, unused in this function).
 * @return {Promise<Array<Promise<any>>>} A promise that resolves to an array of promises for each SMS notification sent to emergency contacts.
 */
async function notifyEmergencyContactsViaPhone(req: Request, new_ticket: ticket, dbUserRecord: user_data, firebaseUserRecord: UserRecord): Promise<Array<Promise<any>>> {
    const sms_notification_promises = [];

    for (const contact of dbUserRecord.emergency_contacts) {

        sms_notification_promises.push(SendSOS_SMS(contact.phone_number,firebaseUserRecord.displayName || "One of your contacts",`${process.env.WEB_EMERGENCY_CONTACT_SOS_PAGE_URL}?ticketId=${new_ticket.ticket_id}&firebaseUID=${firebaseUserRecord.uid}`));
    }

    return sms_notification_promises;
}

/**
 * Notifies a police station by sending an SOS alert email with relevant details.
 *
 * @param {Request} req - The HTTP request object containing client request details such as IP address.
 * @param {police_station} station_data - The data of the police station including email information.
 * @param {ticket} new_ticket - The new ticket information that must be shared with the police station.
 * @param {user_data} dbUserRecord - The database record of the user related to the ticket.
 * @param {UserRecord} firebaseUserRecord - The Firebase user record associated with the user.
 * @param {Mailer} mailer - The mailer instance to handle sending the SOS alert email.
 * @return {Promise<void>} A promise that resolves when the SOS alert email has been successfully sent.
 */
async function notifyPoliceStation(req: Request,  station_data:police_station, new_ticket: ticket, dbUserRecord: user_data, firebaseUserRecord: UserRecord, mailer: Mailer): Promise<void> {
        console.debug("Sending email to police station: ", station_data.station_email);
        await mailer.sendEmailSOSAlertToPoliceStation(station_data.station_email, req.ip || "Unknown", new_ticket, station_data, dbUserRecord, firebaseUserRecord);
        console.debug("Email sent to police station: ", station_data.station_email);
}



