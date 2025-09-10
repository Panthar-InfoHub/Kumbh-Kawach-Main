package com.nextlevelprogrammers.surakshakawach.data.remote

import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import com.nextlevelprogrammers.surakshakawach.model.ApiResponse
import com.nextlevelprogrammers.surakshakawach.model.AuthRequest
import com.nextlevelprogrammers.surakshakawach.model.AuthResponse
import com.nextlevelprogrammers.surakshakawach.model.ContactRequest
import com.nextlevelprogrammers.surakshakawach.model.ContactResponse
import com.nextlevelprogrammers.surakshakawach.model.LocationUpdateRequest
import com.nextlevelprogrammers.surakshakawach.model.SOSRequest
import com.nextlevelprogrammers.surakshakawach.model.SOSResponse
import com.nextlevelprogrammers.surakshakawach.model.VideoRequest
import com.nextlevelprogrammers.surakshakawach.model.VideoResponse
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID

class ApiService() {

    private val BASE_URL = "https://kawach-v2-backend-production-809410945582.asia-south1.run.app"

    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
                coerceInputValues = true
            })
        }
    }

    suspend fun authenticateUser(authRequest: AuthRequest): AuthResponse {
        return try {
            val response: HttpResponse = client.post("$BASE_URL/v2/auth/google/callback") {
                contentType(ContentType.Application.Json)
                setBody(authRequest) // ✅ Ensure proper JSON encoding
            }

            if (response.status.isSuccess()) {
                response.body<AuthResponse>()
            } else {
                val errorBody = response.body<String>()
                println("❌ API responded with error: ${response.status} - $errorBody")
                AuthResponse(success = false, message = "API Error: ${response.status} - $errorBody")
            }
        } catch (e: Exception) {
            println("❌ API Call Failed: ${e.localizedMessage}")
            AuthResponse(success = false, message = "Error: ${e.localizedMessage}")
        }
    }

    suspend fun addContact(userId: String, contact: ContactRequest): ApiResponse<ContactResponse>? {
        return try {
            println("🔍 Sending ContactRequest for user: $userId with data: $contact")

            val response: HttpResponse = client.post("$BASE_URL/v2/user/$userId/contacts/") {
                contentType(ContentType.Application.Json)
                setBody(contact)
            }

            if (response.status.isSuccess()) {
                val apiResponse: ApiResponse<ContactResponse> = response.body()
                println("✅ Contact successfully created(API): ${apiResponse.data}")
                apiResponse // ✅ Return full response
            } else {
                val errorBody = response.body<String>()
                println("❌ API responded with error: ${response.status} - $errorBody")
                null
            }
        } catch (e: Exception) {
            println("❌ API Call Failed: ${e.localizedMessage}")
            null
        }
    }

    suspend fun getContacts(userId: String): List<ContactResponse> {
        return try {
            val url = "$BASE_URL/v2/user/$userId/contacts/"

            val response: HttpResponse = client.get(url)
            val rawJson = response.body<String>() // ✅ Get raw JSON before parsing

            println("📜 Raw JSON Response: $rawJson") // ✅ Debug Log

            val parsedResponse = Json.decodeFromString<ApiResponse<List<ContactResponse>>>(rawJson) // ✅ Parse as object first

            println("✅ Successfully parsed API response: $parsedResponse") // ✅ Debug Log

            parsedResponse.data ?: emptyList() // ✅ Return contacts if available
        } catch (e: Exception) {
            println("❌ Failed to fetch contacts: ${e.localizedMessage}")
            emptyList()
        }
    }

    suspend fun deleteContact(userId: String, contactId: String): Boolean {
        return try {
            val url = "$BASE_URL/v2/user/$userId/contacts/$contactId"

            val response: HttpResponse = client.delete(url) {
                contentType(ContentType.Application.Json)
            }

            if (response.status.isSuccess()) {
                println("✅ Contact deleted successfully from API: $contactId")
                true
            } else {
                val errorBody = response.body<String>()
                println("❌ API responded with error: ${response.status} - $errorBody")
                false
            }
        } catch (e: Exception) {
            println("❌ API Call Failed: ${e.localizedMessage}")
            false
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    suspend fun createSOS(userId: String, latitude: Double, longitude: Double): SOSResponse {
        // 🔥 Fix starts here
        val createdAtFormatted = ZonedDateTime.now()
            .minusSeconds(5) // Optional: 1-second buffer
            .withNano(0) // Remove nanoseconds
            .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)

        val requestBody = SOSRequest(
            latitude = latitude,
            longitude = longitude,
            created_at = createdAtFormatted // Fixed timestamp
        )

        val url = "$BASE_URL/v2/user/$userId/ticket/"

        val response = client.post(url) {
            contentType(ContentType.Application.Json)
            setBody(requestBody)
        }

        val rawBody = response.bodyAsText()
        Log.d("ApiService", "Raw Response: $rawBody")

        return Json.decodeFromString<SOSResponse>(rawBody)
    }


    @RequiresApi(Build.VERSION_CODES.O)
    suspend fun updateLocation(userId: String, ticketId: String, latitude: Double, longitude: Double): HttpResponse {

        val createdAtFormatted = ZonedDateTime.now()
            .minusSeconds(5) // Optional: 1-second buffer
            .withNano(0) // Remove nanoseconds
            .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)

        val requestBody = LocationUpdateRequest(
            latitude = latitude,
            longitude = longitude,
            created_at = createdAtFormatted
        )

        val url = "$BASE_URL/v2/user/$userId/ticket/$ticketId/location"

        return client.post(url) {
            contentType(ContentType.Application.Json) // ✅ Ensure correct content type
            setBody(requestBody) // ✅ Send the updated location data
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    suspend fun uploadVideo(userId: String, ticketId: String, videoUrl: String, bucketUrl: String): VideoResponse? {
        return try {
            val createdAtFormatted = ZonedDateTime.now()
                .minusSeconds(5) // Optional: 1-second buffer
                .withNano(0) // Remove nanoseconds
                .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)

            val requestBody = VideoRequest(
                video_id = UUID.randomUUID().toString(),
                video_url = videoUrl,
                bucket_url = bucketUrl,
                created_at = createdAtFormatted
            )

            val url = "$BASE_URL/v2/user/$userId/ticket/$ticketId/video"

            val response: HttpResponse = client.post(url) {
                contentType(ContentType.Application.Json)
                setBody(requestBody)
            }

            if (response.status.isSuccess()) {
                response.body<VideoResponse>()
            } else {
                val errorBody = response.body<String>()
                println("❌ API responded with error: ${response.status} - $errorBody")
                null
            }
        } catch (e: Exception) {
            println("❌ API Call Failed: ${e.localizedMessage}")
            null
        }
    }

    suspend fun closeTicket(userId: String, ticketId: String): Boolean {
        return try {
            val url = "$BASE_URL/v2/user/$userId/ticket/$ticketId/close"
            val response: HttpResponse = client.put(url) {
                contentType(ContentType.Application.Json)
            }

            if (response.status.isSuccess()) {
                Log.d("ApiService", "✅ Ticket closed successfully!")
                true
            } else {
                Log.e("ApiService", "❌ Failed to close ticket: ${response.status}")
                false
            }
        } catch (e: Exception) {
            Log.e("ApiService", "❌ API Call Failed: ${e.localizedMessage}")
            false
        }
    }
}