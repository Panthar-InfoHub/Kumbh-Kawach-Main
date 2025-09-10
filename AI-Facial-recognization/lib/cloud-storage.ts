export async function uploadImageToCloud(imageBlob: Blob, fileName: string): Promise<string> {
  try {
    // Create FormData for the upload
    const formData = new FormData()
    formData.append("file", imageBlob, fileName)

    // Call our API endpoint to handle the upload
    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const result = await response.json()
    return result.imageUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image to cloud storage")
  }
}

// Convert base64 to Blob
export function base64ToBlob(base64: string, mimeType = "image/jpeg"): Blob {
  const byteCharacters = atob(base64.split(",")[1])
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}
