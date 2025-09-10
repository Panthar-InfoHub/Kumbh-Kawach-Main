package com.nextlevelprogrammers.surakshakawach.uidesign

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.nextlevelprogrammers.surakshakawach.R
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@RequiresApi(Build.VERSION_CODES.Q)
@OptIn(ExperimentalAnimationApi::class)
@Composable
fun GetStartedLogin(
    modifier: Modifier = Modifier.background(color = colorResource(R.color.background)),
    navController: NavController,
    onGoogleSignInClick: () -> Unit
){



    var currentIndex by remember{ mutableIntStateOf(0) }
    val scope= rememberCoroutineScope()

    //Sliding Text Timer
    LaunchedEffect(Unit){
        scope.launch {
            while (true){
                delay(3000)
                currentIndex= (currentIndex+1) % 2
            }
        }
    }

    val indicatorPosition by animateFloatAsState(
        targetValue = if (currentIndex == 0) 0f else 1f,
        animationSpec = tween(durationMillis = 300, easing = FastOutSlowInEasing)
    )

    // Gradient Colors
    val colorStops= if(isSystemInDarkTheme()){
        listOf(
            colorResource(R.color.primary),
            colorResource(R.color.secondary),
            colorResource(R.color.background)
        )
    }else{listOf(
        colorResource(R.color.primary),
        colorResource(R.color.background)
    )}

    ScreenWithGradient(modifier=Modifier,
        colorStops,
        currentIndex,
        indicatorPosition,
        navController,
        onGoogleSignInClick)

}

@Composable
fun ScreenWithGradient(
    modifier: Modifier,
    colorStops: List<Color>,
    currentIndex: Int,
    indicatorPosition: Float,
    navController: NavController,
    onGoogleSignInClick:()-> Unit,
){
    Box(modifier=modifier.fillMaxSize().background(colorResource(R.color.background)), contentAlignment = Alignment.Center)
    {
        Box(modifier= modifier.background(brush = Brush.verticalGradient(
            colors = colorStops,
        )).fillMaxWidth().fillMaxHeight(0.65f)
            .align(Alignment.TopCenter))

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxHeight(0.8f).fillMaxWidth(0.85f)
        ) {

            WelcomeBundle(modifier=modifier, currentIndex, indicatorPosition)

            GoogleSignInButton(modifier=modifier.fillMaxWidth().padding(4.dp), navController, onGoogleSignInClick)
        }
    }
}

@Composable
fun WelcomeBundle(modifier: Modifier, currentIndex:Int, indicatorPosition: Float){
    Column(horizontalAlignment = Alignment.CenterHorizontally)
    {
        Image(
            painter = painterResource(R.drawable.logo),
            contentDescription = "Surasksha_Kavach_Logo",
            modifier = modifier.size(130.dp),
        )

        Spacer(modifier=Modifier.height(70.dp))

        Text(
            text = "Welcome",
            fontSize = 20.sp,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onPrimary
        )

        Spacer(modifier=Modifier.height(8.dp))

         LoopingInfoText(modifier.fillMaxWidth(), currentIndex)

        Spacer(modifier=Modifier.height(40.dp))
        SliderBar(indicatorPosition)


    }
}

@OptIn(ExperimentalAnimationApi::class)
@Composable
fun LoopingInfoText(modifier: Modifier, currentIndex: Int){

    val textItems = listOf(
        "Suraksha Kawach ensures your personal safety",
        "Quick emergency alerts and live sharing"
    )


    Box(
        modifier = modifier.fillMaxWidth().padding(8.dp),
        contentAlignment = Alignment.Center
    ) {
        AnimatedContent(
            targetState = currentIndex,
            transitionSpec = {
                slideIntoContainer(
                    animationSpec = tween(600, easing = LinearEasing),
                    towards = AnimatedContentTransitionScope.SlideDirection.Left
                ) togetherWith slideOutOfContainer(
                    animationSpec = tween(600, easing = LinearEasing),
                    towards = AnimatedContentTransitionScope.SlideDirection.Left
                )
            }
        ) { index ->
                Text(
                    text = textItems[index],
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    lineHeight = 38.sp,
                    color = MaterialTheme.colorScheme.onPrimary
                )

        }
    }

}

@Composable
fun SliderBar(indicatorPosition: Float){
    Box(
        modifier = Modifier
            .padding(top = 8.dp)
            .width(100.dp) // Width of the indicator bar
            .height(4.dp) // Indicator thickness
            .background(
                Color.LightGray,
                shape = RoundedCornerShape(50)
            ) // Background for the whole bar
    ) {
        Box(modifier = Modifier
            .fillMaxHeight()
            .width(44.dp) // Width of highlighted section
            .offset(x = 60.dp * indicatorPosition) // Animate position
            .background(
                color = colorResource(R.color.background),
                shape = RoundedCornerShape(50)
            ),
            contentAlignment = Alignment.Center)
        {
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .width(40.dp) // Width of highlighted section
                    .background(
                        color = colorResource(R.color.primary),
                        shape = RoundedCornerShape(50)
                    )
            )
        }
    }
}

@Composable
fun GoogleSignInButton(
    modifier: Modifier,
    navController: NavController,
    onGoogleSignInClick: () -> Unit
){
    val context = LocalContext.current
    Button(onClick = {
            onGoogleSignInClick()
    },
        modifier=modifier.fillMaxWidth(),
        colors = ButtonDefaults.buttonColors(containerColor = colorResource(R.color.googleloginbuttoncolor), contentColor = Color.Black),
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp))
    {
        Row (verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)){
            Image(
                painter = painterResource(R.drawable.google_icon),
                contentDescription = "Google_Icon",
                modifier=Modifier.size(35.dp)
            )
            Text(
                text = "Continue With Google",
                fontSize = 20.sp
            )
        }
    }
}
