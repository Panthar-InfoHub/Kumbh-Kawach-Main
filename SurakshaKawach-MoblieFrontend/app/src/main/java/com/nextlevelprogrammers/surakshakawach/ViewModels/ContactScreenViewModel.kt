package com.nextlevelprogrammers.surakshakawach.ViewModels

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseAuth
import com.nextlevelprogrammers.surakshakawach.IntentAction.ContactScreenAction
import com.nextlevelprogrammers.surakshakawach.data.repository.ContactRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class ContactScreenViewModel(private val contactRepository: ContactRepository) : ViewModel() {
    private val _state = MutableStateFlow(ContactScreenStateValues())
    val state = _state.asStateFlow()

    private var isContactsLoaded = false

    init {
        loadContacts()
    }

    private fun loadContacts() {
        viewModelScope.launch {
            Log.d("ContactScreenViewModel", "Loading contacts from Room DB")
            contactRepository.getContactsFromRoom().collect { contacts ->
                Log.d("ContactScreenViewModel", "Contacts loaded from Room: ${contacts.size}")
                _state.update { it.copy(contactList = contacts) }
            }
        }
    }

    fun onAction(action: ContactScreenAction) {
        Log.d("ContactScreenViewModel", "Action received: $action")

        when (action) {
            ContactScreenAction.FetchContactsFromApi -> {
                viewModelScope.launch {
                    if (!isContactsLoaded) {
                        val userId = FirebaseAuth.getInstance().currentUser?.uid
                        if (!userId.isNullOrEmpty()) {
                            Log.d("ContactScreenViewModel", "Fetching contacts from API")
                            contactRepository.fetchContactsFromApi(userId)
                            refreshContacts() // ✅ Ensure UI updates properly
                        }
                        isContactsLoaded = true
                    }
                }
            }

            ContactScreenAction.OnCancelSaveContact -> {
                _state.update { it.copy(showAddDialog = false) }
            }

            ContactScreenAction.OnClickAddContact -> {
                _state.update { it.copy(showAddDialog = true) }
            }

            ContactScreenAction.OnClickEditCancel -> {
                _state.update { it.copy(showEditDialog = false) }
            }

            is ContactScreenAction.OnClickEditSave -> {
                viewModelScope.launch {
                    Log.d("ContactScreenViewModel", "Editing contact: ${action.contact.phone_number}")
                    contactRepository.updateContact(action.contact.copy(
                        name = action.newName,
                        phone_number = action.newNumber,
                        email = action.newEmail,
                        relationship = action.newRelation
                    ))
                    _state.update { it.copy(showEditDialog = false) }
                    refreshContacts()
                }
            }

            is ContactScreenAction.OnClickSaveContact -> {
                viewModelScope.launch {
                    val userId = FirebaseAuth.getInstance().currentUser?.uid
                    if (!userId.isNullOrEmpty()) {
                        Log.d("ContactScreenViewModel", "Saving new contact: ${action.contact.phone_number}")
                        contactRepository.saveContactToRoomAndSync(action.contact, userId)
                        refreshContacts()
                        _state.update { it.copy() }
                    }
                }
            }

            is ContactScreenAction.OnSwipeContactDelete -> {
                viewModelScope.launch {
                    val userId = FirebaseAuth.getInstance().currentUser?.uid
                    if (!userId.isNullOrEmpty()) {
                        try {
                            Log.d("ContactScreenViewModel", "Deleting contact: ${action.contact.phone_number}")
                            val isDeleted = contactRepository.deleteContact(action.contact, userId)

                            if (isDeleted) {
                                Log.d("ContactScreenViewModel", "✅ Contact deleted and refreshing UI")
                                refreshContacts() // ✅ Ensure UI updates after deletion
                                _state.update { it.copy() }
                            } else {
                                Log.e("ContactScreenViewModel", "❌ Contact deletion failed")
                            }
                        } catch (e: Exception) {
                            Log.e("ContactScreenViewModel", "❌ Error deleting contact: ${e.localizedMessage}")
                        }
                    } else {
                        Log.e("ContactScreenViewModel", "❌ Cannot delete contact: User not logged in")
                    }
                }
            }

            is ContactScreenAction.OnSwipeContactEdit -> {
                _state.update {
                    it.copy(
                        currentContact = action.contact,
                        showEditDialog = true
                    )
                }
            }
        }
    }

    private fun refreshContacts() {
        viewModelScope.launch {
            Log.d("ContactScreenViewModel", "Refreshing contacts from Room DB")
            contactRepository.getContactsFromRoom().collect { contacts ->
                Log.d("ContactScreenViewModel", "Updated contact list: ${contacts.size}")
                _state.update { it.copy(contactList = contacts) }
            }
        }
    }
}