package com.nextlevelprogrammers.surakshakawach.model

import kotlinx.serialization.Serializable
import java.text.SimpleDateFormat
import java.util.*

@Serializable
data class AuthRequest(
    val firebase_uid: String,
    val date_of_birth: String = getCurrentIsoDate(), // ✅ Ensures ISO 8601 format
    val fcm_id: String
) {
    companion object {
        fun getCurrentIsoDate(): String {
            val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US) // ✅ ISO 8601 format
            sdf.timeZone = TimeZone.getTimeZone("UTC") // ✅ Convert to UTC timezone
            return sdf.format(Date()) // ✅ Returns current date in API 24-compatible format
        }
    }
}