package com.nextlevelprogrammers.surakshakawach.model

import kotlinx.serialization.Serializable // ✅ Import the annotation

@Serializable // ✅ Add this annotation
data class ContactRequest(
    val name: String,
    val phone_number: String,
    val email: String,
    val relationship: String
)