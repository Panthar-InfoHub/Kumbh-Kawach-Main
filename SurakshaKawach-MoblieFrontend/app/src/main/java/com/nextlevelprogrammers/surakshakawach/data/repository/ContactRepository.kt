package com.nextlevelprogrammers.surakshakawach.data.repository

import android.util.Log
import com.nextlevelprogrammers.surakshakawach.data.local.ContactDao
import com.nextlevelprogrammers.surakshakawach.data.remote.ApiService
import com.nextlevelprogrammers.surakshakawach.model.*
import com.nextlevelprogrammers.surakshakawach.uidesign.ContactInfo
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

class ContactRepository(
    private val apiService: ApiService,
    private val contactDao: ContactDao
) {

    fun getContactsFromRoom(): Flow<List<ContactInfo>> {
        return contactDao.getAllContacts().map { list ->
            Log.d("ContactRepository", "Fetched from Room DB: ${list.size} contacts")
            list.map { it.toContactInfo() }
        }
    }

    suspend fun saveContactToRoomAndSync(contact: ContactInfo, userId: String) {
        withContext(Dispatchers.IO) {
            try {
                Log.d("ContactRepository", "Syncing contact to API: $contact")

                val response: ApiResponse<ContactResponse>? = apiService.addContact(userId, contact.toContactRequest())

                if (response == null) {
                    Log.e("ContactRepository", "❌ API response is null")
                    return@withContext
                }

                // ✅ Ensure response contains valid data
                val contactResponse = response.data ?: run {
                    Log.e("ContactRepository", "❌ API response data is null")
                    return@withContext
                }

                Log.d("ContactRepository", "✅ Received contact from API: $contactResponse")

                // ✅ Convert API response to ContactInfo and store in Room
                val newContact = ContactInfo(
                    contact_id = contactResponse.contact_id,  // ✅ Store API Contact ID
                    name = contactResponse.name,
                    phone_number = contactResponse.phone_number,
                    email = contactResponse.email ?: "",
                    relationship = contactResponse.relationship ?: ""
                )

                Log.d("ContactRepository", "✅ Saving contact to Room with ID: ${newContact.contact_id}")

                // ✅ Store updated contact with `contact_id`
                contactDao.upsertContact(newContact.toContactEntity())

                Log.d("ContactRepository", "✅ Contact successfully saved in Room")
            } catch (e: Exception) {
                Log.e("ContactRepository", "❌ API Sync Failed: ${e.localizedMessage}")
            }
        }
    }

    suspend fun fetchContactsFromApi(userId: String) {
        withContext(Dispatchers.IO) {
            try {
                Log.d("ContactRepository", "Fetching contacts from API for user: $userId")
                val contactsFromApi = apiService.getContacts(userId).map { it.toContactInfo() }
                val existingContacts = contactDao.getAllContacts().firstOrNull()?.map { it.toContactInfo() } ?: emptyList()

                val newContacts = contactsFromApi.filter { apiContact ->
                    existingContacts.none { existingContact -> existingContact.phone_number == apiContact.phone_number }
                }

                Log.d("ContactRepository", "New contacts to be added: ${newContacts.size}")
                if (newContacts.isNotEmpty()) {
                    contactDao.insertContacts(newContacts.map { it.toContactEntity() })
                    Log.d("ContactRepository", "✅ ${newContacts.size} new contacts added to Room DB")
                } else {
                    Log.d("ContactRepository", "⚠ No new contacts to add from API")
                }
            } catch (e: Exception) {
                Log.e("ContactRepository", "❌ API Fetch Failed: ${e.localizedMessage}")
            }
        }
    }


    suspend fun deleteContact(contact: ContactInfo, userId: String): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("ContactRepository", "Attempting to delete contact: ${contact.phone_number}")

                if (contact.phone_number.isBlank()) {
                    Log.e("ContactRepository", "❌ Contact ID is missing! Deletion aborted.")
                    return@withContext false
                }

                val isDeletedFromAPI = apiService.deleteContact(userId, contact.contact_id) // ✅ Use Contact ID

                if (isDeletedFromAPI) {
                    contactDao.deleteContact(contact.toContactEntity()) // ✅ Delete from Room
                    Log.d("ContactRepository", "✅ Contact deleted from API & Room DB: ${contact.phone_number}")
                    true
                } else {
                    Log.e("ContactRepository", "❌ Failed to delete contact from API")
                    false
                }
            } catch (e: Exception) {
                Log.e("ContactRepository", "❌ Error deleting contact: ${e.localizedMessage}")
                false
            }
        }
    }

    suspend fun updateContact(contact: ContactInfo) {
        withContext(Dispatchers.IO) {
            Log.d("ContactRepository", "Updating contact: $contact in Room DB")
            contactDao.updateContact(contact.toContactEntity())
        }
    }
}