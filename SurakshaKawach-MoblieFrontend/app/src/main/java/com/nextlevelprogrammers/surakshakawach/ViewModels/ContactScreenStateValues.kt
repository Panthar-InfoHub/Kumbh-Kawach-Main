package com.nextlevelprogrammers.surakshakawach.ViewModels

import com.nextlevelprogrammers.surakshakawach.uidesign.ContactInfo

data class ContactScreenStateValues(
    val showAddDialog: Boolean = false,
    val showEditDialog: Boolean = false,
    val currentContact: ContactInfo? = null,
    val contactList: List<ContactInfo> = emptyList()
)