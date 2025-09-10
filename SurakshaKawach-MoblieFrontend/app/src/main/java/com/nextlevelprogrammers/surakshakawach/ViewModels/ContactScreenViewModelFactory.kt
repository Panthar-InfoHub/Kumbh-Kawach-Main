package com.nextlevelprogrammers.surakshakawach.ViewModels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.nextlevelprogrammers.surakshakawach.data.repository.ContactRepository

class ContactScreenViewModelFactory(private val contactRepository: ContactRepository) :
    ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(ContactScreenViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return ContactScreenViewModel(contactRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}