package com.nextlevelprogrammers.surakshakawach.uidesign

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.nextlevelprogrammers.surakshakawach.Routes
import kotlinx.coroutines.delay

@Composable
fun CountdownWindow(modifier: Modifier=Modifier, navController: NavHostController){
    var seconds by remember { mutableStateOf(10 )}
    val context= LocalContext.current
    LaunchedEffect(Unit){
        for(i in 10 downTo 1) {
            delay(1000L)
            seconds = i
        }
        navController.navigate(Routes.SOS_SENT){navController.popBackStack()}
    }
    Box(modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center){
        Column(modifier=modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                text="SOS will granted automatically in $seconds seconds",
                textAlign = TextAlign.Center
            )
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Button(onClick = {navController.popBackStack()}, modifier=modifier.shadow(elevation = 2.dp)){
                    Text("Cancel",
                        color = MaterialTheme.colorScheme.onBackground)
                }
                Button(onClick = {navController.navigate(Routes.SOS_SENT){navController.popBackStack()} }){
                    Text("Send SOS",
                        color = MaterialTheme.colorScheme.onPrimary)
                }
            }
        }
    }
}