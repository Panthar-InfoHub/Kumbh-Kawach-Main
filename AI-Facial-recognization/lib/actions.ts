"use server"

import { GetSignedUrlConfig, Storage } from "@google-cloud/storage"
import { User } from "./models"
import { storage } from "./Storage"
import { connectDB } from "./conenctDB"
import { Error } from "mongoose"
import axios from "axios"


export async function submitRegistration(formData: FormData) {
  await connectDB()

  try {
    console.log("Registration data received:", {
      name: formData.get('name'),
      mobile: formData.get('mobile'),
      gender: formData.get('gender'),
      aadharNumber: formData.get('aadharnumber'),
      photoUrl: formData.get('image'),
    })

    if (!formData.get('name') || !formData.get('mobile') || !formData.get('gender') || !formData.get('aadharNumber')) {
      throw new Error("All fields including photo are required")
    }

    const user = new User({
      name: formData.get("name") as string,
      mobile: formData.get("mobile") as string,
      gender: formData.get("gender") as "male" | "female" | "other",
      aadharNumber: formData.get("aadharNumber") as string,
      photoUrl: formData.get("image") as string,
    })
    await user.save()
    console.log("User created ==> ", user)
    return JSON.parse(JSON.stringify({ success: true, id: user._id, message: "User registered successfully" }))

  } catch (error) {
    console.error("\n Error in registration action ==> ", error)

    if (error instanceof Error) {
      JSON.parse(JSON.stringify({ success: false, message: error.message }))
    }
    JSON.parse(JSON.stringify({ success: false, message: "Something went wrong in server" }))
  }
}

export async function uploadImageToCloud(data: FormData) {

  console.debug("\n bucket name ==> ", process.env.BUCKET_NAME)
  try {
    const destination = `users/${data.get('name')}/avatar-${Date.now()}.png`;

    console.debug("\n destination of file ==> ", destination)
    // Get the file from FormData
    const file = data.get('file');
    if (!(file instanceof File)) {
      throw new Error("Uploaded file is missing or invalid");
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to GCS 
    console.debug("\n\n Start uploading image to gcs...")
    const bucketFile = storage.bucket(process.env.BUCKET_NAME).file(destination);
    await bucketFile.save(buffer, {
      metadata: {
        contentType: "image/jpeg",
        cacheControl: "no-cache",
      },
    })
    console.debug("\n image upload to server successfully...")

    return { success: true, destination }

  } catch (error) {
    console.error("Error while uploading data on cloud", error)
    return { success: false }
  }
}

export async function getUploadSignedUrl(filePath: string) {
  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "read",
    expires: Date.now() + 60 * 60 * 1000,
  }

  const [url] = await storage
    .bucket(process.env.BUCKET_NAME)
    .file(filePath)
    .getSignedUrl(options)

  console.log("URl of image ===> ", url)
  return url
}

export async function updateUserEmmbedding(userId: string) {

  console.log("Updating embedding for user id ==> ", userId)
  const res = await axios.post(`${process.env.AI_SERVER}/embed`, { userId })

  console.log("Response from ai server ==> ", res.data)
  return res.data
}

export async function findMatch(imagePath: string) {
  try {
    console.log("Finding match for image path ==> ", imagePath)
    const res = await axios.post(`${process.env.AI_SERVER}/match`, { photoUrl: imagePath })

    console.log("Response from ai server ==> ", res.data)
    return { success: res.data.success, data: res.data.matchedUser, message: res.data.message }

  } catch (error) {
    console.error("Error in finding match ==> ", JSON.stringify(error))
    return { success: false, message: "Error in finding match" }
  }
}