package com.nextlevelprogrammers.surakshakawach.uidesign

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.key
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.viewinterop.AndroidView
import com.nafis.bottomnavigation.NafisBottomNavigation
import com.nextlevelprogrammers.surakshakawach.R

@Composable
fun MeowBottomNavBar(
    selectedIndex: Int,
    onItemSelected: (Int) -> Unit
) {
    // Convert colors to integers and use them as a key
    val primary = MaterialTheme.colorScheme.primary.toArgb()
    val onPrimary = MaterialTheme.colorScheme.onPrimary.toArgb()
    val containerColor = MaterialTheme.colorScheme.surfaceContainer.toArgb()
    val backgroundColor = MaterialTheme.colorScheme.background.toArgb()

    // Key-based recomposition: Forces recreation when colors change
    key(primary, onPrimary, containerColor, backgroundColor) {
        AndroidView(
            modifier = Modifier.fillMaxWidth(),
            factory = { context ->
                NafisBottomNavigation(context).apply {
                    hasAnimation = true
                    setOnClickMenuListener { onItemSelected(it.id) }

                    // Add menu items
                    add(NafisBottomNavigation.Model(0, R.drawable.home))
                    add(NafisBottomNavigation.Model(1, R.drawable.contacts_icon))
                    add(NafisBottomNavigation.Model(2, R.drawable.profile_icon))
                }
            },
            update = { view ->
                // Set colors (will trigger re-creation on theme change)
                view.circleColor = primary
                view.defaultIconColor = primary
                view.selectedIconColor = onPrimary
                view.backgroundBottomColor = containerColor
                view.setBackgroundColor(backgroundColor)

                // Ensure the correct tab is selected
                view.show(selectedIndex, true)
            }
        )
    }
}
