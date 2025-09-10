package com.nextlevelprogrammers.surakshakawach.uidesign

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.os.Build
import android.widget.RemoteViews
import com.nextlevelprogrammers.surakshakawach.R
import com.nextlevelprogrammers.surakshakawach.broadcastReciever.SOSWidgetReciever

class SOSWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {


        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_sos_layout)
                val intent = Intent(context, SOSWidgetReciever::class.java).apply {
                    action = "com.nextlevelprogrammers.surakshakawach.SOS_ACTION"
                }
                val pendingIntent = PendingIntent.getBroadcast(
                    context,
                    appWidgetId,
                    intent,
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S)
                        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
                    else PendingIntent.FLAG_UPDATE_CURRENT
                )
                views.setOnClickPendingIntent(R.id.slider_container, pendingIntent)
                views.setOnClickPendingIntent(R.id.slider_knob, pendingIntent)
                views.setOnClickPendingIntent(R.id.slider_knob_active, pendingIntent)
                appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}

