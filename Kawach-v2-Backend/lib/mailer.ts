import mailer, {Transporter} from "nodemailer"
import Mail from "nodemailer/lib/mailer";
import {Request} from "express";
import user_data from "@/models/user.data.model";
import { UserRecord } from "firebase-admin/auth";
import ticket_data from '../models/ticket.data.model';
import police_station from "@/models/police.station.model";
import * as process from "node:process";
import {generateSOSAlertToContactsEmail} from "@/lib/mailer.templates";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
    !process.env.WEB_EMERGENCY_CONTACT_SOS_PAGE_URL ||
    !process.env.WEB_POLICE_STATION_SOS_PAGE_URL) {
    throw new Error(`EMAIL_USER and EMAIL_PASS and WEB_EMERGENCY_CONTACT_SOS_PAGE_URL, 
    WEB_POLICE_STATION_SOS_PAGE_URL, and ALLOW_SMS_SENDING must be set`);
}

/**
 * Class representing a mailer to handle email communications with pre-configured SMTP transport.
 */
export default class Mailer {
    transport: Transporter

    /**
     * Constructor initializes a mail transport instance for sending emails.
     * It uses the 'nodemailer' library to create transport with the defined SMTP configuration.
     *
     */
    constructor() {
        this.transport = mailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })
    }

    /**
     * Constructs a mail configuration object for sending an email.
     *
     * @param {string} to - The recipient's email address.
     * @param {string} subject - The subject of the email.
     * @param {string} content - The body content of the email.
     * @param {boolean} [isHtml=false] - Indicates if the content is in HTML format. Defaults to false.
     * @return {Mail.Options} The configuration object for the email.
     */
    buildMailConfig(to: string, subject: string, content: string, isHtml: boolean = false): Mail.Options {
        return {
            from : process.env.EMAIL_USER,
            to,
            subject,
            text : isHtml ? "" : content,
            html : isHtml ? content : "",
        }
    }


    /**
     * Sends an email using the specified mail options.
     *
     * @param {Mail.Options} mailOptions - The options for the email, including recipients, subject, body
     * @return {Promise<void>} A promise that resolves once the email has been sent or rejects if an error occurs.
     */
    async sendMail(mailOptions: Mail.Options): Promise<void> {
        this.transport.sendMail(mailOptions, function(err:any, info:any) {
            if (err) console.error("Failed to send email ",err)
            console.info(`${new Date().toTimeString()} mail delivery report: ${JSON.stringify(info)}`)
        })
    }

    /**
     * Sends a welcome email to a specified recipient.
     *
     * @param {string} to - The email address of the recipient.
     * @return {Promise<void>} A promise that resolves when the email has been successfully sent.
     */
    async sendWelcomeMail(to: string): Promise<void> {
        const config = this.buildMailConfig(
            to,
            "Welcome to Suraksha Kawach",
            "Welcome to Suraksha Kawach. Your account is now ready to be used. You can verify your email by following the process in the app"
        )

        await this.sendMail(config)
    }

    /**
     * Sends a sign-in notification email to the specified recipient's email address.
     *
     * @param {Request} req - The HTTP request object, used to retrieve the IP address of the client.
     * @param {string} to - The recipient's email address where the notification will be sent.
     * @return {Promise<void>} A promise that resolves when the email has been successfully sent.
     */
    async sendSignInNotificationEmail(req: Request, to:string): Promise<void> {
        const config = this.buildMailConfig(
            to,
            "New Device Signed-in",
            `A New Device has signed in your account with remote ip : ${req.ip} at ${new Date().toTimeString()}`
        )

        await this.sendMail(config)

    }


    /**
     * Sends an SOS alert email to emergency contacts.
     *
     * @param {string} to - The email address of the recipient (emergency contact).
     * @param {string} ip_addr - The IP address of the device that triggered the SOS alert.
     * @param {ticket_data} ticket_data -
     * Information about the ticket associated with the SOS alert, such as the creation date and ticket ID.
     * @param {user_data} dbUserRecord -
     * The database user record containing additional user information relevant to the alert.
     * @param {UserRecord} firebaseUserRecord -
     * The Firebase user record providing metadata about the user who triggered the SOS alert.
     * @return {Promise<void>} A promise indicating the completion of the email sending process.
     */
    async sendEmailSOSAlertToEmergencyContacts(to: string, ip_addr: string, ticket_data: ticket_data, dbUserRecord: user_data, firebaseUserRecord: UserRecord): Promise<void> {
        const config = this.buildMailConfig(
            to,
            `${firebaseUserRecord.displayName || "One of your contacts"} Generated an SOS Alert`,
            await generateSOSAlertToContactsEmail(
                firebaseUserRecord.displayName || "One of your contacts",
                ip_addr,
                (ticket_data.createdAt as Date).toString(),
                `${process.env.WEB_EMERGENCY_CONTACT_SOS_PAGE_URL}?ticketId=${ticket_data.ticket_id}&firebaseUID=${firebaseUserRecord.uid}`
            ), true
        )

        console.debug(`Sending email to ${to} (emergency contact) with subject for ticket ${ticket_data.ticket_id}`)

        await this.sendMail(config)
    }



    /**
     * Sends an SOS alert email to the specified police station with details of the triggered alert, user, and ticket.
     *
     * @param {string} to - The email address of the police station where the SOS alert will be sent.
     * @param {string} ip_addr - The IP address of the device that triggered the SOS alert.
     * @param {ticket_data} ticket_data -
     * An object containing the ticket details related to the SOS alert, including creation time.
     * @param {police_station} station_data -
     * An object containing the police station details where the alert is sent, such as station ID.
     * @param {user_data} dbUserRecord - The user data object retrieved from the database during the alert trigger.
     * @param {UserRecord} firebaseUserRecord - The Firebase user record corresponding to the user who triggered the SOS alert, including display name and photo URL.
     * @return {Promise<void>} A promise that resolves when the SOS alert email is successfully sent.
     */
    async sendEmailSOSAlertToPoliceStation(to: string, ip_addr: string, ticket_data: ticket_data, station_data: police_station, dbUserRecord: user_data, firebaseUserRecord: UserRecord): Promise<void> {
        const config = this.buildMailConfig(
            to,
            `${new Date().toTimeString()} SOS Alert`,
            `An SOS Alert has been triggered by a ${firebaseUserRecord.displayName || "a user"}.
             The IP address of the device was ${ip_addr}. 
             This alert was triggered at ${ticket_data.createdAt}.

             View complete alert details at
              <a href="${process.env.WEB_POLICE_STATION_SOS_PAGE_URL}/${station_data.station_id}?ticket_id=${ticket_data.ticket_id}">Our Portal!</a>

              User's Profile Image:
              <img src="${firebaseUserRecord.photoURL}" alt="User Profile Image" style="width: 100px; height: 100px;">

             `, true
        )

        await this.sendMail(config)
    }
}





