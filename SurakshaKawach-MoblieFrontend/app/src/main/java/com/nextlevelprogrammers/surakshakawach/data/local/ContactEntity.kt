package com.nextlevelprogrammers.surakshakawach.data.local

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "contacts",
    indices = [Index(value = ["contact_id"], unique = true)] // ✅ Ensure `contact_id` is unique
)
data class ContactEntity(
    @PrimaryKey val contact_id: String, // ✅ Store API Contact ID
    val name: String,
    val phone_number: String,
    val email: String,
    val relationship: String
)