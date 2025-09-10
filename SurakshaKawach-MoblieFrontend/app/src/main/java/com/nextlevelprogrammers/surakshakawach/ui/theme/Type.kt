package com.nextlevelprogrammers.surakshakawach.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.nextlevelprogrammers.surakshakawach.R


// Define Custom FontFamily
val dm_sans = FontFamily(
    Font(R.font.dm_sans, FontWeight.Normal),  // Regular
    Font(R.font.dm_sans, FontWeight.Bold)     // Bold
)

// Set of Material Typography styles
val Typography = Typography(
    bodyLarge = TextStyle(
        fontFamily = dm_sans, // Apply the custom font
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.5.sp
    ),
    titleLarge = TextStyle(
        fontFamily = dm_sans,
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp
    ),
    labelSmall = TextStyle(
        fontFamily = dm_sans,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp
    )
)
