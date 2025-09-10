package com.nextlevelprogrammers.surakshakawach.utils

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import android.util.Log
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.tasks.OnCompleteListener

class LocationUtils(private val context: Context) {

    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(context)

    @SuppressLint("MissingPermission")
    fun getLastKnownLocation(onLocationReceived: (latitude: Double, longitude: Double) -> Unit) {
        fusedLocationClient.lastLocation.addOnCompleteListener(OnCompleteListener<Location> { task ->
            if (task.isSuccessful && task.result != null) {
                val location: Location = task.result
                onLocationReceived(location.latitude, location.longitude)
            } else {
                Log.e("LocationUtils", "Failed to get location")
            }
        })
    }
}