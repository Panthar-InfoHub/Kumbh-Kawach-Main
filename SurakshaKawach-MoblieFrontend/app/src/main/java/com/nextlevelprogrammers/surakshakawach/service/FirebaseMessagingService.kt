package com.nextlevelprogrammers.surakshakawach

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class FirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d(TAG, "📩 Message Received: ${remoteMessage.data}")

        if (remoteMessage.notification != null) {
            Log.d(TAG, "📢 Notification: ${remoteMessage.notification?.body}")
        }
    }

    override fun onNewToken(token: String) {
        Log.d(TAG, "🔥 New FCM Token: $token")
        // ✅ Save this token or send it to your backend
    }

    companion object {
        private const val TAG = "FCMService"
    }
}