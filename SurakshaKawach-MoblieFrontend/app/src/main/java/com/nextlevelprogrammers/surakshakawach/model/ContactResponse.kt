package com.nextlevelprogrammers.surakshakawach.model

import kotlinx.serialization.Serializable

// ✅ API Response Model (This matches the outer structure of the API response)
@Serializable
data class ApiResponse<T>(
    val message: String,
    val data: T? = null // Generic type to hold the actual data (like ContactResponse)
)

// ✅ Contact Model (Matches the inner `data` object)
@Serializable
data class ContactResponse(
    val contact_id: String,
    val user_id: String,
    val contact_firebase_uid: String? = null,
    val name: String,
    val phone_number: String,
    val relationship: String? = null,
    val email: String? = null,
    val updatedAt: String,
    val createdAt: String
)