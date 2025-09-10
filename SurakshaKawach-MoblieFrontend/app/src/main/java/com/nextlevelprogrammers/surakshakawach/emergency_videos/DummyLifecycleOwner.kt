package com.nextlevelprogrammers.surakshakawach.emergency_videos

import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry

class DummyLifecycleOwner : LifecycleOwner {
    private val lifecycleRegistry = LifecycleRegistry(this)

    init {
        lifecycleRegistry.currentState = Lifecycle.State.STARTED
    }

    override val lifecycle: Lifecycle
        get() = lifecycleRegistry

    fun shutdown() {
        lifecycleRegistry.currentState = Lifecycle.State.DESTROYED
    }
}