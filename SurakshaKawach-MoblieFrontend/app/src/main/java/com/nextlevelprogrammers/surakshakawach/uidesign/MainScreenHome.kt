package com.nextlevelprogrammers.surakshakawach.uidesign

import android.content.Context
import android.os.Build
import android.util.Log
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil3.compose.AsyncImage
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.LatLng
import com.google.firebase.auth.FirebaseAuth
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.rememberCameraPositionState
import com.google.maps.android.compose.rememberUpdatedMarkerState
import com.nextlevelprogrammers.surakshakawach.R
import com.nextlevelprogrammers.surakshakawach.utils.LocationUtils
import kotlinx.coroutines.delay

@RequiresApi(Build.VERSION_CODES.O)
@Composable

fun MainScreenHome(
    modifier: Modifier,
    navController: NavController,
    auth: FirebaseAuth,
    showSOSFloatingButton: () -> Unit,
    startSOSFService: () -> Unit,
    isServiceRunning: () -> Boolean
)
{
    val context = LocalContext.current
    val prefs = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
    val user= auth.currentUser
    val user_name = user?.displayName
    val user_profile_picture = user?.photoUrl
    var showCountDownDialog by remember{ mutableStateOf(false)}


    Box(contentAlignment = Alignment.Center, modifier = Modifier.padding()){
        Column(
            modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)
                .padding(top = 12.dp)
        )
        {
            Row(
                modifier = modifier.fillMaxWidth().padding(vertical = 4.dp, horizontal = 24.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            )
            {
                Log.d("UserRow", "Rendering Row: user_name = $user_name, user_profile_picture = $user_profile_picture")
                Text(
                    text = "Hi, $user_name!",
                    fontSize = 22.sp
                )
                Box(
                    modifier = modifier.size(44.dp).clip(CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    AsyncImage(
                        model = user_profile_picture,
                        contentDescription = "Profile Picture",
                        modifier = modifier.size(36.dp).clip(CircleShape)
                    )
                }
            }

            Box(modifier = modifier.weight(1f).fillMaxSize().padding(horizontal = 12.dp, vertical = 16.dp))
            {
                SOSDisplay(modifier, navController,showCountDownDialog,sendSOS={showCountDownDialog=true}, isServiceRunning={isServiceRunning()})
            }
        }
        if(showCountDownDialog){
            CountDownDialog(
                showCountDownDialog = showCountDownDialog,
                hideSOSDialog = {showCountDownDialog=false},
                activateSOS = {
                    startSOSFService()
                    showSOSFloatingButton()
//                    navController.navigate(Routes.SOS_SENT)
                }
            )
        }
    }
    
}

@Composable
fun SOSDisplay(
    modifier: Modifier,
    navController: NavController,
    showCountDownDialog: Boolean,
    sendSOS: () -> Unit,
    isServiceRunning: () -> Boolean
){
    val context= LocalContext.current
    val locationUtils = remember { LocationUtils(navController.context) }
    var currentLocation by remember { mutableStateOf<LatLng?>(null) }
    val cameraPositionState = rememberCameraPositionState()
    var showMap by remember { mutableStateOf(false) }

    // Fetch location
    LaunchedEffect(Unit) {
        locationUtils.getLastKnownLocation { lat, long ->
            currentLocation = LatLng(lat, long)
            Log.d("GoogleMap", "User Location: $lat, $long")
        }
    }

    // Animate camera when location updates
    LaunchedEffect(currentLocation) {
        currentLocation?.let {
            cameraPositionState.move(
                update = CameraUpdateFactory.newLatLngZoom(it, 15f)
            )
        }
        showMap=true
    }

    Box(modifier = modifier.fillMaxSize(), contentAlignment = Alignment.BottomCenter){
        Box(modifier.fillMaxWidth().fillMaxHeight(0.885f).align(Alignment.TopCenter), contentAlignment = Alignment.BottomCenter){
            Box(modifier=modifier.fillMaxSize().shadow(2.dp,RoundedCornerShape(28.dp)).clip(RoundedCornerShape(28.dp)).background(Color.LightGray)) {
                if (currentLocation != null && showMap==true) {
                    GoogleMap(
                        modifier = Modifier.fillMaxSize(),
                        cameraPositionState = cameraPositionState
                    ) {
                        Marker(
                            state = rememberUpdatedMarkerState(position = currentLocation!!),
                            title = "Your Location"
                        )
                    }
                }
            }
            IconButton(modifier=modifier.size(150.dp).offset(y=(75.dp)),
                onClick = {
                    if(isServiceRunning()){
                        Toast.makeText(context, "SOS is Active Right Now", Toast.LENGTH_LONG).show()
                    }
                    else{
                        sendSOS()
                    }
                }){
                Image(
                    painter=painterResource(R.drawable.sosbutton),
                    contentDescription = "SOSButton"
                )
            }
        }

    }
}
////This is the dialog box for Countdown/////////

@RequiresApi(Build.VERSION_CODES.O)
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CountDownDialog(
    showCountDownDialog: Boolean,
    hideSOSDialog: () -> Unit,
    activateSOS: () -> Unit

){
    var seconds by remember { mutableStateOf(10 )}
    val context= LocalContext.current
    LaunchedEffect(Unit){
        for(i in 9 downTo 1) {
            delay(1000L)
            seconds = i
        }
        activateSOS()
        hideSOSDialog()
    }
    AlertDialog(
        onDismissRequest = hideSOSDialog ,
        title = { Text("SOS Confirmation") },
        text = {
            Column(modifier = Modifier.padding(8.dp)) {
                Text(
                    text="Sending SOS in $seconds seconds...",
                    textAlign = TextAlign.Center
                )
            }
        },
        confirmButton = {
            Button(onClick = {
                activateSOS()
                hideSOSDialog()

            }) {
                Text("Send SOS")
            }
        },
        dismissButton = {
            TextButton(onClick = { hideSOSDialog()}) {
                Text("Cancel SOS")
            }
        }
    )
}