import { NextFunction, Request, Response } from "express";
import userdata from "../models/user.data.model.js";
import Joi from "joi";
import WrappedError from "@/error/wrapped.error.js";
import sequelize from "@/lib/seq.js";
import { Transaction } from "sequelize";
import user_permission from "@/models/user.permission.model.js";
import {FirebaseAuthError, getAuth, UserRecord} from "firebase-admin/auth";
import Mailer from "@/lib/mailer";

/**
 * Represents a request payload for onboarding a new user.
 *
 * This type is used to encapsulate information provided during the onboarding process,
 * including the Firebase user identifier, the user's date of birth, and their Firebase
 * Cloud Messaging (FCM) identifier.
 *
 * Properties:
 * - firebase_uid: A string representing the unique identifier for the user in Firebase.
 * - date_of_birth: A Date object indicating the user's date of birth.
 * - fcm_id: A string that identifies the Firebase Cloud Messaging (FCM) registration ID for the user's device.
 */
type onboard_request = {
	firebase_uid: string;
	date_of_birth: Date;
	fcm_id: string;
}

/**
 * Schema definition for onboarding request validation.
 *
 * This variable defines the schema used to validate the structure
 * and properties of an onboarding request.
 * It ensures required
 * fields and types are correctly provided in the request payload.
 *
 * - `firebase_uid`: A required string representing the Firebase UID.
 * - `date_of_birth`: A required date representing the user's date of birth.
 * - `fcm_id`: An optional string or null field representing the Firebase Cloud Messaging ID.
 */
const onboard_req_schema = Joi.object({
	firebase_uid: Joi.string().required(),
	date_of_birth: Joi.date().required(),
	fcm_id: Joi.string().allow(null)
});

export const googleLoginCallback = async (req: Request, res: Response, next: NextFunction) => {
	// Validate the request body against the onboarding schema
	const {error} = onboard_req_schema.validate(req.body);
	
	if (error) {
		res.status(400).json({
			message: error.message
		});
		return;
	}
	
	// Destructure validated fields from the request body
	const {firebase_uid, date_of_birth, fcm_id}: onboard_request = req.body;
	
	let userRecord: UserRecord;
	
	try {
		// Fetch Firebase user using the provided Firebase UID
		const auth = getAuth();
		userRecord = await auth.getUser(firebase_uid);
		if (!userRecord) {
			res.status(400).json({
				message: "Invalid firebase uid"
			});
			return;
		}
	} catch (error) {
		// Handle Firebase authentication-specific errors
		console.error(error);
		if (error instanceof FirebaseAuthError) {
			const statusCode = error.code === "auth/user-not-found" ? 404 : 400;
			res.status(statusCode).json({
				message: error.code
			});
			return;
		}
		throw error; // Pass non-authentication errors further up
	}
	
	console.debug(firebase_uid, date_of_birth, fcm_id);
	
	try {
		// Check if the user already exists in the database
		const user = await userdata.findByPk(firebase_uid);
		if (user) {
			console.debug("User already exists. Updating fcm_id.");
			
			// Update the user's FCM ID
			await user.update({
				fcm_id: fcm_id
			});
			
			res.status(200).json({
				message: "User already exists. Login is successful."
			});
			
			// Send an email notification for successful login
			const mailer = new Mailer();
			await mailer.sendSignInNotificationEmail(req, userRecord.email || "no email");
			
			return;
		}
	} catch (error) {
		// Log and pass database-related errors to middleware
		console.error(error);
		next(error);
		return;
	}
	
	// Proceed after this point if no user exists in the database yet
	let transaction: Transaction;
	
	try {
		// Start a database transaction for creating a new user
		transaction = await sequelize.transaction();
	} catch (error) {
		// Log and pass transaction start errors to middleware
		console.error(error);
		next(error);
		return;
	}
	
	try {
		// Create new user details in the database
		await userdata.create({
			id: firebase_uid,
			dob: date_of_birth,
			fcm_id: fcm_id
		}, {transaction});
		
		// Assign default user permissions in the database
		await user_permission.create({
			id: firebase_uid,
			allow_sms_notifications: true,
			allow_email_notifications: true,
			allow_push_notifications: true,
			generate_sos_alerts: true,
			allow_ai_features: true,
		}, {transaction});
		
		// Commit the transaction after successful operations
		await transaction.commit();
		
		res.status(201).json({
			message: "User onboarded successfully"
		});
		
		// Send a welcome email upon successful onboarding
		const mailer = new Mailer();
		await mailer.sendWelcomeMail(userRecord.email || "no email");
		
		return;
	} catch (error) {
		// Roll back the transaction on failure
		await transaction.rollback();
		
		console.error(error);
		if (error instanceof Error) {
			if (error.name === "SequelizeUniqueConstraintError") {
				throw new WrappedError("User already exists", error, 409);
			}
		}
		// Pass other errors to middleware for centralized handling
		next(error);
	}
}