package com.nextlevelprogrammers.surakshakawach.uidesign

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.GenericShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.google.firebase.auth.FirebaseAuth
import com.nextlevelprogrammers.surakshakawach.MainActivity
import com.nextlevelprogrammers.surakshakawach.R
import com.nextlevelprogrammers.surakshakawach.uidesign.themeInsets.ThemeViewModel
import com.nextlevelprogrammers.surakshakawach.viewmodel.AuthViewModel
import kotlinx.coroutines.delay

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun MainScreen(
    modifier: Modifier = Modifier,
    navController: NavController,
    onSignOutClick: () -> Unit,
    auth: FirebaseAuth,
    context: MainActivity,
    userId: String,
    SOS_Status: Boolean,
    hideSOSFloatingButton: () -> Unit,
    showSOSFloatingButton: () -> Unit,
    themeViewModel: ThemeViewModel,
    startSOSFService: () -> Unit,
    stopSOSService: () -> Unit,
    isServiceRunning: () -> Boolean,
    authViewModel: AuthViewModel,
){
    val isDarkTheme by themeViewModel.isDarkTheme.collectAsState()
    val BottomShadowShape = GenericShape { size, _ ->
        moveTo(0f, 0f)
        lineTo(size.width, 0f)
        lineTo(size.width, size.height)
        lineTo(0f, size.height)
        close()
    }
    var selectedIndex by rememberSaveable { mutableIntStateOf(0) }
    var isRunning by remember { mutableStateOf(isServiceRunning()) }
    val isAuthenticated by authViewModel.isAuthenticated.collectAsState()

    Scaffold(
        topBar = {
            Box(modifier=Modifier.fillMaxWidth()
                .shadow(elevation = 4.dp, shape = BottomShadowShape)
                .background(MaterialTheme.colorScheme.surfaceContainer)
                ){
                Row(
                    modifier = modifier.fillMaxWidth().padding(horizontal = 28.dp, vertical = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Image(
                        painter = painterResource(R.drawable.logo),
                        contentDescription = "SK_Logo",
                        modifier = Modifier.size(44.dp)
                    )
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)){
                        Box(
                            modifier = Modifier.size(30.dp).clip(CircleShape)
                                .background(MaterialTheme.colorScheme.background).clickable { },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                painter = painterResource(R.drawable.question_mark_circled_icon),
                                contentDescription = "Support",
                                modifier = Modifier.size(20.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                        Box(
                            modifier = Modifier.size(30.dp).clip(CircleShape)
                                .background(MaterialTheme.colorScheme.background).clickable {
                                    themeViewModel.toggleTheme()
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            val icon:Int
                            if(isDarkTheme) icon= R.drawable.light_mode_icon else icon=R.drawable.night_mode_icon
                            Icon(
                                painter = painterResource(icon),
                                contentDescription = "Support",
                                modifier = Modifier.size(20.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            }
        },
        bottomBar = {
            MeowBottomNavBar(selectedIndex = selectedIndex
            ) { newIndex ->
                selectedIndex = newIndex
            }
        },
        floatingActionButton ={
            if(isRunning){
                FloatingActionButton(
                    onClick = {
                        context.promptForLockScreen(authViewModel)
                        },
                    containerColor = Color.Red,
                    elevation = FloatingActionButtonDefaults.elevation(4.dp),
                    shape = CircleShape,
                    modifier = Modifier.pointerInput(Unit){
                        detectTapGestures(onLongPress = {
                            stopSOSService()
                            isRunning=false
                        })
                    }
                ){
                    Icon(Icons.Default.Cancel, "Stop SOS", tint = Color.White)
                }
            }
        }
    ) { innerPadding ->
        LaunchedEffect(isAuthenticated){
            if(isAuthenticated){
                stopSOSService()
                isRunning=false
                authViewModel.resetAuthentication()
            }
        }
        LaunchedEffect(Unit){
            while(true){
                val running= isServiceRunning()
                if(isRunning!=running){
                    isRunning=running
                }
                delay(2000)
            }
        }
        Box(modifier = Modifier.padding(innerPadding)) {
            when (selectedIndex) {
                0 -> MainScreenHome(modifier, navController,auth,showSOSFloatingButton={isRunning=true},
                    startSOSFService=startSOSFService,
                    { isServiceRunning() })
                1 -> MainScreenContactRoot(modifier)
                2 -> MainScreenProfile(onSignOutClick=onSignOutClick)
            }
        }
    }
}
