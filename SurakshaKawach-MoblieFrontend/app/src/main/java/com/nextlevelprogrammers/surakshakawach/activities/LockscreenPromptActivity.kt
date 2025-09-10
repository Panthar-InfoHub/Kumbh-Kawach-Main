package com.nextlevelprogrammers.surakshakawach.activities

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import com.nextlevelprogrammers.surakshakawach.service.SOSForegroundService

class LockscreenPromptActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager

        if (keyguardManager.isKeyguardSecure) {
            val intent = keyguardManager.createConfirmDeviceCredentialIntent(
                "Confirm Identity", "Please unlock to stop SOS"
            )

            val launcher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
                if (result.resultCode == RESULT_OK) {
                    // Unlock successful
                    Toast.makeText(this, "SOS Stopped Successfully", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, SOSForegroundService::class.java)
                    intent.action = SOSForegroundService.Actions.STOP.toString()
                    this.startService(intent)
                    finish()
                } else {
                    Toast.makeText(this, "Verification failed", Toast.LENGTH_SHORT).show()
                    finish()
                }
            }

            launcher.launch(intent)
        } else {
            Toast.makeText(this, "No lock screen set up! Start App to Stop SOS", Toast.LENGTH_LONG).show()
            finish()
        }
    }
}
