package com.nextlevelprogrammers.surakshakawach.model

import kotlinx.serialization.Serializable

@Serializable
data class LocationUpdateRequest(
    val latitude: Double,
    val longitude: Double,
    val created_at: String
)