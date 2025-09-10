import { Storage } from "@google-cloud/storage";

export const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),

    }
})

console.debug("\n storage configuration done")