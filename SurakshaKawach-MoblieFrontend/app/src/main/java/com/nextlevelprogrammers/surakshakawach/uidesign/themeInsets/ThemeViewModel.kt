package com.nextlevelprogrammers.surakshakawach.uidesign.themeInsets

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class ThemeViewModel(private val context: Context) : ViewModel() {
    private val _isDarkTheme = MutableStateFlow(false) // Default Light Mode
    val isDarkTheme: StateFlow<Boolean> = _isDarkTheme

    init {
        viewModelScope.launch {
            ThemePreferences.getSavedTheme(context).collect { isDark ->
                _isDarkTheme.value = isDark
            }
        }
    }

    fun toggleTheme() {
        viewModelScope.launch {
            val newTheme = !_isDarkTheme.value
            _isDarkTheme.value = newTheme
            ThemePreferences.saveTheme(context, newTheme)
        }
    }
}
