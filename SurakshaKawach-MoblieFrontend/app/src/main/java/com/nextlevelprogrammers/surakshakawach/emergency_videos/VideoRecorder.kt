package com.nextlevelprogrammers.surakshakawach.emergency_videos

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.annotation.OptIn
import androidx.annotation.RequiresApi
import androidx.camera.core.CameraSelector
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.FileOutputOptions
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class VideoRecorder(private val context: Context) {

    private var videoCapture: VideoCapture<Recorder>? = null
    private var currentRecording: Recording? = null
    private var cameraProvider: ProcessCameraProvider? = null
    private var isRecordingActive = false
    private val storageReference: StorageReference =
        FirebaseStorage.getInstance("gs://suraksha-kawach-151024-v2-development")
            .reference.child("emergency_videos")
    private val cameraExecutor: ExecutorService = Executors.newSingleThreadExecutor()
    private var dummyLifecycleOwner: DummyLifecycleOwner? = null

    /**
     * ✅ Initializes CameraX with optional Lifecycle binding.
     */
    @OptIn(androidx.camera.camera2.interop.ExperimentalCamera2Interop::class)
    @RequiresApi(Build.VERSION_CODES.P)
    fun initializeCamera(useLifecycleOwner: Boolean = true) {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
        cameraProviderFuture.addListener({
            try {
                cameraProvider = cameraProviderFuture.get()
                val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

                val qualitySelector = QualitySelector.from(Quality.SD)

                val recorder = Recorder.Builder()
                    .setQualitySelector(qualitySelector)
                    .setExecutor(cameraExecutor)
                    .build()
                videoCapture = VideoCapture.withOutput(recorder)

                cameraProvider?.unbindAll()

                if (useLifecycleOwner && context is LifecycleOwner) {
                    // ✅ Activity/Composable case
                    cameraProvider?.bindToLifecycle(
                        context as LifecycleOwner,
                        cameraSelector,
                        videoCapture
                    )
                    Log.d("VideoRecorder", "✅ Camera bound with LifecycleOwner")
                } else {
                    val dummyOwner = DummyLifecycleOwner()
                    dummyLifecycleOwner = dummyOwner
                    cameraProvider?.bindToLifecycle(dummyOwner, cameraSelector, videoCapture)
                    Log.d("VideoRecorder", "✅ Camera bound using DummyLifecycleOwner (Service)")
                }

                Log.d("VideoRecorder", "✅ CameraX Initialized Successfully")

            } catch (e: Exception) {
                Log.e("VideoRecorder", "❌ Camera Initialization Failed: ${e.localizedMessage}")
            }
        }, ContextCompat.getMainExecutor(context))
    }

    fun startContinuousRecording(onVideoUploaded: (String, String) -> Unit) {
        isRecordingActive = true
        CoroutineScope(Dispatchers.IO).launch {
            while (isRecordingActive) {
                val videoFile = startVideoRecording() ?: continue
                delay(30000) // 🎥 Record for 30 seconds

                stopVideoRecording(videoFile) { uploadedUrl, bucketUrl ->
                    if (uploadedUrl.isEmpty()) {
                        Log.e("VideoRecorder", "❌ Video upload failed, stopping continuous recording.")
                        stopRecording()
                    } else {
                        onVideoUploaded(uploadedUrl, bucketUrl)
                    }
                }

                delay(10000) // ⏳ Wait before next recording
            }
        }
    }

    private fun hasCameraPermission(): Boolean {
        return ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
    }

    private fun hasAudioPermission(): Boolean {
        return ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED
    }

    private fun startVideoRecording(): File? {
        if (!hasCameraPermission() || !hasAudioPermission()) {
            Log.e("VideoRecorder", "❌ Camera or Audio permission not granted!")
            return null
        }

        if (videoCapture == null) {
            Log.e("VideoRecorder", "❌ VideoCapture not initialized!")
            return null
        }

        val outputFile = createVideoFile()
        val outputOptions = FileOutputOptions.Builder(outputFile).build()

        currentRecording = videoCapture?.output
            ?.prepareRecording(context, outputOptions)
            ?.withAudioEnabled()
            ?.start(ContextCompat.getMainExecutor(context)) { event ->
                when (event) {
                    is VideoRecordEvent.Start -> {
                        Log.d("VideoRecorder", "🎥 Recording Started")
                    }
                    is VideoRecordEvent.Finalize -> {
                        Log.d("VideoRecorder", "✅ Recording Finalized")
                    }
                    is VideoRecordEvent.Status -> {
                        Log.d("VideoRecorder", "ℹ Recording Status Update: ${event.recordingStats}")
                    }
                    else -> {
                        Log.e("VideoRecorder", "❌ Unknown Event: ${event.javaClass.simpleName}")
                    }
                }
            }

        return outputFile
    }

    private fun stopVideoRecording(file: File, onUploaded: (String, String) -> Unit)
    {
        currentRecording?.stop()
        currentRecording = null

        Log.d("VideoRecorder", "⏹ Video Recording Stopped: ${file.absolutePath}")

        CoroutineScope(Dispatchers.IO).launch {
            uploadVideoToFirebase(file, onUploaded)
        }
    }

    private fun createVideoFile(): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir = context.getExternalFilesDir(Environment.DIRECTORY_MOVIES)
        return File.createTempFile("SOS_$timeStamp", ".mp4", storageDir)
    }

    private suspend fun uploadVideoToFirebase(
        file: File,
        onUploaded: (String, String) -> Unit
    ) {
        val fileName = file.name
        val storageReference = storageReference.child(fileName)

        val user = FirebaseAuth.getInstance().currentUser
        if (user == null) {
            Log.e("FirebaseUpload", "❌ Upload Failed: User is not authenticated!")
            return
        }

        var retryCount = 0
        val maxRetries = 3

        while (retryCount < maxRetries) {
            try {
                Log.d("FirebaseUpload", "🔄 Attempt ${retryCount + 1}: Uploading file: $fileName")

                storageReference.putFile(Uri.fromFile(file)).await()
                val downloadUrl = storageReference.downloadUrl.await().toString()
                val bucketUrl = "gs://suraksha-kawach-151024-v2-development/emergency_videos/$fileName"

                Log.d("FirebaseUpload", "✅ File Uploaded Successfully: $downloadUrl")

                onUploaded(downloadUrl, bucketUrl)
                file.delete()
                return

            } catch (e: Exception) {
                retryCount++
                Log.e("FirebaseUpload", "❌ Upload Failed: ${e.localizedMessage} (Attempt $retryCount)")

                if (retryCount >= maxRetries) {
                    Log.e("FirebaseUpload", "🚨 Max retries reached. Stopping video recording.")
                    stopRecording()
                    return
                }

                delay(2000L * retryCount)
            }
        }
    }

    fun stopRecording() {
        isRecordingActive = false
        Log.d("VideoRecorder", "⛔ Stopped Continuous Recording")
    }

    fun closeCamera() {
        Log.d("VideoRecorder", "🛑 Closing CameraX Service")
        stopRecording()
        currentRecording?.close()
        Handler(Looper.getMainLooper()).post {
            cameraProvider?.unbindAll()
            dummyLifecycleOwner?.shutdown() // ✅ Mark Lifecycle as DESTROYED!
            dummyLifecycleOwner = null
        }
        Log.d("Video Recorder", "Dummy Lifecycle Destroyed")
        videoCapture = null
        cameraProvider = null
        Log.d("VideoRecorder", "✅ CameraX Service Closed Successfully")
    }

    /**
     * ✅ DummyLifecycleOwner for binding camera in Services
     */

}
