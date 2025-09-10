package com.nextlevelprogrammers.surakshakawach.uidesign.themeInsets

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking

private const val PREFS_NAME = "theme_prefs"

// Extension property to create DataStore
private val Context.dataStore by preferencesDataStore(name = PREFS_NAME)

object ThemePreferences {
    private val THEME_KEY = booleanPreferencesKey("dark_mode")

    // Function to save the theme preference
    suspend fun saveTheme(context: Context, isDarkMode: Boolean) {
        context.dataStore.edit { settings ->
            settings[THEME_KEY] = isDarkMode
        }
    }

    // Function to get the saved theme preference
    fun getSavedTheme(context: Context): Flow<Boolean> {
        return context.dataStore.data.map { preferences ->
            preferences[THEME_KEY] ?: false // Default to Light Mode
        }
    }

    // Synchronous way to get the current theme (if needed)
    fun getCurrentTheme(context: Context): Boolean {
        return runBlocking {
            context.dataStore.data.first()[THEME_KEY] ?: false
        }
    }
}

