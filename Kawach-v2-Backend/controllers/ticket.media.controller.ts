import {NextFunction, Request, Response} from "express";
import ticket, {InitialMediaAnalysisType} from "@/models/ticket.data.model";

import axios from "axios";
import * as process from "node:process";
import Joi from "joi";
import user_data from "@/models/user.data.model";


const ticketIdSchema = Joi.object({
    ticket_id: Joi.string().uuid().required(),
    user_id: Joi.string().allow()
});

// Media schemas with complete validation
const imageMediaSchema = Joi.object({
    image_id: Joi.string().uuid().required(),
    image_url: Joi.string().uri().required(),
    bucket_url: Joi.string().required(),
    created_at: Joi.date().required().max('now')
});

const audioMediaSchema = Joi.object({
    audio_id: Joi.string().uuid().required(),
    audio_url: Joi.string().uri().required(),
    bucket_url: Joi.string().required(),
    created_at: Joi.date().required().max('now')
});

const videoMediaSchema = Joi.object({
    video_id: Joi.string().uuid().required(),
    video_url: Joi.string().uri().required(),
    bucket_url: Joi.string().required(),
    created_at: Joi.date().required().max('now')
});
type videoSummaryResponse = {
    description: {
        english: string, hindi:string, confidence_score: string
    }
}

type imageSummaryResponse = {
    description: {
        english: string, hindi:string, confidence_score: string, identified_location: string,
    }
}


type audioTranscriptResponse = {
    transcript: {
        english: string, hindi:string
    }
}


// Helper function to prevent duplicate media entries
/**
 * Adds a new media item to the existing media array if it doesn't already exist.
 * A media is considered unique based on its `bucket_url` property.
 *
 * @param {Array} existingMedia - The array of existing media objects.
 * @param {Object} newMedia - The new media object to be added.
 * @return {Array} A new array containing the existing media and the new media if it was unique,
 */
function addUniqueMedia(existingMedia: any[], newMedia: any): Array<any> {
    const mediaSet = new Set(existingMedia.map(m => m.bucket_url));

    if (!mediaSet.has(newMedia.bucket_url)) {
        return [...existingMedia, newMedia];
    }
    return existingMedia;
}

/**
 * Generates a ticket summary and determines its priority based on the provided video.
 * Communicates with an external AI server to process the input data and return results.
 *
 * @param {string} bucket_url - The URL of the video file stored in a bucket to be analyzed.
 * @param {string} sex - The sex or gender information used in analysis.
 * @param {number} age - The age of the individual for whom the analysis is conducted.
 * @return {Promise<InitialMediaAnalysisType|null>} A promise that resolves to the ticket summary and priority report.
 * Returns null if an error occurs.
 */
export async function generateTicketSummaryAndPriority(bucket_url: string, sex:string, age:number): Promise<InitialMediaAnalysisType | null> {
    console.log({sex, age})
    const url = `${process.env.AI_SERVER_URL}/media/process/video/generate_initial_summary_and_priority`;
    try {
        const response = await axios.post(url, {
            bucket_url,
            sex,
            age: 18,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.AI_SERVER_SECRET_TOKEN}`
            },
            timeout: 5000000,
        });


        if (response.data) {
            console.warn({data: response.data})

            const report: InitialMediaAnalysisType = response.data

            if ("summary" in report) {
                return report
            } else {
                return null
            }
        } else {
            console.log("Response data is empty")
            return null
        }
    } catch (error) {
        console.error("Error fetching ticket summary and priority:", (error as Error).message);
        return null
    }
}



/**
 * Generates a summary for a video file stored at the specified bucket URL.
 * The method sends a request to the AI server to process the video and generate a textual summary.
 *
 * @param {string} bucket_url - The URL of the bucket where the video file is stored.
 * or null if an error occurs or the response data is empty.
 */
export async function generateVideoSummary(bucket_url:string) {
    const url = `${process.env.AI_SERVER_URL}/media/process/video`;
    try {
        const response = await axios.post(url, {
            bucket_url,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.AI_SERVER_SECRET_TOKEN}`
            },
            timeout: 5000000,
        });

        if (response.data) {
            console.warn({data: response.data})
            const data: videoSummaryResponse = response.data

            return data.description
        } else {
            console.error("Response data is empty")
            return null
        }
    } catch (error) {
        console.error("Error generating video summary", error);
        return null
    }
}


/**
 * Generates a summary for a given image by sending a request to an AI processing server.
 *
 * @param {string} bucket_url - The URL of the image stored in a cloud bucket that needs to be summarized.
 */
export async function generateImageSummary(bucket_url:string) {
    const url = `${process.env.AI_SERVER_URL}/media/process/image`;
    try {
        const response = await axios.post(url, {
            bucket_url,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.AI_SERVER_SECRET_TOKEN}`
            },
            timeout: 5000000,
        });

        if (response.data) {

            const data: imageSummaryResponse = response.data
            console.log("Response data",{data: response.data})

            return data.description
        } else {
            console.error("Response data is empty")
            return null
        }
    } catch (error) {
        console.error("Error generating image summary", error);
        return null
    }
}

/**
 * Generates a transcript for an audio file stored in a cloud bucket.
 *
 * @param {string} bucket_url - The URL of the bucket where the audio file is stored.
 */
export async function generateAudioTranscript(bucket_url: string) {
     const url = `${process.env.AI_SERVER_URL}/media/process/audio`;
    try {
        const response = await axios.post(url, {
            bucket_url,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.AI_SERVER_SECRET_TOKEN}`
            }
        });

        if (response.data) {

            const data: audioTranscriptResponse = response.data

            return data.transcript
        } else {
            throw new Error("Response data is empty.");
        }
    } catch (error) {
        console.error("Error generating audio transcript", error);
        return null
    }
}

// Add image to ticket
/**
 * Asynchronously adds an image to a ticket for a specific user.
 *
 * This function validates the request parameters and body against predefined schemas,
 * retrieves the ticket from the database, and updates its images with the provided
 * image data.
 * If the ticket is found and the provided image is unique, it is added
 * to the ticket's images.
 * Additionally, the function attempts to generate a summary
 * for the image using an external AI service and attaches the transcript data to the image.
 *
 * In case of errors during validation, database queries, or external service invocations,
 * appropriate responses are sent to the client, or the error is passed to the next middleware.
 *
 * Error Scenarios:
 * - Returns a 400 status code if request validation fails.
 * - Returns a 404 status code if the ticket is not found.
 * - Passes any internal server errors to the error-handling middleware.
 *
 * Success Scenarios:
 * - Returns a 201 status code with the updated images on successful addition.
 *
 * @param req The HTTP request object containing ticket ID, user ID, and image data.
 * @param res The HTTP response object used to send back the result.
 * @param next The NextFunction to pass control to the next middleware in case of an error.
 */
export const addTicketImage = async (req: Request, res: Response, next: NextFunction) => {
    console.debug(`Adding image to ticket: ${req.params.ticket_id}`);

    const { error: paramsError } = ticketIdSchema.validate(req.params);
    const { error: bodyError } = imageMediaSchema.validate(req.body);

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
        console.debug(`Finding ticket record for image addition`);
        const ticketRecord = await ticket.findOne({ where: { ticket_id, user_id }});

        if (!ticketRecord) {
            console.debug(`No ticket found for image addition: ${ticket_id}`);
            res.status(404).json({ message: "Ticket not found" });
            return;
        }

        const updatedImages = addUniqueMedia(ticketRecord.images, req.body);
        console.debug(`Updating ticket with new image, total unique images: ${updatedImages.length}`);


        try {
            const report = await generateImageSummary(req.body.bucket_url)
            ticketRecord.images = updatedImages.map((img) => {
                if (img.image_id === req.body.image_id) {
                    return {
                        ...img,
                        transcript: report ? report : {
                            hindi: "No transcript available",
                            english: "No transcript available",
                            confidence_score: "0",
                            identified_location: "Unknown"
                        }
                    };
                }
                return img;
            });

        } catch (e) {
            console.error("Response from AI server has an error", e);
        }

        await ticketRecord.save();

        res.status(201).json({
            message: "Image added successfully",
            data: ticketRecord.images
        });

        return;

    } catch (e) {
        console.error("Error adding image to ticket:", e);
        next(e);
    }
}

// Add audio to the ticket
/**
 * Asynchronously handles the addition of an audio file to a ticket.
 * Validates the request parameters and body using predefined schemas, and ensures that the ticket exists,
 * is active, and belongs to the user making the request before proceeding with the audio addition.
 * Updates the ticket's audio data with unique audio files and optionally includes a transcript if generated.
 *
 * @param {Request} req - The request object containing parameters and body.
 * @param {Response} res - The response object used to send back status and data.
 * @param {NextFunction} next - The next middleware function in the Express call stack.
 *
 * @throws {Error} - Passes any uncaught errors to the next middleware for error handling.
 */
export const addTicketAudio = async (req: Request, res: Response, next: NextFunction) => {
    console.debug(`Adding audio to ticket: ${req.params.ticket_id}`);

    const { error: paramsError } = ticketIdSchema.validate(req.params);
    const { error: bodyError } = audioMediaSchema.validate(req.body);

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

        console.debug(`Finding ticket record for audio addition`);
        const ticketRecord = await ticket.findOne({ where: { ticket_id, user_id }});

        if (!ticketRecord) {
            console.debug(`No ticket found for audio addition: ${ticket_id}`);
            res.status(404).json({ message: "Ticket not found" });
            return;
        }

        if (ticketRecord.status !== "Active") {
            res.status(403).json({ message: "Ticket is not active" });
            return;
        }

        let updatedAudio: any[]

        const transcriptReport = await generateAudioTranscript(req.body.bucket_url)
        if (transcriptReport) {
            updatedAudio = addUniqueMedia(ticketRecord.audio, {...req.body, transcript : transcriptReport});
        } else {
            updatedAudio = addUniqueMedia(ticketRecord.audio, req.body);
        }

        console.debug(`Updating ticket with new audio, total unique audio files: ${updatedAudio.length}`);
        await ticketRecord.update({ audio: updatedAudio });

        res.status(201).json({
            message: "Audio added successfully",
            data: updatedAudio,
        });

    } catch (e) {
        console.error("Error adding audio to ticket:", e);
        next(e);
    }
}

// Add video to the ticket
/**
 * Asynchronously adds a video to an existing ticket.
 *
 * Processes the request by validating the input parameters and request body for the ticket ID and
 * video metadata.
 * Checks for the existence and active status of the ticket associated with the provided
 * ticket ID and user ID. If the ticket exists and is active, the video is added to the ticket's video list.
 *
 * Special actions are performed if the video being added is the first for the ticket.
 * In such a case,
 * the function generates a summary and priority for the ticket based on the video and user's details.
 * Otherwise, it generates only a description for the added video, if possible.
 * Both operations involve
 * invoking external media analysis functions.
 *
 * Returns a success or error response based on the outcome of the operation.
 *
 * @param {Request} req - The Express request object containing ticket ID in params, user ID in params,
 *                        and video metadata in the request body.
 * @param {Response} res - The Express response object for sending data back to the client.
 * @param {NextFunction} next - The next middleware function in the Express pipeline to handle errors.
 * @throws Will forward the error to the next middleware in case of unforeseen server issues.
 */
export const addTicketVideo = async (req: Request, res: Response, next: NextFunction) => {
    console.debug(`Adding video to ticket: ${req.params.ticket_id}`);

    const { error: paramsError } = ticketIdSchema.validate(req.params);
    const { error: bodyError } = videoMediaSchema.validate(req.body);

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
        console.debug(`Finding ticket record for video addition`);
        const ticketRecord = await ticket.findOne({ where: { ticket_id, user_id }});
        const dbUserRecord = await user_data.findOne({where: {id: user_id}})

        if (!ticketRecord) {
            console.debug(`No ticket found for video addition: ${ticket_id}`);
            res.status(404).json({ message: "Ticket not found" });
            return;
        }

        if (!dbUserRecord) {
            console.debug(`Unable to find user details`);
            res.status(404).json({ message: "Unable to find user data" });
            return;
        }

        if (ticketRecord.status !== "Active") {
            res.status(403).json({ message: "Ticket is not active" });
            return;
        }

        const updatedVideos = addUniqueMedia(ticketRecord.video || [], req.body);

        console.debug(`Updating ticket with new video, total unique videos: ${updatedVideos.length}`);

        const age = dbUserRecord.getAge()


        // if it is the first video, generate summary and priority. for the first 10 videos
        if (updatedVideos.length >= 1 && updatedVideos.length <= 10) {
            // Generate summary and priority
            const report = await generateTicketSummaryAndPriority(req.body.bucket_url, dbUserRecord.sex, age ? age : 18)

            // if analysis was successful
            if (report) {
                console.log("Successfully generated report")

                ticketRecord.initial_analysis = report
                
                if (ticketRecord.ticket_priority && report.priority.score > ticketRecord.ticket_priority) {
                    console.log("Updating ticket priority to ", report.priority.score, "because it is higher than the previous one")
                    ticketRecord.ticket_priority = report.priority.score
                } else {
                    console.log("Ticket priority is not updated because it is lower than the previous one")
                }
                
                ticketRecord.ticket_priority = report.priority.score
                ticketRecord.video = updatedVideos.map((vid) => {
                    if (vid.video_id === req.body.video_id) {
                        // update the description
                        vid.description = {
                            english: report.summary.english.text,
                            hindi: report.summary.hindi.text,
                            confidence_score: report.summary.confidence_score
                        }
                        return vid
                    } else {
                        return vid
                    }
                })
                await ticketRecord.save()

                res.status(201).json({message: "Video added successfully", data: ticketRecord.video});
                return

            }         }
        console.debug("Conditions did not match for generating priority.", updatedVideos.length)

        // else generate summary only
        ticketRecord.video = updatedVideos // If you update this before the if condition, the condition will always be true

        try {
            const report = await generateVideoSummary(req.body.bucket_url);

            if (report) {
                const relevantVideoIndex = updatedVideos.findIndex(video => video.bucket_url === req.body.bucket_url);
                if (relevantVideoIndex !== -1) {
                    updatedVideos[relevantVideoIndex].description = report;
                    console.debug("Updated the description and placed the relevant video back into updatedVideos:", updatedVideos[relevantVideoIndex]);
                } else {
                    console.debug("No relevant video found for the given bucket_url.");
                }
            }
        } catch (e) {
            console.error("Unable to generate the description for the video", e);
        }

        ticketRecord.video = updatedVideos // If you update this before the if condition, the condition will always be true


        await ticketRecord.save()

        res.status(201).json({
            message: "Video added successfully",
            data: updatedVideos
        });

    } catch (e) {
        console.error("Error adding video to ticket:", e);
        next(e);
    }
}



