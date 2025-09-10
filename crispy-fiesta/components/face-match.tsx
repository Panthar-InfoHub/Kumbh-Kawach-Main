"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { findMatch, getUploadSignedUrl, uploadImageToCloud } from "@/lib/actions"
import { Camera, Loader2, Upload, X } from "lucide-react"
import { useActionState, useRef, useState } from "react"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { Select, SelectTrigger, SelectValue } from "./ui/select"



export function FaceMatch() {


    const [isCapturing, setIsCapturing] = useState(false)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [userData, setUserData] = useState<any | null>(null)
    const [capturedImageData, setCapturedImageData] = useState<string | null>(null) // Store base64 for preview
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [videoReady, setVideoReady] = useState(false)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const formRef = useRef<HTMLFormElement>(null) // Add form ref



    const startCamera = async () => {
        try {
            console.log("Starting camera....")

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            })

            console.log("Media stream acquired:", mediaStream)
            setStream(mediaStream)
            setIsCapturing(true)
            setVideoReady(false)
            setIsVideoPlaying(false)

            if (videoRef.current) {
                const video = videoRef.current

                video.srcObject = mediaStream
                video.muted = true
                video.playsInline = true
                setVideoReady(true)


                video.addEventListener('loadedmetadata', () => {
                    console.log("Video metadata loaded:", video.videoWidth, "x", video.videoHeight)
                    setVideoReady(true)
                }, { once: true })
            }
        } catch (error: any) {
            console.error("Error accessing camera:", error)
            setIsCapturing(false)
            alert(`Camera error: ${error.message}`)
        }
    }

    const forceVideoPlay = async () => {
        console.log("Force playing video...")
        const video = videoRef.current
        setIsVideoPlaying(true)
        if (video && stream) {
            try {
                // Make sure stream is assigned
                if (!video.srcObject) {
                    video.srcObject = stream
                }

                await video.play()
                console.log("Video playing after manual trigger!")
                // setVideoReady(true)
            } catch (error) {
                console.error("Manual play failed:", error)
            }
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop())
            setStream(null)
        }
        setIsCapturing(false)
    }

    const capturePhoto = async () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current
            const video = videoRef.current
            const context = canvas.getContext("2d")

            if (!video.videoWidth || !video.videoHeight) {
                await new Promise<void>((resolve) => {
                    const onCanPlay = () => {
                        video.removeEventListener("canplay", onCanPlay)
                        resolve()
                    }
                    video.addEventListener("canplay", onCanPlay, { once: true })
                })
            }
            // wait a frame so the first image is actually rendered
            await new Promise((r) => requestAnimationFrame(() => r(null as any)))

            console.log("capturing with dimensions:", video.videoWidth, "x", video.videoHeight)
            canvas.width = video.videoWidth || 720
            canvas.height = video.videoHeight || 1280

            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height)

                canvas.toBlob((blob) => {
                    if (!blob) return

                    const imageUrl = URL.createObjectURL(blob)
                    setCapturedImageData(imageUrl)

                    const file = new File([blob], `user-${Date.now()}.jpg`, { type: "image/jpeg" })
                    setPhotoFile(file)

                    console.log("Photo captured locally")
                }, "image/jpeg", 0.9)

                stopCamera()
            }
        }
    }

    const removePhoto = () => {
        if (capturedImageData && capturedImageData.startsWith("blob:")) {
            try {
                URL.revokeObjectURL(capturedImageData)
            } catch {
                // no-op
            }
        }
        setCapturedImageData(null)
        setPhotoFile(null)
    }

    const registrationFormSubmission = async (prevData, formData: FormData) => {
        // Validate photo is captured
        if (!photoFile) {
            alert("Please capture a photo before submitting")
            return
        }

        formData.append('file', photoFile)
        formData.append('name', "Search-user")

        try {
            const { success, destination } = await uploadImageToCloud(formData)

            if (success) {
                const urlofImage = await getUploadSignedUrl(destination)
                console.debug("\n Image url ==> ", urlofImage)

                const res = await findMatch(destination)

                // console.log("finding match log am getting ==> ", res)
                
                if (res.success) {
                    toast.success(res.message || "User matched successfully")
                    console.log("parsed data ==> ", res.data)
                    setUserData(res.data)
                }else{
                    toast.warning(res.message)
                }

            }
        } catch (error) {
            toast.error(error.message)
            console.log("Error in submit action ==> ", error)
        }

    }

    const [state, formAction, isPending] = useActionState(registrationFormSubmission, {})


    return (
        <form action={formAction} className="space-y-6" ref={formRef}>

            <div className="space-y-4">
                <Label className="text-sm font-medium">Photo Capture *</Label>

                {!photoFile && !isCapturing && (
                    <Card className="border-2 border-dashed border-border">
                        <CardContent className="flex flex-col items-center justify-center py-8 gap-3">
                            <Camera className="h-12 w-12 text-muted-foreground mb-1" />
                            <p className="text-sm text-muted-foreground text-center">
                                Capture your photo using the camera
                            </p>
                            <Button type="button" onClick={startCamera} className="gap-2" variant="default">
                                <Camera className="h-4 w-4" />
                                Start Camera
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {isCapturing && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center space-y-4">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    style={{
                                        transform: 'scaleX(-1)'
                                    }}
                                    className="w-full max-w-md rounded-lg border aspect-video bg-black"
                                    onLoadedMetadata={async () => {
                                        const v = videoRef.current
                                        if (v) {
                                            console.log("Video metadata loaded:", v.videoWidth, "x", v.videoHeight)
                                            try {
                                                await v.play()
                                                console.log("Video started successfully!")
                                            } catch (playError) {
                                                console.log("Autoplay blocked, requiring user click:", playError)
                                            }
                                        }
                                    }}
                                    onClick={forceVideoPlay}

                                />
                                <div className="flex gap-2">
                                    <Button type="button" onClick={forceVideoPlay} className="gap-2"
                                        variant={isVideoPlaying ? "secondary" : "default"}
                                    >
                                        Start Preview
                                    </Button>
                                    <Button type="button" onClick={capturePhoto} disabled={videoRef.current?.paused} className="gap-2 cursor-pointer">
                                        <Upload className="h-4 w-4" />
                                        Capture Photo
                                    </Button>
                                    <Button type="button" variant="outline" onClick={stopCamera}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {photoFile && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <img
                                        src={capturedImageData || "/placeholder.svg"}
                                        alt="Captured or uploaded photo preview"
                                        className="w-48 h-48 object-cover rounded-lg border"
                                        style={{
                                            transform: 'scaleX(-1)'
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                                        onClick={removePhoto}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Photo uploaded successfully</p>
                                    <p className="text-xs text-muted-foreground mt-1">Stored in cloud storage</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {userData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Full Name *
                            </Label>
                            <Input
                                id="name"
                                disabled={true}
                                defaultValue={userData?.name}
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mobile" className="text-sm font-medium">
                                Mobile Number *
                            </Label>
                            <Input
                                id="mobile"
                                type="tel"
                                name="mobile"
                                disabled={true}
                                defaultValue={userData?.mobile}
                                placeholder="Enter 10-digit mobile number"
                                pattern="[0-9]{10}"
                                maxLength={10}
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-sm font-medium">
                                Gender *
                            </Label>
                            <Select name="gender" defaultValue={userData?.gender}>
                                <SelectTrigger disabled={true}  className="h-11">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                {/* <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent> */}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="aadhar" className="text-sm font-medium">
                                Aadhar Card Number *
                            </Label>
                            <Input
                                id="aadhar"
                                type="text"
                                disabled={true}
                                defaultValue={userData?.aadharNumber}
                                placeholder="Enter 12-digit Aadhar number"
                                name="aadharNumber"
                                pattern="[0-9]{12}"
                                maxLength={12}
                                className="h-11"
                                required
                            />
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
            </div>

            <Button type="submit" className="w-full h-12 text-base font-medium cursor-pointer" disabled={isPending}>
                {isPending ? <div className="flex items-center gap-4" > Submitting... <Loader2 className="animate-spin" /> </div> : "Submit Registration"}
            </Button>
        </form>
    )
}
