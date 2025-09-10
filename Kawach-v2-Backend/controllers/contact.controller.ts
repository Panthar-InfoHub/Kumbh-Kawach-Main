import WrappedError from "@/error/wrapped.error";
import emergency_contact from "@/models/emergency.contact.model";
import { emergency_contact_relationship } from "@/types";
import { Request, Response, NextFunction } from "express";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

/**
 * Retrieves emergency contacts associated with a user.
 *
 * This function handles an incoming HTTP request to fetch all emergency contacts linked
 * to a user's ID. The `user_id` parameter is extracted from the request's path parameters,
 * which is validated by the `user_id_checker` middleware prior to execution.
 *
 * If no contacts are found for the provided user ID, a response with an appropriate message
 * and an empty data array is returned with a 200 status code.
 *
 * If contacts are found, they're returned in the response body along with a success message.
 *
 * In case of an exception during the retrieval of data, the error is logged and passed to the next
 * middleware as a `WrappedError`.
 *
 * @param {Request} req - The HTTP request object, containing parameters and other request data.
 * @param {Response} res - The HTTP response object, used to send back data to the client.
 * @param {NextFunction} next - The next middleware function in the Express.js request-response cycle.
 */
export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
	const { user_id } = req.params; // validated by the user_id_checker middleware
	
	try {
		console.debug("Fetching contacts for user with id: ", user_id);
		const contacts = await emergency_contact.findAll({
			where: {
				user_id
			}
		});
		
		if (contacts.length === 0) {
			res.status(200).json({
				message: "No emergency contacts found",
				data: []
			});
			return;
		}
		
		res.status(200).json({
			message: "Contacts fetched successfully",
			data: contacts
		});
		
		console.debug("Contacts fetched successfully", contacts);
		
		return;
		
	} catch (error) {
		console.error("Error fetching contacts", error);
		next(new WrappedError("Error fetching contacts", error as Error, 500));
	}
	return;
}

/**
 * Represents the body structure for creating a contact.
 */
type createContactBody = {
	name: string;
	phone_number: string;
	relationship: emergency_contact_relationship;
	email: string | null;
}

/**
 * Schema for validating the creation of a contact object.
 *
 * This schema ensures that required fields are provided and adhere
 * to specific constraints.
 * It validates contact details such as
 * name, phone number, relationship type, and optionally email.
 *
 * - `name`: A required string representing the name of the contact.
 * - `phone_number`: A required string representing the contact's phone number.
 * - `relationship`: A required string representing the relationship to the contact's owner.
 *   Accepted values are "Parent", "Spouse", "Child", "Friend", or "Other".
 * - `email`: An optional string representing the contact's email address.
 * This field can also be null.
 */
const createContactSchema = Joi.object<createContactBody>({
	name: Joi.string().required(),
	phone_number: Joi.string().required(),
	relationship: Joi.string().required().valid("Parent", "Spouse", "Child", "Friend", "Other"),// Same as the type `emergency_contact_relationship`
	email: Joi.string().optional().allow(null),
});

/**
 * Asynchronous function to handle the creation of a contact for a specified user.
 *
 * This function expects the `user_id` parameter in the request URL to be validated
 * by the `user_id_checker` middleware before invocation.
 * The request body is validated
 * using the `createContactSchema` to ensure a proper data format.
 * It includes properties
 * for contact details such as `name`, `phone_number`, `relationship`, and `email`.
 *
 * If an email is provided in the request body, the function attempts to retrieve the Firebase UID
 * associated with the email.
 * In the event the user doesn't possess a Firebase UID, it is handled gracefully
 * as a non-critical error.
 * On successful data validation, a new contact is created in the database.
 *
 * Responses:
 *   - On successful creation, the response includes a 201 HTTP status with a success message
 *     and the newly created contact data.
 *   - If validation fails or an invalid `user_id` is provided, it responds with a 400 HTTP status
 *     and the relevant error message.
 *   - For other unexpected errors, an internal WrappedError is passed to the error-handling middleware.
 *
 * @param {Request} req - The HTTP request object containing parameters like `user_id` and contact details.
 * @param {Response} res - The HTTP response object used to communicate results back to the client.
 * @param {NextFunction} next - Middleware function used for passing control to the next error handler.
 */
export const createContact = async (req: Request, res: Response, next: NextFunction) => {
	const { user_id } = req.params; // validated by the user_id_checker middleware
	console.debug("Creating contact for user with id: ", user_id);
	
	const { error } = createContactSchema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.message });
		return;
	}
	
	
	const { name, phone_number, relationship, email } = req.body;
	console.debug("Creating contact for user with id: ", user_id);
	
	let contact_firebase_uid: string | null = null;
	
	if (email) {
		try {
			const userRecord = await getAuth().getUserByEmail(email);
			contact_firebase_uid = userRecord.uid;
			
		} catch(e) {
			if (e instanceof FirebaseAuthError) {
				console.log(`Error finding emergency contact's firebase uid using email.
                     This is not an error, it is expected if the user does not have a firebase uid.`, e);
			}
			else {
				console.error("Error finding emergency contact's firebase uid using email", e);
			}
		}
	}
	
	try {
		
		const contact = await emergency_contact.create({
			contact_id: uuidv4(),
			user_id,
			contact_firebase_uid,
			name,
			phone_number,
			relationship,
			email
		});
		
		res.status(201).json({
			message: "Contact created successfully",
			data: contact
		});
		
		console.debug("Contact created successfully", contact);
		
		return;
		
		
	} catch (error) {
		console.error("Error creating contact", error);
		if (error instanceof Error) {
			if (error.name === "SequelizeForeignKeyConstraintError") {
				res.status(400).json({ message: "Invalid user id" });
				return;
			}
			if (error.name === "SequelizeValidationError") {
				res.status(400).json({ message: error.message });
				return;
			}
			else {
				next(new WrappedError("Error creating contact", error, 500));
				return
			}
		}
		next(new WrappedError("Error creating contact", error as Error, 500));
	}
	return;
}

/**
 * Handles the deletion of a contact record associated with a specific user.
 * The `deleteContact` function retrieves the user ID and contact ID from the request parameters,
 * validates the presence of the required parameters, and attempts to delete the record from the database.
 *
 * Middleware Requirements:
 * - `user_id_checker`: Ensures the validity of the `user_id` parameter in the request.
 * - `contact_id_checker`: Ensures the validity of the `contact_id` parameter in the request.
 *
 * Request Parameters:
 * - `user_id`: The identifier of the user associated with the contact.
 * - `contact_id`: The unique identifier of the contact to be deleted.
 *
 * Response:
 * - On success:
 *   - Status: 200
 *   - Message: "Contact deleted successfully"
 *   - Data: Includes the number of rows destroyed in the deletion process.
 * - On failure due to missing `contact_id`:
 *   - Status: 400
 *   - Message: "contact_id is required in the params"
 *
 * Error Handling:
 * If an unexpected error occurs during the deletion process, it passes the wrapped error to the next middleware.
 *
 * Debugging Information:
 * Logs the contact ID being processed during deletion and a success or error message accordingly.
 */
export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
	const { user_id } = req.params; // validated by the user_id_checker middleware
	const { contact_id } = req.params; // validated by the contact_id_checker middleware
	
	if (!contact_id) {
		res.status(400).json({ message: "contact_id is required in the params" });
		return;
	}
	console.debug("Deleting contact with id: ", contact_id);
	
	try {
		const destroyed_rows = await emergency_contact.destroy({
			where: {
				contact_id,
				user_id
			}
		});
		
		res.status(200).json({
			message: "Contact deleted successfully",
			data: {destroyed_rows}
		});
		
		console.debug("Contact deleted successfully", destroyed_rows);
		
		return;
	} catch (error) {
		console.error("Error deleting contact", error);
		next(new WrappedError("Error deleting contact", error as Error, 500));
	}
	return;
}


/**
 * Represents the structure of the request body for updating a contact.
 *
 */
type updateContactBody = {
	name: string;
	phone_number: string;
	relationship: emergency_contact_relationship;
	email: string | null;
}

/**
 * Schema definition for validating the update contact request body.
 * Uses Joi for schema validation.
 *
 * The schema includes the following optional fields:
 * - name: A string representing the name of the contact.
 * - phone_number: A string representing the contact's phone number.
 * - relationship: A string describing the relationship with the contact.
 * - email: A string representing the contact's email address, which can also be null.
 */
const updateContactSchema = Joi.object<updateContactBody>({
	name: Joi.string().optional(),
	phone_number: Joi.string().optional(),
	relationship: Joi.string().optional(),
	email: Joi.string().optional().allow(null)
});

/**
 * Asynchronous function to update an emergency contact in the database.
 *
 * This function receives `user_id` and `contact_id` from request parameters,
 * which are verified by middlewares prior to this method's invocation.
 * It also validates the request body using a predefined schema.
 * Attributes such as
 * name, phone number, relationship, and email can be updated.
 *
 * If an email is provided in the request body, the function attempts to retrieve
 * the Firebase UID associated with that email.
 * In cases where the Firebase UID
 * retrieval fails but the user doesn't have a Firebase UID, the process continues without error.
 *
 * Updates the relevant contact information in the database if all validations pass.
 * If no matching `contact_id` is found in the database, it sends a 404 response.
 * In the event of validation errors in the request body, or unmatched `contact_id`,
 * appropriate errors and responses are returned.
 * Handles internal server errors by passing them to the next middleware.
 *
 * @param {Request} req - The request object containing parameters and body.
 * @param {Response} res - The response object used to send status and data back to the client.
 * @param {NextFunction} next - Middleware function to pass control to the next handler in case of errors.
 */
export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
	const { user_id } = req.params; // validated by the user_id_checker middleware
	const { contact_id } = req.params; // validated by the contact_id_checker middleware
	
	if (!contact_id) {
		res.status(400).json({ message: "contact_id is required in the params" });
		return;
	}
	
	const { error } = updateContactSchema.validate(req.body);
	
	if (error) {
		res.status(400).json({ message: error.message });
		return;
	}
	
	const { name, phone_number, relationship, email } = req.body;
	
	console.debug("Updating contact with id: ", contact_id);
	
	let contact_firebase_uid: string | null = null;
	
	if (email) {
		// Check if a user has firebase_uid
		try {
			console.debug("Finding emergency contact's firebase uid using email: ", email);
			const userRecord = await getAuth().getUserByEmail(email);
			contact_firebase_uid = userRecord.uid;
			
		} catch(e) {
			if (e instanceof FirebaseAuthError) {
				console.log(`Error finding emergency contact's firebase uid using email.
                     This is not an error, it is expected if the user does not have a firebase uid.`, e);
			}
			else {
				console.error("Error finding emergency contact's firebase uid using email", e);
			}
		}
	}
	
	
	try {
		const updated_rows = await emergency_contact.update({
			name,
			phone_number,
			relationship,
			email,
			contact_firebase_uid
		}, {
			where: { contact_id, user_id }
		});
		
		if (updated_rows[0] === 0) {
			res.status(404).json({ message: "No contact found with the given contact_id" });
			return;
		}
		
		console.debug("Contact updated successfully", {updated_rows});
		
		res.status(200).json({
			message: "Contact updated successfully",
			data: updated_rows
		});
		
		return;
		
	} catch (error) {
		console.error("Error updating contact", error);
		next(new WrappedError("Error updating contact", error as Error, 500));
	}
}


