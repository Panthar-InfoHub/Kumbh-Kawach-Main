package com.nextlevelprogrammers.surakshakawach.service

import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import androidx.core.app.TaskStackBuilder
import com.nextlevelprogrammers.surakshakawach.MainActivity
import com.nextlevelprogrammers.surakshakawach.R
import com.nextlevelprogrammers.surakshakawach.broadcastReciever.SOSWidgetReciever
import com.nextlevelprogrammers.surakshakawach.data.remote.ApiService
import com.nextlevelprogrammers.surakshakawach.emergency_videos.VideoRecorder
import com.nextlevelprogrammers.surakshakawach.model.TicketResponse
import com.nextlevelprogrammers.surakshakawach.utils.LocationUtils
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

class SOSForegroundService : Service() {

    private lateinit var locationUtils: LocationUtils
    private lateinit var videoRecorder: VideoRecorder
    private lateinit var apiService: ApiService
    private var ticketId: String? = null
    private var ticketStatus: String = "Pending"
    private lateinit var userId: String
    private var locationJob: Job? = null
    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    companion object {
        const val CHANNEL_ID = "running_channel"
        const val USER_ID_KEY = "user_id"
    }
    private fun setServiceRunning(isRunning: Boolean) {
        val prefs = getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
        prefs.edit().putBoolean("is_service_running", isRunning).apply()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        setServiceRunning(false)
        videoRecorder.closeCamera()
    }

    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            Actions.START.toString() -> {
                userId = intent.getStringExtra(USER_ID_KEY) ?: ""
                setServiceRunning(true)
                startSOSFlow()
            }
            Actions.STOP.toString() -> {
                stopSOS()
                setServiceRunning(false)
            }
        }
        return START_STICKY
    }

    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    private fun startSOSFlow() {
        val intent= Intent(this, MainActivity::class.java)
        val notificationPendingIntent: PendingIntent?= TaskStackBuilder.create(this).run{
            addNextIntentWithParentStack(intent)
            getPendingIntent(0,PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        }
        // Start Foreground Notification
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.logo)
            .setContentTitle("SOS is Active")
            .setContentText("Your location is being shared")
            .setContentIntent(notificationPendingIntent)
            .build()
        startForeground(1, notification)

        val widgetUpdateIntent = Intent(this@SOSForegroundService, SOSWidgetReciever::class.java).apply {
            action="com.nextlevelprogrammers.surakshakawach.SOS_Service.SOS_Started"
        }

        this.sendBroadcast(widgetUpdateIntent)


        // Initialize
        apiService = ApiService()
        locationUtils = LocationUtils(this)
        videoRecorder = VideoRecorder(this)

        // Start SOS ticket
        serviceScope.launch {
            locationUtils.getLastKnownLocation { latitude, longitude ->
                createTicket(latitude, longitude)
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    private fun createTicket(latitude: Double, longitude: Double) {
        serviceScope.launch {
            try {
                val sosResponse = apiService.createSOS(userId, latitude, longitude)

                if (sosResponse.data != null) {

                    ticketId = sosResponse.data.ticket_id
                    ticketStatus = sosResponse.data.status

                    Log.d("SOSService", "✅ Ticket Created: ID=$ticketId, Status=$ticketStatus")

                    // Start location updates & video recording
                    startLocationUpdates()
                    startVideoRecording()
                } else {
                    Log.e("SOSService", "❌ Failed to Create SOS: Response Data Missing: ${sosResponse.message}")
                    stopSelf()
                }

            } catch (e: Exception) {
                Log.e("SOSService", "❌ Error Creating SOS: ${e.localizedMessage}")
                stopSelf()
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun startLocationUpdates() {
        var currentLatitude=0.0
        var currentLongitude=0.0
        locationJob = serviceScope.launch {
            while (ticketStatus == "Active" && ticketId != null) {
                locationUtils.getLastKnownLocation { latitude, longitude ->
                    serviceScope.launch {
                        if( latitude!= currentLatitude || longitude!= currentLongitude){
                            apiService.updateLocation(userId, ticketId!!, latitude, longitude)
                            currentLatitude= latitude
                            currentLongitude= longitude
                            Log.d(
                                "SOSService",
                                "✅ Location Updated: Lat=$latitude, Long=$longitude"
                            )
                        }
                        else
                        {
                            Log.d("SOS Service", "Same Coordinates not Send")
                        }
                    }
                }
                delay(5000)
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.P)
    private fun startVideoRecording() {
        videoRecorder.initializeCamera()
        videoRecorder.startContinuousRecording { videoUrl, bucketUrl ->
            ticketId?.let { id ->
                serviceScope.launch {
                    val response = apiService.uploadVideo(userId, id, videoUrl, bucketUrl)
                    if (response != null) {
                        Log.d("SOSService", "✅ Video Uploaded to API")
                    }
                }
            }
        }
    }

    private fun stopSOS() {
        serviceScope.launch {
            locationJob?.cancel()
            videoRecorder.stopRecording()
            ticketId?.let { id ->
                val isClosed = apiService.closeTicket(userId, id)
                if (isClosed) {
                    Log.d("SOSService", "✅ Ticket Closed: $ticketId")
                } else {
                    Log.e("SOSService", "❌ Failed to Close Ticket")
                }
            }
            val intent=Intent(this@SOSForegroundService,SOSWidgetReciever::class.java).apply {
                action= "com.nextlevelprogrammers.surakshakawach.SOS_RESET_ACTION"
            }
            this@SOSForegroundService.sendBroadcast(intent)
            stopSelf() // End service
        }
    }

    private fun extractTicketData(responseBody: String): TicketResponse? {
        return try {
            val jsonObject = Json.parseToJsonElement(responseBody).jsonObject
            val ticketData = jsonObject["data"]?.jsonObject
            val ticketId = ticketData?.get("ticket_id")?.jsonPrimitive?.content
            val status = ticketData?.get("status")?.jsonPrimitive?.content
            if (ticketId != null && status != null) {
                TicketResponse(ticketId, status)
            } else null
        } catch (e: Exception) {
            Log.e("SOSService", "❌ JSON Parsing Error: ${e.localizedMessage}")
            null
        }
    }

    enum class Actions {
        START, STOP
    }
}
