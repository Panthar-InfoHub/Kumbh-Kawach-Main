package com.nextlevelprogrammers.surakshakawach.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class AuthViewModel : ViewModel() {
    private val _isAuthenticated = MutableStateFlow(false)
    val isAuthenticated: StateFlow<Boolean> = _isAuthenticated

    fun setAuthenticated(value: Boolean) {
        _isAuthenticated.value = value
    }

    fun resetAuthentication() {
        _isAuthenticated.value = false // ✅ Reset authentication when SOS starts
    }
}
