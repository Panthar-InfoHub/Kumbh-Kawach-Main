package com.nextlevelprogrammers.surakshakawach.uidesign

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Male
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.google.firebase.auth.FirebaseAuth
import com.nextlevelprogrammers.surakshakawach.MainActivity

@Composable
fun MainScreenProfile(modifier: Modifier = Modifier, onSignOutClick: () -> Unit) {
    Box(modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        val currentUser: MainActivity.UserData?
        val firebaseUser = FirebaseAuth.getInstance().currentUser
        currentUser = firebaseUser?.let {
            MainActivity.UserData(
                uid = it.uid,
                displayName = it.displayName,
                email = it.email,
                photoUrl = it.photoUrl?.toString(),
                phoneNumber = it.phoneNumber
            )
        }
        ProfileCard(onSignOutClick = onSignOutClick, user = currentUser)
    }
}

@Composable
fun ProfileCard(
    modifier: Modifier = Modifier,
    onSignOutClick: () -> Unit,
    user: MainActivity.UserData?,
) {
    val context = LocalContext.current
    val user_name = user?.displayName ?: ""
    val user_email = user?.email ?: ""
    val user_gender = "Male"



    Box(
        modifier = modifier
            .shadow(4.dp, RoundedCornerShape(24.dp))
            .clip(RoundedCornerShape(24.dp))
            .background(MaterialTheme.colorScheme.secondaryContainer)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(28.dp),
            modifier = modifier.padding(20.dp, 32.dp)
        ) {
            Log.d("UserRow", "Rendering Row: user_name = $user_name, user_profile_picture = ${user?.photoUrl.toString()}")

            AsyncImage(
                model = user?.photoUrl,
                contentDescription = "UserProfilePicture",
                modifier = modifier.size(120.dp).clip(CircleShape),
            )

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = user_name,
                    textAlign = TextAlign.Center,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    text = user_email,
                    textAlign = TextAlign.Center,
                    fontSize = 18.sp
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = user_gender,
                        textAlign = TextAlign.Center,
                        fontSize = 18.sp
                    )
                    Icon(
                        imageVector = Icons.Default.Male,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onBackground
                    )
                }
            }
            Button(
                onClick = { onSignOutClick() },
                modifier = modifier.fillMaxWidth(0.8f),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text("Sign Out", fontSize = 20.sp)
            }
        }
    }
}
