package com.nextlevelprogrammers.surakshakawach.model

import kotlinx.serialization.Serializable

@Serializable
data class SOSResponse(
    val message: String,
    val data: TicketData? = null
)

@Serializable
data class TicketData(
    val video: List<String>,
    val ticket_id: String,
    val user_id: String,
    val station_id: String?, //Error Resolved
    val status: String,
    val location_data: List<LocationData>,
    val images: List<String>,
    val audio: List<String>,
    val transfer_reason: String? = null,
    val ticket_priority: Int,
    val updatedAt: String,
    val createdAt: String
)

@Serializable
data class LocationData(
    val latitude: Double,
    val longitude: Double,
    val created_at: String
)