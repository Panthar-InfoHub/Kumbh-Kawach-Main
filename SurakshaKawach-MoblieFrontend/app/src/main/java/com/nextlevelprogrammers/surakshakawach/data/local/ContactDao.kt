package com.nextlevelprogrammers.surakshakawach.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface ContactDao {
    @Query("SELECT * FROM contacts")
    fun getAllContacts(): Flow<List<ContactEntity>> // ✅ Auto-updates UI

    @Query("SELECT * FROM contacts WHERE phone_number = :phone_number LIMIT 1")
    fun getContactByPhoneNumber(phone_number: String): ContactEntity?

    @Query("DELETE FROM contacts")
    suspend fun deleteAllContacts()

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertContact(contact: ContactEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertContacts(contacts: List<ContactEntity>)

    @Delete
    suspend fun deleteContact(contact: ContactEntity)

    @Update
    suspend fun updateContact(contact: ContactEntity)

    @Transaction
    suspend fun upsertContact(contact: ContactEntity) {
        val existingContact = getContactByPhoneNumber(contact.phone_number)
        if (existingContact != null) {
            updateContact(contact.copy(contact_id = existingContact.contact_id))
        } else {
            insertContact(contact)
        }
    }
}