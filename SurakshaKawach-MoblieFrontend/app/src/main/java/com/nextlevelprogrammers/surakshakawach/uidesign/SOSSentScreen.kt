package com.nextlevelprogrammers.surakshakawach.uidesign

import android.content.Context
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.navigation.NavController
import com.nextlevelprogrammers.surakshakawach.MainActivity
import com.nextlevelprogrammers.surakshakawach.data.remote.ApiService
import com.nextlevelprogrammers.surakshakawach.emergency_videos.VideoRecorder
import com.nextlevelprogrammers.surakshakawach.model.TicketResponse
import com.nextlevelprogrammers.surakshakawach.viewmodel.AuthViewModel
import io.ktor.client.call.body
import io.ktor.http.isSuccess
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun SOSGranted(
    context: Context,
    userId: String,
    authViewModel: AuthViewModel,
    navController: NavController,
    hideSOSFloatingButton: () -> Unit,
    showSOSFloatingButton: () -> Unit
) {
    val isAuthenticated by authViewModel.isAuthenticated.collectAsState()
    var locationText by remember { mutableStateOf("Fetching location...") }
    var ticketStatus by remember { mutableStateOf("Pending") }


    LaunchedEffect(isAuthenticated) {
        if (isAuthenticated) {
                        authViewModel.resetAuthentication()
                        hideSOSFloatingButton()
                        navController.popBackStack()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxSize()
        ) {
            Text("Status: $ticketStatus\n$locationText", textAlign = TextAlign.Center)

            // **STOP SOS BUTTON**
            Button(onClick = {
                if (!isAuthenticated) {
                    (context as? MainActivity)?.promptForLockScreen(authViewModel) // ✅ Trigger authentication
                }
            }) {
                Text("Stop SOS")
            }
        }
    }
}

/**
 * ✅ Stop SOS by:
 * 1. Stopping video recording.
 * 2. Stopping location updates.
 * 3. Closing the ticket via API.
 */
@RequiresApi(Build.VERSION_CODES.O)
suspend fun stopSOS(
    ticketId: String?,
    userId: String,
    videoRecorder: VideoRecorder,
    apiService: ApiService,
    onComplete: (Boolean) -> Unit
) {
    if (ticketId == null) {
        Log.e("stopSOS", "❌ No active ticket to close!")
        onComplete(false)
        return
    }

    // 1️⃣ **Stop Recording**
    Log.d("stopSOS", "🛑 Stopping video recording")
    videoRecorder.stopRecording()

    // 2️⃣ **Stop Location Updates**
    Log.d("stopSOS", "🛑 Stopping location updates")

    // 3️⃣ **Call Close Ticket API**
    val isClosed = apiService.closeTicket(userId, ticketId)

    if (isClosed) {
        Log.d("stopSOS", "✅ SOS ticket closed successfully")
        videoRecorder.closeCamera() // ✅ Properly stop camera service
    } else {
        Log.e("stopSOS", "❌ Failed to close SOS ticket")
    }

    onComplete(isClosed)
}

@RequiresApi(Build.VERSION_CODES.O)
suspend fun createSOS(apiService: ApiService, userId: String, latitude: Double, longitude: Double): TicketResponse? {
    return try {
        val sosResponse = apiService.createSOS(userId, latitude, longitude)
        Log.d("SOSGranted", "✅ SOS Created: Ticket ID -> ${sosResponse.data?.ticket_id}, Status -> ${sosResponse.data?.status}")

        if (sosResponse.data != null) {
            // Directly map response to TicketResponse
            TicketResponse(
                ticketId = sosResponse.data.ticket_id,
                status = sosResponse.data.status
            )
        } else {
            Log.e("SOSGranted", "❌ SOS Response Data Missing")
            null
        }
    } catch (e: Exception) {
        Log.e("SOSGranted", "❌ Error: ${e.localizedMessage}")
        null
    }
}

@RequiresApi(Build.VERSION_CODES.O)
suspend fun updateLocation(apiService: ApiService, userId: String, ticketId: String, latitude: Double, longitude: Double) {
    try {
        val response = apiService.updateLocation(userId, ticketId, latitude, longitude)
        val responseBody = response.body<String>() // ✅ Capture response body for debugging

        if (response.status.isSuccess()) {
            Log.d("SOSGranted", "✅ Location Updated Successfully!")
        } else {
            Log.e("SOSGranted", "❌ Failed to Update Location: ${response.status} - Response: $responseBody")
        }
    } catch (e: Exception) {
        Log.e("SOSGranted", "❌ Error: ${e.localizedMessage}")
    }
}

// **Helper function to extract `ticket_id` and `status` from API response**
fun extractTicketData(responseBody: String): TicketResponse? {
    return try {
        val jsonObject = Json.parseToJsonElement(responseBody).jsonObject
        val ticketData = jsonObject["data"]?.jsonObject
        val ticketId = ticketData?.get("ticket_id")?.jsonPrimitive?.content
        val status = ticketData?.get("status")?.jsonPrimitive?.content

        if (ticketId != null && status != null) {
            TicketResponse(ticketId, status)
        } else {
            null
        }
    } catch (e: Exception) {
        Log.e("SOSGranted", "❌ JSON Parsing Error: ${e.localizedMessage}")
        null
    }
}