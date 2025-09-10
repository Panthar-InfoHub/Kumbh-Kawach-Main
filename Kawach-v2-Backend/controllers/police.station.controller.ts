import WrappedError from "@/error/wrapped.error";
import police_station from "@/models/police.station.model";
import ticket_data from "@/models/ticket.data.model";
import user_data from "@/models/user.data.model";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

type getPoliceStationBody = {
	police_station_id: string;
}

const getPoliceStationBodySchema = Joi.object<getPoliceStationBody>({
	police_station_id: Joi.string().required()
});

/**
 * Asynchronously fetches data for a specific police station based on the provided identifier.
 *
 * Validates the input parameters of the request against a predefined schema.
 * If validation fails, a 400 Bad Request response is sent with the validation error message.
 *
 * Attempts to retrieve the police station from the database by its primary key.
 * If the police station is not found, a 404 Not Found response is sent with an appropriate response message.
 * Excludes sensitive fields such as the station's password from the returned data.
 *
 * If the police station is successfully retrieved, a 200-OK response is sent with the police station's data.
 *
 * Logs the operation at relevant checkpoints for debugging purposes.
 * In case of an unexpected error during the process, it propagates the error
 * to the next error handling middleware by wrapping it in a custom `WrappedError` with a status code of 500.
 *
 * @param {Request} req - The Express.js request object containing the request parameters.
 * @param {Response} res - The Express.js response object used to send the HTTP response.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 */
export const getPoliceStationData = async (req: Request, res: Response, next: NextFunction) => {
	
	const { error } = getPoliceStationBodySchema.validate(req.params);
	if (error) {
		res.status(400).json({ message: error.message });
		return;
	}
	
	try {
		
		console.debug("Fetching police stations");
		const station = await police_station.findByPk(
			req.params.police_station_id,
			{
				attributes: {
					exclude: ["station_password"]
				}
			});
		
		if (!station) {
			res.status(404).json({
				message: "No police station found",
			});
			return;
		}
		
		res.status(200).json({
			message: "Police station fetched successfully",
			data: station
		});
		
		console.debug("Police station fetched successfully", station);
		
		return;
		
	} catch (error) {
		console.error("Error fetching police station", error);
		next(new WrappedError("Error fetching police station", error as Error, 500));
	}
	return;
}



/**
 * Asynchronous function to retrieve and return all police stations from the database.
 *
 * Fetches data from the `police_station` model, excluding sensitive information such as the station password.
 * If no records are found, it responds with an empty array and a relevant message.
 * If records are found, it returns them in the response along with a success message.
 * Handles errors gracefully by logging them and passing a wrapped error to the next middleware.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const getPoliceStations = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.debug("Fetching all police stations");
		const stations = await police_station.findAll({
			attributes: {
				exclude: ["station_password"]
			}
		});
		
		if (stations.length === 0) {
			res.status(200).json({
				message: "No police stations found",
				data: []
			});
			return;
		}
		
		res.status(200).json({
			message: "Police stations fetched successfully",
			data: stations
		});
		
		console.debug("Police stations fetched successfully", stations);
		
		return;
		
	} catch (error) {
		console.error("Error fetching police stations", error);
		next(new WrappedError("Error fetching police stations", error as Error, 500));
	}
	return;
}

type createPoliceStationBody = {
	station_name: string;
	station_address: string;
	station_phone: string;
	station_email: string;
	station_latitude: number;
	station_longitude: number;
	station_image: string;
	station_password: string;
}

const createPoliceStationSchema = Joi.object<createPoliceStationBody>({
	station_name: Joi.string().required(),
	station_address: Joi.string().required(),
	station_phone: Joi.string().required().regex(/^\d{1,3}\d{10,14}$/),
	station_email: Joi.string().email().required(),
	station_latitude: Joi.number().required().min(-90).max(90),
	station_longitude: Joi.number().required().min(-180).max(180),
	station_image: Joi.string().required(),
	station_password: Joi.string().required().min(8).max(128)
});

/**
 * Handles the creation of a new police station.
 *
 * This asynchronous function validates the request body against a predefined schema,
 * extracts the necessary information for creating a police station, and attempts
 * to save the new station to the database.
 * Upon success, it sends a JSON response with
 * a success message and the created station's data.
 * In case of validation errors or
 * database-related errors, appropriate responses or errors are handled and propagated.
 *
 * @param {Request} req - The HTTP request object containing the payload for creating a police station.
 * @param {Response} res - The HTTP response object used to send back the appropriate client response.
 * @param {NextFunction} next - The callback to pass control to the next middleware for error handling.
 */
export const createPoliceStation = async (req: Request, res: Response, next: NextFunction) => {
	const { error } = createPoliceStationSchema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.message });
		return;
	}
	
	const { station_name, station_address, station_phone, station_email, station_latitude, station_longitude, station_image, station_password } = req.body;
	console.debug("Creating police station with name: ", station_name);
	
	try {
		const station = await police_station.create({
			station_id: uuidv4(),
			station_name,
			station_address,
			station_phone,
			station_email,
			station_latitude,
			station_longitude,
			station_image,
			station_password
		});
		
		res.status(201).json({
			message: "Police station created successfully",
			data: station
		});
		
		console.debug("Police station created successfully", station);
		
		return;
		
	} catch (error) {
		console.error("Error creating police station", error);
		if (error instanceof Error) {
			if (error.name === "SequelizeValidationError") {
				res.status(400).json({ message: error.message });
				return;
			}
			next(new WrappedError("Error creating police station", error, 500));
			return;
		}
		next(new WrappedError("Error creating police station", error as Error, 500));
	}
	return;
}



type updatePoliceStationBody = {
	station_name?: string;
	station_address?: string;
	station_phone?: string;
	station_email?: string;
	station_latitude?: number;
	station_longitude?: number;
	station_image?: string;
	station_password?: string;
}

const updatePoliceStationSchema = Joi.object<updatePoliceStationBody>({
	station_name: Joi.string().optional(),
	station_address: Joi.string().optional(),
	station_phone: Joi.string().optional().regex(/^\d{1,3}\d{10,14}$/),
	station_email: Joi.string().email().optional(),
	station_latitude: Joi.number().optional().min(-90).max(90),
	station_longitude: Joi.number().optional().min(-180).max(180),
	station_image: Joi.string().optional(),
	station_password: Joi.string().optional().min(8).max(128)
});

/**
 * Handles the update of a police station's information in the database.
 * The update is executed based on the police station ID provided in the route parameters.
 *
 * Validates the presence of the `police_station_id` in request parameters.
 * Ensures that the request body adheres to the validation schema defined by `updatePoliceStationSchema`.
 * Verifies that at least one field is provided in the request body for updating.
 *
 * If no police station is found with the given `police_station_id`, responds with a 404 status.
 * If successful, responds with the number of rows updated and a success message.
 * Propagates server errors to the error-handling middleware.
 *
 * @param {Request} req - The HTTP request object containing the route parameters and body.
 * @param {Response} res - The HTTP response object used to send back the HTTP response.
 * @param {NextFunction} next - The next middleware or error handler function in the chain.
 */
export const updatePoliceStation = async (req: Request, res: Response, next: NextFunction) => {
	const { police_station_id } = req.params;
	
	if (!police_station_id) {
		res.status(400).json({ message: "police_station_id is required in the params" });
		return;
	}
	
	const { error } = updatePoliceStationSchema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.message });
		return;
	}
	
	const updateData = req.body;
	
	// Check if any fields are provided for update
	if (Object.keys(updateData).length === 0) {
		res.status(400).json({ message: "No fields provided for update" });
		return;
	}
	
	console.debug("Updating police station with id: ", police_station_id);
	
	try {
		const [updated_rows] = await police_station.update(updateData, {
			where: { station_id: police_station_id }
		});
		
		if (updated_rows === 0) {
			res.status(404).json({ message: "No police station found with the given id" });
			return;
		}
		
		console.debug("Police station updated successfully", { updated_rows });
		
		res.status(200).json({
			message: "Police station updated successfully",
			data: { updated_rows }
		});
		
		return;
		
	} catch (error) {
		console.error("Error updating police station", error);
		next(new WrappedError("Error updating police station", error as Error, 500));
	}
}

type deletePoliceStationBody = {
	transfer_to_station_id?: string;
	force?: boolean;
}

const deletePoliceStationSchema = Joi.object<deletePoliceStationBody>({
	transfer_to_station_id: Joi.string().optional(),
	force: Joi.boolean().optional().default(false)
});

/**
 * Deletes a police station based on the given `police_station_id` in the request parameters.
 * Handles associated tickets for the police station by transferring them to another station,
 * setting their `station_id` to null, or rejecting the deletion if the necessary parameters are missing.
 *
 * The function performs the following steps:
 * 1. Validates the presence of `police_station_id` in the request parameters.
 * 2. Validates the request body using a predefined schema.
 * 3. Checks the ticket count associated with the station:
 *    - If tickets exist, it either forces deletion by nullifying ticket `station_id`
 *    or transfers tickets to another station.
 *    - Verifies the validity of the transfer target station if `transfer_to_station_id` is provided.
 * 4. Deletes the police station record if no blocking constraints exist.
 * 5. Handles errors and sends appropriate responses with detailed messages for each error scenario.
 *
 * Parameters:
 * - `req`: The request object containing the parameters and body.
 * - `res`: The response object to send the result.
 * - `next`: The next middleware function for error handling.
 *
 * Error Handling:
 * - Sends a 400 Bad Request response if required parameters or body fields are missing.
 * - Sends a 404 Not Found response if the police station or transfer target station is not found.
 * - Sends a 500 Internal Server Error response if an unexpected error occurs.
 */
export const deletePoliceStation = async (req: Request, res: Response, next: NextFunction) => {
	const { police_station_id } = req.params;
	
	if (!police_station_id) {
		res.status(400).json({ message: "police_station_id is required in the params" });
		return;
	}
	
	const { error } = deletePoliceStationSchema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.message });
		return;
	}
	
	const { transfer_to_station_id, force = false } = req.body;
	
	console.debug("Attempting to delete police station", { police_station_id, transfer_to_station_id, force });
	
	try {
		// Check if the station has any tickets
		const ticketCount = await ticket_data.count({
			where: { station_id: police_station_id }
		});
		
		console.debug("Found tickets for station", { ticketCount });
		
		if (ticketCount > 0) {
			if (!force && !transfer_to_station_id) {
				res.status(400).json({
					message: "Station has tickets. Must provide transfer_to_station_id or set force=true"
				});
				return;
			}
			
			if (force) {
				console.debug("Force deleting station - setting ticket station_ids to null");
				const updatedTicketsCount = await ticket_data.update(
					{ station_id: null },
					{ where: { station_id: police_station_id } }
				);
				
				console.debug("Updated tickets count", { updatedTicketsCount });
			} else {
				console.debug("Transferring tickets to new station", { transfer_to_station_id });
				// Verify the target station exists
				const targetStation = await police_station.findByPk(transfer_to_station_id);
				if (!targetStation) {
					res.status(404).json({ message: "Transfer target station not found" });
					return;
				}
				
				console.debug("Transferring tickets to new station", { transfer_to_station_id });
				
				const transferredTicketsCount = await ticket_data.update(
					{
						station_id: transfer_to_station_id,
						transfer_reason: "Station deletion transfer"
					},
					{ where: { station_id: police_station_id } }
				);
				
				console.debug("Tickets transferred successfully", { transferredTicketsCount });
			}
		}
		
		const destroyed_rows = await police_station.destroy({
			where: {
				station_id: police_station_id
			}
		});
		
		if (destroyed_rows === 0) {
			res.status(404).json({ message: "No police station found with the given id" });
			return;
		}
		
		console.debug("Police station deleted successfully", { destroyed_rows });
		
		res.status(200).json({
			message: "Police station deleted successfully",
			data: { destroyed_rows }
		});
		
		return;
	} catch (error) {
		console.error("Error deleting police station", error);
		next(new WrappedError("Error deleting police station", error as Error, 500));
	}
}


type getTicketsType = "active" | "inactive" | "all";

type getTicketsQuery = {
	type?: getTicketsType;
	sort_by?: "ticket_priority" | "createdAt";
	sort_order?: "asc" | "desc";
	page?: number;
	page_size?: number;
}

const getTicketsSchema = Joi.object<getTicketsQuery>({
	type: Joi.string().optional().valid("active", "inactive", "all"),
	sort_by: Joi.string().optional().valid("ticket_priority", "createdAt"),
	sort_order: Joi.string().optional().valid("asc", "desc"),
	page: Joi.number().optional().min(1),
	page_size: Joi.number().optional().min(1)
});

/**
 * Retrieves tickets for a specific police station based on the provided parameters with optional filtering,
 * sorting, and pagination.
 *
 * @param {Request} req - The HTTP request object containing parameters and query filters.
 * @param {Response} res - The HTTP response object used to send the response.
 * @param {NextFunction} next - The Next.js function to handle errors or pass execution to the next middleware.
 * @return {Promise<void>} A promise resolving with the response containing tickets data or appropriate error messages.
 */
export async function getTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const {police_station_id} = req.params;
		if (!police_station_id) {
			res.status(400).json({message: "police_station_id is required in the params"});
			return;
		}
		const {error} = getTicketsSchema.validate(req.query);
		if (error) {
			res.status(400).json({message: error.message});
			return;
		}
		const type = (req.query.type as getTicketsType) || "active";
		const sort_by = (req.query.sort_by as string) || "createdAt";
		const sort_order = (req.query.sort_order as string) || "asc";
		const page = parseInt(req.query.page as string) || 1;
		const page_size = parseInt(req.query.page_size as string) || 10;
		
		// Verify station exists
		const station = await police_station.findByPk(police_station_id);
		if (!station) {
			res.status(404).json({message: "Police station not found"});
			return;
		}
		
		// Build where clause based on type
		const whereClause: any = {
			station_id: police_station_id
		};
		
		switch (type.toLowerCase()) {
			case "active":
				whereClause.status = "Active";
				break;
			case "inactive":
				whereClause.status = ["Resolved", "Closed"];
				break;
			case "all":
				// No status filter needed
				break;
			default:
				res.status(400).json({message: "Invalid type parameter. Use 'all', 'active', or 'inactive'"});
				return;
		}
		
		// Get tickets with pagination
		const tickets = await ticket_data.findAndCountAll({
			where: whereClause,
			include: [{
				model: user_data,
				attributes: ['id', 'phone_number']
			}],
			order: [[sort_by, sort_order]],
			limit: page_size,
			offset: (page - 1) * page_size
		});
		
		const total_pages = Math.ceil(tickets.count / page_size);
		
		res.status(200).json({
			message: "Tickets retrieved successfully",
			data: tickets,
			pagination: {
				page,
				page_size,
				total_pages,
			}
		});
		
	} catch (error) {
		console.error("Error getting tickets", error);
		next(new WrappedError("Error getting tickets", error as Error, 500));
	}
}


type passwordCheckBody = {
	station_password: string;
}

const passwordCheckSchema = Joi.object<passwordCheckBody>({
	station_password: Joi.string().required().min(8).max(128)
});


/**
 * Handles password validation for a police station.
 *
 * @param {Request} req The HTTP request object, containing the police_station_id in the parameters
 * and station_password in the body for validation.
 * @param {Response} res The HTTP response object used to send the appropriate response status
 * and message back to the client.
 * @param {NextFunction} next A callback function to pass control to the next middleware
 * in the chain if an error is encountered.
 * @return {Promise<void>} Sends an HTTP response indicating the result of the password check operation.
 * This could be a
 * success status with a confirmation, a failure due to invalid inputs, or an error if exceptions occur.
 */
export async function PoliceStationPasswordCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
	const { police_station_id } = req.params;
	const { station_password } = req.body;
	
	if (!police_station_id) {
		res.status(400).json({ message: "police_station_id is required in the params" });
		return;
	}
	
	const { error } = passwordCheckSchema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.message });
		return;
	}
	
	try {
		console.debug("Attempting to login to police station", { police_station_id, station_password });
		const station = await police_station.findByPk(police_station_id);
		
		if (!station) {
			res.status(404).json({ message: "Police station not found" });
			return;
		}
		
		if (station.station_password.trim() !== String(station_password).trim()) {
			console.debug("Password check failed for station",
				{ station_id: police_station_id },
				{ password_provided: station_password });
			res.status(401).json({ message: "Invalid password", data: {is_password_correct: false} });
			return;
		}
		
		res.status(200).json({ message: "Password check successful", data: {is_password_correct: true} });
		
		console.debug("Password check successful for station", { station_id: police_station_id });
		return
		
		
	} catch (error) {
		console.error("Error logging in", error);
		next(new WrappedError("Error logging in", error as Error, 500));
	}
}

