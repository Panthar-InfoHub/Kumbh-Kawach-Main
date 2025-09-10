package com.nextlevelprogrammers.surakshakawach.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AuthResponse(
    @SerialName("success") val success: Boolean = false, // ✅ Default to `false` to prevent null values
    @SerialName("message") val message: String = "",
    @SerialName("user_id") val user_id: String? = null
)