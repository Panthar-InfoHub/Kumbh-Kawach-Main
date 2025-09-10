plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.google.gms.google.services) // ✅ Google Services Plugin
    id("com.google.devtools.ksp") // ✅ Kotlin Symbol Processing
    kotlin("plugin.serialization") version "1.9.0"
    id("com.google.firebase.crashlytics")
    id ("com.google.firebase.firebase-perf")
}

android {
    namespace = "com.nextlevelprogrammers.surakshakawach"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.nextlevelprogrammers.surakshakawach"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
        multiDexEnabled = true
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
        viewBinding = true
        dataBinding = true
    }
    packaging {
        resources {
            excludes += "META-INF/DEPENDENCIES"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.ui.viewbinding)

    // ✅ Firebase (Managed via BOM)
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth)
    implementation(libs.firebase.firestore.ktx)
    implementation(libs.firebase.messaging.ktx)
    implementation(libs.play.services.auth) // ✅ Fixes missing CredentialsOptions.Builder
    implementation("com.google.firebase:firebase-storage-ktx:20.2.1")
    implementation("com.google.firebase:firebase-analytics")
    implementation("com.google.firebase:firebase-perf")

    // ✅ Jetpack Navigation
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.navigation.fragment)
    implementation("androidx.navigation:navigation-ui:2.8.7")
    implementation(libs.androidx.credentials)
    implementation(libs.androidx.credentials.play.services.auth)
    implementation(libs.googleid)
    implementation(libs.material)
    implementation(libs.androidx.monitor)
    implementation(libs.androidx.junit.ktx)
    implementation(libs.androidx.core.i18n)
    testImplementation(libs.junit.jupiter)
    testImplementation(libs.testng)
    androidTestImplementation(libs.junit.junit)
    androidTestImplementation(libs.testng)

    // ✅ Lifecycle ViewModel & LiveData
    val lifecycle_version = "2.8.7"
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:$lifecycle_version")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:$lifecycle_version")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:$lifecycle_version")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:$lifecycle_version")

    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")

    // ✅ Material Design Icons & Animations
    implementation("androidx.compose.material3:material3:1.3.1")
    implementation("androidx.compose.material3:material3-window-size-class:1.3.1")
    implementation("androidx.compose.material3:material3-adaptive-navigation-suite:1.4.0-alpha08")
    implementation("androidx.compose.material:material-icons-core:1.6.7")
    implementation("androidx.compose.material:material-icons-extended:1.6.7")

    // ✅ Room Database (with KSP for Code Generation)
    implementation(libs.androidx.room.runtime)
    ksp(libs.androidx.room.compiler)
    implementation(libs.androidx.room.ktx)

    // ✅ Nafis Bottom Navigation (Ensure it's correct)
    implementation("com.github.Foysalofficial:NafisBottomNav:5.0")

    implementation("io.ktor:ktor-client-core:2.3.5")
    implementation("io.ktor:ktor-client-cio:2.3.5") // Use CIO engine for Android networking

    // ✅ Ktor JSON Serialization & Content Negotiation
    implementation("io.ktor:ktor-client-content-negotiation:2.3.5")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.5")

    // ✅ Ktor Logging for Debugging
    implementation("io.ktor:ktor-client-logging:2.3.5")

    implementation("com.google.apis:google-api-services-people:v1-rev20220531-2.0.0")

    implementation("com.google.android.gms:play-services-auth:20.7.0")

    implementation("com.google.auth:google-auth-library-oauth2-http:1.18.0")

    implementation("com.google.api-client:google-api-client:2.2.0")
    implementation("com.google.http-client:google-http-client-gson:1.42.3")

    implementation (libs.play.services.location)

    //Coil for image loading
    implementation("io.coil-kt.coil3:coil-compose:3.1.0")
    implementation("com.squareup.okhttp3:okhttp:4.11.0")
    implementation("io.coil-kt.coil3:coil-network-okhttp:3.1.0")


    //Map dependencies
    implementation("com.google.android.gms:play-services-maps:19.1.0")
    implementation("com.google.maps.android:maps-compose:6.4.3")

    //CameraX dependencies
    implementation("androidx.camera:camera-core:1.4.1")
    implementation("androidx.camera:camera-camera2:1.4.1")
    implementation("androidx.camera:camera-lifecycle:1.4.1")
    implementation("androidx.camera:camera-video:1.4.1")
    implementation ("com.google.accompanist:accompanist-systemuicontroller:0.32.0")
    implementation ("androidx.datastore:datastore-preferences:1.0.0")
    implementation ("com.github.bumptech.glide:compose:1.0.0-beta01")

    implementation("com.google.firebase:firebase-perf")

    implementation ("ai.picovoice:porcupine-android:3.0.1")

}