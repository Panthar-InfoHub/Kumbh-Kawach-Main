package com.nextlevelprogrammers.surakshakawach.model

import com.nextlevelprogrammers.surakshakawach.data.local.ContactEntity
import com.nextlevelprogrammers.surakshakawach.uidesign.ContactInfo

// Convert Room Database Entity to ContactInfo
fun ContactEntity.toContactInfo(): ContactInfo {
    return ContactInfo(
        contact_id = this.contact_id, // ✅ Ensure API ID is stored
        name = this.name,
        phone_number = this.phone_number,
        email = this.email,
        relationship = this.relationship
    )
}

// Convert API Response to ContactInfo
fun ContactResponse.toContactInfo(): ContactInfo {
    return ContactInfo(
        contact_id = this.contact_id, // ✅ Store API contact ID
        name = this.name,
        phone_number = this.phone_number,
        email = this.email ?: "",
        relationship = this.relationship ?: "" // ✅ Prevent null issues
    )
}

// Convert ContactInfo to Room Entity
fun ContactInfo.toContactEntity(): ContactEntity {
    return ContactEntity(
        contact_id = this.contact_id, // ✅ Ensure correct ID is stored
        name = this.name,
        phone_number = this.phone_number,
        email = this.email,
        relationship = this.relationship
    )
}

// Convert ContactInfo to API Request
fun ContactInfo.toContactRequest(): ContactRequest {
    return ContactRequest(
        name = this.name,
        phone_number = this.phone_number,
        email = this.email,
        relationship = this.relationship
    )
}