package com.nextlevelprogrammers.surakshakawach.model

import kotlinx.serialization.Serializable

@Serializable
data class VideoRequest(
    val video_id: String,
    val video_url: String,
    val bucket_url: String,
    val created_at: String
)