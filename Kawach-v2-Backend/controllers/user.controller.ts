import WrappedError from "@/error/wrapped.error";
import user_data from "@/models/user.data.model";
import user_permission from "@/models/user.permission.model";
import { sex, user_permissions } from "@/types";
import { Request, Response, NextFunction } from "express";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import Joi from "joi";



/**
 * Asynchronous function to fetch user details from the database and Firebase.
 *
 * This function retrieves a user based on the user ID provided in the request
 * parameters.
 * Data is fetched from both the database and Firebase authentication
 * service.
 * If the user is not found in the database, a 404 error response is returned.
 * If any other issues occur during the process, an error is forwarded to the
 * error-handling middleware.
 *
 * @param {Request} req - The Express request object, containing the user ID in the params.
 * @param {Response} res - The Express response object, used to send back the result or error response.
 * @param {NextFunction} next - The next middleware function in the request-response cycle, used for error handling.
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;
    console.debug("Fetching user with id: ", user_id);
    
    try {
        const user = await user_data.findByPk(user_id);

        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
    
        console.debug("User found in database ", user, "fetching details from firebase");
    
        const auth = getAuth();
        const userDetails = await auth.getUser(user_id);
    
        console.debug("User details fetched from firebase ", userDetails);
    
    
    
        res.status(200).json({message: "User details fetched successfully", data: {
            db: user,
            firebase: userDetails
        }});
    
        return;

    }
    catch (error) {
        console.error("Error fetching user", error);
        next(new WrappedError("Error fetching user", error as Error, 500));
        return;
    }
}

const updatePermissionsSchema = Joi.object<user_permissions>({
    allow_sms_notifications: Joi.boolean().required(),
    allow_email_notifications: Joi.boolean().required(),
    allow_push_notifications: Joi.boolean().required(),
    generate_sos_alerts: Joi.boolean().required(),
    allow_ai_features: Joi.boolean().required()
});

/**
 * Asynchronously updates user permissions in the database.
 *
 * This function validates the request body against a predefined schema and updates
 * the permissions of a user identified by the provided user ID in the request parameters.
 * Upon a successful update, the function responds with a success message and affected count.
 * In case of validation errors, it responds with a 400-status and validation error message.
 * If an error occurs during the update process, it invokes the error-handling middleware.
 *
 * @async
 * @function
 * @param {Request} req - The HTTP request object containing user ID in `req.params` and permissions data in `req.body`.
 * @param {Response} res - The HTTP response object to send the status and result of the operation.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @throws {WrappedError} - Throws a wrapped error when an issue occurs during permission update.
 */
export const updatePermissions = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;
   
    const { error } = updatePermissionsSchema.validate(req.body);

    if (error) {
        res.status(400).json({
            message: error.message
        });
        return;
    }

    console.debug("Updating permissions for user with id: ", user_id);

    try {
        const permissions  : user_permissions = req.body;

    const affected_count = await user_permission.update({
        ...permissions
    }, {
        where: {
            id: user_id
        }
    });

    res.status(200).json({message: "Permissions updated successfully", data: {affected_count}});

    return;
    } catch (error) {
        console.error("Error updating permissions", error);
        next(new WrappedError("Error updating permissions", error as Error, 500));
    }
    return;
}

/**
 * Fetches and returns the permissions for a specific user based on the user ID provided in the request parameters.
 *
 * If the user permissions are found, they're returned in the response with a status of 200.
 * If no permissions are found for the specified user ID, a 404 response is sent with an appropriate message.
 * If an error occurs during the operation,
 * it is handled and passed to the next middleware with an appropriate status and message.
 *
 * @param {Request} req - The request object, containing the parameters with the user ID.
 * @param {Response} res - The response object used to send back the permissions or error message.
 * @param {NextFunction} next - The next middleware function to handle errors, if any.
 */
export const getPermissions = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;
    

    try {
        console.debug("Fetching permissions for user with id: ", user_id);
        const permissions = await user_permission.findByPk(user_id);
        if (!permissions) {
            res.status(404).json({message: "Permissions not found"});
            return;
        }

        console.debug("Permissions fetched successfully", permissions);
        res.status(200).json({message: "Permissions fetched successfully", data: permissions});
    } catch (error) {
        console.error("Error fetching permissions", error);
        next(new WrappedError("Error fetching permissions", error as Error, 500));
    }
    return;
}


type updateProfileBody = {
    dob?: Date;
    sex?: sex;
    phone_number?: string;
    fcm_id?: string;
}

const updateProfileSchema = Joi.object<updateProfileBody>({
    dob: Joi.date().optional(),
    sex: Joi.string().optional().valid("Male", "Female", "Other"),
    phone_number: Joi.string().optional().regex(/^\d{1,3}\d{10,14}$/),
    fcm_id: Joi.string().optional()
});

/**
 * Handles the update of a user's profile.
 *
 * This async function validates and updates user profile information such as
 * date of birth, sex, phone number, and FCM (Firebase Cloud Messaging) ID.
 * It uses the `updateProfileSchema` to validate the incoming request body
 * and then updates the user record in the database based on the provided user ID.
 *
 * @param {Request} req - The request object containing parameters and body data.
 * @param {Response} res - The response object used to send responses to the client.
 * @param {NextFunction} next - The next middleware function in the chain.
 *
 * @throws {WrappedError} - Thrown when a server error occurs during profile update.
 *
 * Error Responses:
 * - 400: If the request body is invalid or contains no valid fields to update.
 * - 404: If the user is not found in the database.
 *
 * Success Response:
 * - 200: When the profile update is successful, the response includes the affected count.
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
        res.status(400).json({message: error.message});
        return;
    }
    const { dob, sex, phone_number, fcm_id } = req.body;

    if (!dob && !sex && !phone_number && !fcm_id) {
        res.status(400).json({message: "No valid fields to update"});
        return;
    }

    try {
        console.debug("Updating profile for user with id: ", user_id);
        const affected_count = await user_data.update({
            dob, sex, phone_number, fcm_id
        }, {
            where: {
                id: user_id
            }
        });

        if (affected_count[0] === 0) {
            console.debug("Affected count is 0, user not found");
            res.status(404).json({message: "User not found"});
            return;
        }

        res.status(200).json({message: "Profile updated successfully", data: {affected_count}});
        return;
    } catch (error) {
        console.error("Error updating profile", error);
        next(new WrappedError("Error updating profile", error as Error, 500));
    }
    return;
}



/**
 * Asynchronous function to ban a user based on their unique ID.
 *
 * This function disables a user's account by using Firebase Authentication.
 * It checks if the `user_id` parameter is provided in the request,
 * fetches the existing user's details, and updates their `disabled` status to `true`.
 * Responds appropriately in cases of missing user ID, non-existing user, already banned user,
 * or any unexpected errors.
 *
 * @param {Request} req - The request object, containing user ID in `req.params`.
 * @param {Response} res - The response object used to send appropriate HTTP responses.
 * @param {NextFunction} next - The next middleware function for error handling.
 *
 * @throws {WrappedError} - Throws a wrapped error if Firebase Authentication throws an error or if unexpected errors occur.
 */
export const banUser = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;

    if (!user_id) {
        res.status(400).json({message: "User id is required"});
        return;
    }

    const auth = getAuth();

    console.debug("Banning user with id: ", user_id);

    try {

        console.debug("Fetching user to check for existing ban");
        const user = await auth.getUser(user_id);
        if (!user) {
            res.status(404).json({message: "User not found"});
            return;
        }

        if (user.disabled) {
            console.debug("User is already banned");
            res.status(409).json({message: "User is already banned"});
            return;
        }
        

        await auth.updateUser(user_id, {
            disabled: true
        });
    
        res.status(200).json({message: "User banned successfully"});
        return;
    }

    catch (error) {
        console.error("Error banning user", error);
        if (error instanceof FirebaseAuthError) {
            next(new WrappedError(error.code, error, 500));
            return
        }
        next(new WrappedError("Error banning user", error as Error, 500));
    }
    return;
}


/**
 * Asynchronous function to unban a user based on their unique user ID.
 *
 * This function retrieves the user information using Firebase Authentication.
 * If the user is found and their account is disabled, the function re-enables the account
 * (sets `disabled` to `false`).
 * If the user is already unbanned or not found, appropriate
 * error messages are returned.
 *
 * Handles errors that might occur during the unban operation, including invalid user ID,
 * user not found, or issues with Firebase Authentication.
 *
 * @param {Request} req - The Express request object, expected to have a `params` property containing `user_id`.
 * @param {Response} res - The Express response object, used to send status and messages back to the client.
 * @param {NextFunction} next - The Express next middleware function, used to forward errors.
 */
export const unbanUser = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;

    if (!user_id) {
        res.status(400).json({message: "User id is required"});
        return;
    }

    const auth = getAuth();

    console.debug("Unbanning user with id: ", user_id);
    try {

        console.debug("Fetching user to check for existing unban");
        const user = await auth.getUser(user_id);
        if (!user) {
            res.status(404).json({message: "User not found"});
            return;
        }

        if (!user.disabled) {
            console.debug("User is already unbanned");
            res.status(409).json({message: "User is already unbanned"});
            return;
        }

        await auth.updateUser(user_id, {
            disabled: false
        });
    
        res.status(200).json({message: "User unbanned successfully"});
        return;
    }

    catch (error) {
        console.error("Error unbanning user", error);
        if (error instanceof FirebaseAuthError) {
            next(new WrappedError(error.code, error, 500));
            return
        }

        next(new WrappedError("Error unbanning user", error as Error, 500));
    }
    return;
}
