package com.nextlevelprogrammers.surakshakawach

import android.Manifest
import android.app.Activity
import android.app.KeyguardManager
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetCredentialResponse
import androidx.credentials.exceptions.GetCredentialException
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential.Companion.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.messaging.FirebaseMessaging
import com.nextlevelprogrammers.surakshakawach.data.remote.ApiService
import com.nextlevelprogrammers.surakshakawach.deviceadmin.MyDeviceAdminReceiver
import com.nextlevelprogrammers.surakshakawach.model.AuthRequest
import com.nextlevelprogrammers.surakshakawach.service.SOSForegroundService
import com.nextlevelprogrammers.surakshakawach.ui.theme.SurakshaKawachTheme
import com.nextlevelprogrammers.surakshakawach.uidesign.CountdownWindow
import com.nextlevelprogrammers.surakshakawach.uidesign.GetStartedLogin
import com.nextlevelprogrammers.surakshakawach.uidesign.MainScreen
import com.nextlevelprogrammers.surakshakawach.uidesign.SOSGranted
import com.nextlevelprogrammers.surakshakawach.uidesign.themeInsets.ThemeViewModel
import com.nextlevelprogrammers.surakshakawach.utils.LocationUtils
import com.nextlevelprogrammers.surakshakawach.viewmodel.AuthViewModel
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import java.time.Instant

class MainActivity : ComponentActivity() {

    private lateinit var auth: FirebaseAuth
    private lateinit var credentialManager: CredentialManager
    private lateinit var deviceAdminLauncher: ActivityResultLauncher<Intent>
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var locationUtils: LocationUtils


    @RequiresApi(Build.VERSION_CODES.Q)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val authViewModel = ViewModelProvider(this).get(AuthViewModel::class.java)



        sharedPreferences = getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)

        deviceAdminLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult())
        { result ->
            if (result.resultCode == Activity.RESULT_OK) {
                Toast.makeText(this, "Device Admin Enabled", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Device Admin Not Enabled", Toast.LENGTH_SHORT).show()
            }
        }

        if (!isDeviceAdminEnabled()) {
            requestDeviceAdmin()
        }

        auth = FirebaseAuth.getInstance()
        credentialManager = CredentialManager.create(this)

        locationUtils = LocationUtils(this)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestPermissions()
        }

        setContent {
            val themeViewModel: ThemeViewModel = viewModel(factory = object : ViewModelProvider.Factory {
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return ThemeViewModel(applicationContext) as T
                }
            })
            val isDarkTheme by themeViewModel.isDarkTheme.collectAsState()
            var SOS_Status by rememberSaveable{ mutableStateOf(false) }
            SurakshaKawachTheme(darkTheme = isDarkTheme) {
                Surface {
                    val navController = rememberNavController()
                    val startDestination = if (auth.currentUser != null && !(isFirstLogin())) Routes.MAIN_SCREEN else Routes.GET_STARTED
                    Log.d("First Login", "${isFirstLogin()}")
                    NavHost(navController, startDestination = startDestination) {
                        composable(Routes.GET_STARTED) {
                            GetStartedLogin(
                                navController = navController,
                                onGoogleSignInClick = { signInWithGoogle(navController) } // ✅ Pass Sign-In Click
                            )
                        }
                        composable(Routes.MAIN_SCREEN) {
                            val userId = auth.currentUser?.uid ?: "unknown"
                            MainScreen(
                                Modifier,
                                navController = navController,
                                onSignOutClick={signOut(navController)},
                                auth=auth,context = this@MainActivity, userId = userId,SOS_Status=SOS_Status, hideSOSFloatingButton={SOS_Status=false}, showSOSFloatingButton={SOS_Status=true},
                                themeViewModel=themeViewModel,
                                authViewModel=authViewModel,
                                startSOSFService= { startSOSService(userId = userId, context =  this@MainActivity) },
                                stopSOSService= { stopSOSService(this@MainActivity) },
                                isServiceRunning={isServiceRunning()}
                            )
                        }
                        composable(Routes.COUNTDOWN_SCREEN){
                            CountdownWindow(navController=navController)
                        }
                        composable(Routes.SOS_SENT){
                            val userId = auth.currentUser?.uid ?: "unknown"
                            SOSGranted(context = this@MainActivity, userId = userId, authViewModel = authViewModel, navController=navController,hideSOSFloatingButton={SOS_Status=false}, showSOSFloatingButton={SOS_Status=true})
                        }
                    }
                }
            }
        }
    }

    /** 🔥 Function to Sign in with Google using Credential Manager API */
    @RequiresApi(Build.VERSION_CODES.O)
    private fun signInWithGoogle(navController: NavHostController) {
        val googleIdTokenRequest = GetGoogleIdOption.Builder()
            .setFilterByAuthorizedAccounts(false)
            .setServerClientId(baseContext.getString(R.string.client_id))
            .setAutoSelectEnabled(true)
            .build()

        val request = GetCredentialRequest.Builder()
            .addCredentialOption(googleIdTokenRequest)
            .build()

        lifecycleScope.launch(Dispatchers.Main) {
            try {
                val result: GetCredentialResponse = credentialManager.getCredential(this@MainActivity, request)
                handleSignInResult(result, navController)
            } catch (e: GetCredentialException) {
                Log.e(TAG, "Google Sign-In failed: ${e.localizedMessage}")
            }
        }
    }

    /** 🔥 Handle Sign-In Result */
    @RequiresApi(Build.VERSION_CODES.O)
    private fun handleSignInResult(result: GetCredentialResponse, navController: NavHostController) {
        val credential = result.credential
        // ✅ Check if credential is of type Google ID Token
        if (credential is CustomCredential && credential.type == TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
            val googleIdToken = GoogleIdTokenCredential.createFrom(credential.data)
            firebaseAuthWithGoogle(googleIdToken.idToken, navController) // ✅ Proceed with Firebase Auth
        } else {
            Log.w(TAG, "Credential is not of type Google ID!")
        }
    }

    private suspend fun fetchUserDobFromGoogle(idToken: String): String {
        return withContext(Dispatchers.IO) {
            try {
                Log.d(TAG, "🔍 Skipping Google People API, using predefined DOB for testing.")

                val predefinedDob = "2000-01-01" // ✅ Use a fixed DOB for all users

                Log.d(TAG, "🎂 Using predefined DOB: $predefinedDob")
                return@withContext predefinedDob

            } catch (e: Exception) {
                Log.e(TAG, "❌ Failed to fetch DOB: ${e.localizedMessage}")
                return@withContext "unknown"
            }
        }
    }


    @RequiresApi(Build.VERSION_CODES.O)
    private fun firebaseAuthWithGoogle(idToken: String, navController: NavHostController) {
        val firebaseCredential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(firebaseCredential)
            .addOnCompleteListener { task ->
                if (task.isSuccessful)
                {
                    val user = auth.currentUser
                    val firebaseUid = user?.uid ?: return@addOnCompleteListener
                    Log.d(TAG, "✅ Firebase UID: $firebaseUid")

                    // ✅ Fetch DOB from Google People API
                    lifecycleScope.launch(Dispatchers.IO)
                    {
                        val dateOfBirth = fetchUserDobFromGoogle(idToken) ?: "unknown"
                        Log.d(TAG, "🎂 User DOB: $dateOfBirth")

                        // ✅ Get FCM Token
                        FirebaseMessaging.getInstance().token.addOnCompleteListener { tokenTask ->
                            if (tokenTask.isSuccessful) {
                                val fcmToken = tokenTask.result ?: "unknown"
                                Log.d(TAG, "🔥 FCM Token: $fcmToken")

                                // ✅ Send Data to Backend
                                sendAuthDataToBackend(firebaseUid, dateOfBirth, fcmToken, navController)

                            } else {
                                Log.e(TAG, "❌ Failed to get FCM Token: ${tokenTask.exception?.message}")
                            }
                        }
                    }
                    sharedPreferences.edit().putString("user_id", auth.currentUser?.uid).apply()
                    // Here we navigate to the Main Screen----
                    navController.navigate(Routes.MAIN_SCREEN){
                        popUpTo(Routes.GET_STARTED){inclusive=true} //This is how we remove the previous graph darling.
                        sharedPreferences.edit().putBoolean("is_First_login", false).apply()
                        Log.d("First Login", "${isFirstLogin()}")
                    }
                } else {
                    Log.e(TAG, "❌ Firebase authentication failed: ${task.exception?.localizedMessage}")
                }
            }
    }

    private val httpClient = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
            })
        }
    }


    @RequiresApi(Build.VERSION_CODES.O)
    private fun sendAuthDataToBackend(firebaseUid: String, dateOfBirth: String, fcmId: String, navController: NavHostController) {
        lifecycleScope.launch(Dispatchers.IO) {
            val apiService = ApiService()

            try {
                val formattedDob = try {
                    Instant.parse("${dateOfBirth}T00:00:00.000Z").toString()
                } catch (e: Exception) {
                    Log.e(TAG, "❌ Invalid date format, defaulting to predefined date")
                    "2000-01-01T00:00:00.000Z" // ✅ Default if parsing fails
                }

                val authRequest = AuthRequest(
                    firebase_uid = firebaseUid,
                    date_of_birth = formattedDob, // ✅ Correctly formatted date
                    fcm_id = fcmId
                )

                val response = apiService.authenticateUser(authRequest)

                // ✅ Check for successful authentication
                if (response.success || response.message.contains("successfully", ignoreCase = true)) {
                    Log.d(TAG, "✅ User authenticated successfully! User ID: ${response.user_id}")
                    withContext(Dispatchers.Main) {
                        navController.navigate("MainScreen") {
                            popUpTo("GetStarted") { inclusive = true }
                        }
                    }
                } else {
                    Log.e(TAG, "❌ Authentication failed: ${response.message}")
                }
            } catch (e: Exception) {
                Log.e(TAG, "❌ Failed to send auth data: ${e.localizedMessage}")
            }
        }
    }

    private fun signOut(navController: NavHostController){
        auth.signOut()
        sharedPreferences.edit().putString("user_id", null).apply()
        navController.navigate(Routes.GET_STARTED){
            popUpTo("MainScreen"){inclusive=true}
        }
    }

    private fun isDeviceAdminEnabled(): Boolean {
        val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val componentName = ComponentName(this, MyDeviceAdminReceiver::class.java)
        return dpm.isAdminActive(componentName) || sharedPreferences.getBoolean("isDeviceAdminEnabled", false)
    }

    private fun requestDeviceAdmin() {
        val componentName = ComponentName(this, MyDeviceAdminReceiver::class.java)
        val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN).apply {
            putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName)
            putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Enable admin to protect your data.")
        }
        deviceAdminLauncher.launch(intent)
    }


    //Location
    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    private fun requestPermissions() {
        val permissions = arrayOf(
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.POST_NOTIFICATIONS
        )

        val requestPermissionLauncher =
            registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
                val allGranted = permissions.values.all { it }
                if (allGranted) {
                    Log.d("MainActivity", "✅ All permissions granted")
                    fetchLocation() // ✅ Fetch location after permission granted
                } else {
                    Log.e("MainActivity", "❌ Some permissions were denied")
                    Toast.makeText(this, "Permissions are required for full functionality!", Toast.LENGTH_LONG).show()
                }
            }

        val allPermissionsGranted = permissions.all {
            ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
        }

        if (allPermissionsGranted) {
            fetchLocation()
        } else {
            requestPermissionLauncher.launch(permissions)
        }
    }

    private fun fetchLocation() {
        lifecycleScope.launch(Dispatchers.Main) {
            locationUtils.getLastKnownLocation { latitude, longitude ->
                Log.d("MainActivity", "Fetched Location: Lat: $latitude, Long: $longitude")
            }
        }
    }

    companion object {
        private const val TAG = "GoogleSignIn"
    }
    fun promptForLockScreen(authViewModel: AuthViewModel)
    {
        val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
        if (keyguardManager.isDeviceSecure) {
            val intent = keyguardManager.createConfirmDeviceCredentialIntent(
                "Authentication Required",
                "Please enter your lock screen password"
            )
            if (intent != null) {
                lockScreenLauncher.launch(intent)
                this.authCallback = { success -> authViewModel.setAuthenticated(success) } // ✅ Update ViewModel
            }
        } else {
            Toast.makeText(this, "No lock screen security set up", Toast.LENGTH_SHORT).show()
            authViewModel.setAuthenticated(false)
        }
    }

    private var authCallback: ((Boolean) -> Unit)? = null

    private val lockScreenLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val isAuthenticated = result.resultCode == RESULT_OK
            authCallback?.invoke(isAuthenticated) // ✅ Update ViewModel
            authCallback = null
        }
    @RequiresApi(Build.VERSION_CODES.O)
    fun startSOSService(context: Context, userId: String) {
        val intent = Intent(context, SOSForegroundService::class.java)
        intent.action = SOSForegroundService.Actions.START.toString()
        intent.putExtra(SOSForegroundService.USER_ID_KEY, userId)
        context.startForegroundService(intent)
    }


    fun stopSOSService(context: Context) {
        val intent = Intent(context, SOSForegroundService::class.java)
        intent.action = SOSForegroundService.Actions.STOP.toString()
        context.startService(intent)
    }

    fun isServiceRunning(): Boolean {
        val prefs = getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
        return prefs.getBoolean("is_service_running", false)
    }

    fun isFirstLogin(): Boolean{
        val prefs= getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
        return prefs.getBoolean("is_First_login", true)
    }





    data class UserData(
        val uid: String = "",
        val displayName: String? = null,
        val email: String? = null,
        val photoUrl: String? = null,
        val phoneNumber: String? = null
    )
}
