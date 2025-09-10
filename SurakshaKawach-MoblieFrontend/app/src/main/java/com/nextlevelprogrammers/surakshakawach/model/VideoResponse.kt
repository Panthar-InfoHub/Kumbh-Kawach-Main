package com.nextlevelprogrammers.surakshakawach.model

import kotlinx.serialization.Serializable

@Serializable
data class VideoResponse(
    val message: String,
    val data: List<VideoRequest>
)