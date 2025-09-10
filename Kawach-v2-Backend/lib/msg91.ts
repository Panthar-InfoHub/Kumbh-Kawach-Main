// Import Twilio using modern ES6 import syntax
import axios from 'axios';
import process from "node:process";

if (!process.env.ALLOW_SMS_SENDING) {
    throw new Error(`ALLOW_SMS_SENDING env variable must be set`);
}



/**
 * Sends an SOS SMS to a given mobile number with the provided details.
 *
 * @param {string} toMobile - The recipient's mobile number.
 * It should be a 10-digit Indian number or include the country code (91).
 * @param {string} sos_activator_name - The name of the person or entity activating the SOS.
 * @param {string} sos_url - The URL associated with the SOS alert.
 * @return {Promise<void>} A promise that resolves when the SMS sending process is completed or skipped.
 */
export async function SendSOS_SMS(toMobile: string, sos_activator_name: string, sos_url: string): Promise<void> {
    
  // console.log({toMobile, sos_activator_name, sos_url})
  // return

    if (toMobile.length == 10) { 
        toMobile = `91${toMobile}`
    } else if (!toMobile.startsWith("91")) {
        console.warn("The number is not an indian number. SOS SMS not sent.")
        // return empty promise
        return Promise.resolve();
    }


    if (process.env.ALLOW_SMS_SENDING === "false") {
        console.warn("SMS Alerts are disabled by environment variable `ALLOW_SMS_SENDING`. set it to true to allow SMS Sending! ")
        return
    }

    try {

        const req = await axios.post(`https://control.msg91.com/api/v5/flow`, {
            "template_id": "676862a4d6fc0513504064a4",
            "short_url": 1,
            "realTimeResponse": 1,
            "recipients": [
              {
                "mobiles": toMobile,
                "name": `${sos_activator_name}`,
                "var": `${sos_url}`
              }
            ]
          }, {headers: {
            "Authkey": process.env.MSG91_AUTH_KEY
          }}
        )

        console.log("SMS Request Sent", {sms_req_data: req.data})

    } catch (e) {
        console.error(e as Error);
        console.error(`Failed to send SMS to ${toMobile}`);
    }
}
