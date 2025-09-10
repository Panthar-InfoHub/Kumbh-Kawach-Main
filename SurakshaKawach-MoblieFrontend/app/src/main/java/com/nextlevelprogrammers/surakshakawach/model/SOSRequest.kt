package com.nextlevelprogrammers.surakshakawach.model

import kotlinx.serialization.Serializable

@Serializable
data class SOSRequest(
    val latitude: Double,
    val longitude: Double,
    val created_at: String
)