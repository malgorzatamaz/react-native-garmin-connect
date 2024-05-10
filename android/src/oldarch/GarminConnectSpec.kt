package com.garminconnect

import androidx.annotation.Nullable
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

abstract class GarminConnectSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun initGarminSDK(urlParam?: String)
  abstract fun destroy()
  abstract fun showDevicesList()
  abstract fun getDevicesList(urlParam?: String, promise: Promise)
  abstract fun connectDevice(id: String, model: String, name: String, promise: Promise)
  abstract fun sendMessage(message: String)
}
