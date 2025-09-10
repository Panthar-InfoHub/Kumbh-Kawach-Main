package com.nextlevelprogrammers.surakshakawach.uidesign

import com.nextlevelprogrammers.surakshakawach.data.local.ContactEntity
import com.nextlevelprogrammers.surakshakawach.model.ContactResponse

data class ContactInfo(
    val contact_id: String,  // ✅ Store API Contact ID
    val name: String,
    val phone_number: String,
    val email: String,
    val relationship: String
)

// Convert ContactEntity -> ContactInfo
fun ContactEntity.toContactInfo(): ContactInfo {
    return ContactInfo(contact_id, name, phone_number, email, relationship)
}

// Convert ContactInfo -> ContactEntity (for Room Database)
fun ContactInfo.toContactEntity(): ContactEntity {
    return ContactEntity(contact_id, name, phone_number, email, relationship)
}

// Convert API Response -> ContactInfo
fun ContactResponse.toContactInfo(): ContactInfo {
    return ContactInfo(contact_id, name, phone_number, email ?: "", relationship ?: "")
}