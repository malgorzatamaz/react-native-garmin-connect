package com.garminconnect

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.garmin.android.connectiq.ConnectIQ
import com.garmin.android.connectiq.ConnectIQ.*
import com.garmin.android.connectiq.IQApp
import com.garmin.android.connectiq.IQDevice
import com.garmin.android.connectiq.exception.InvalidStateException
import com.garmin.android.connectiq.exception.ServiceUnavailableException
import com.garminconnect.AppConstants.STATUS_OFFLINE
import com.garminconnect.AppConstants.STATUS_ONLINE
import com.google.gson.Gson

class GarminConnectModule internal constructor(reactContext: ReactApplicationContext) :
  GarminConnectSpec(reactContext),
  ConnectIQListener, IQApplicationEventListener,
  IQApplicationInfoListener, IQDeviceEventListener {
  companion object {
    const val NAME = "GarminConnect"
    var sdkReady = false;
    var connectIQ: ConnectIQ? = null;
    var connectedDevice: IQDevice? = null;
    var myApp: IQApp? = null;
  }

  override fun getName(): String {
    return NAME
  }

  fun getContext(): Context? {
    return this.currentActivity?.applicationContext
  }

  @ReactMethod
  override fun initGarminSDK(urlName: String?) {
    myApp = IQApp(AppConstants.APP_ID);
    connectIQ = ConnectIQ.getInstance(getContext(), IQConnectType.WIRELESS);
    connectIQ?.initialize(getContext(), false, this);
  }

  @ReactMethod
  override fun destroy() {
    if (connectIQ != null) {
      disconnectDevice()
      connectIQ?.unregisterAllForEvents();
      connectIQ?.shutdown(getContext());
    }
  }

  override fun showDevicesList() {
    throw NotImplementedError("only used on iOS")
  }

  fun onMessage(type: String, payload: String) {
    val message = Arguments.createMap();
    message.putString("type", type);
    message.putString("payload", payload);

    this.reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onMessage", message)
  }

  fun onError(e: String) {
    this.reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onError", e)
  }

  @ReactMethod
  override fun getDevicesList(promise: Promise) {
    val devices: WritableArray = WritableNativeArray()

    try {
      val knownDevices = connectIQ?.knownDevices;
      val connectedDevices = connectIQ?.connectedDevices;

      knownDevices?.forEach { knownDevice ->
        val writableMap = Arguments.createMap()
        val device = connectedDevices?.firstOrNull { connectedDevice ->
          connectedDevice?.friendlyName.equals(knownDevice.friendlyName)
        }
        writableMap.putString("name", knownDevice.friendlyName);
        writableMap.putString(
          "status",
          if (device != null) STATUS_ONLINE else STATUS_OFFLINE
        )
        devices.pushMap(writableMap)
      }
    } catch (e: InvalidStateException) {
      Log.d("error", "ConnectIQ is not in a valid state");
      promise.reject(e);
    } catch (e: ServiceUnavailableException) {
      Log.d("error", "ServiceUnavailableException");
      promise.reject(e);
    }

    promise.resolve(devices);
  }


  private fun disconnectDevice() {
    if (connectedDevice != null && sdkReady) {
      try {
        connectIQ?.unregisterForDeviceEvents(connectedDevice);
        if (myApp != null) {
          connectIQ?.unregisterForApplicationEvents(connectedDevice, myApp);
        }
      } catch (e: InvalidStateException) {
        Log.d("error", "ConnectIQ is not in a valid state");
      }
    }
  }


  @ReactMethod
  override fun connectDevice(id: String?, model: String?, name: String?) {
    val TAG = "connectDevice";

    if (name != null && sdkReady) {
      val connectIQdevice =
        connectIQ?.knownDevices?.first { device ->
          device.friendlyName.equals(name)
        }

      // Register for device status updates
      try {
        connectIQ?.registerForDeviceEvents(connectIQdevice, this)
      } catch (e: InvalidStateException) {
        Log.d(TAG, "InvalidStateException:  We should not be here!")
      }

      // Register to receive messages from the device
      try {
        connectIQ?.registerForAppEvents(connectIQdevice, myApp, this)
      } catch (e: InvalidStateException) {
        Log.d(TAG, "ConnectIQ is not in a valid state. " + e.message)
      }
    }
  }

  @ReactMethod
  override fun sendMessage(message: String) {
    val TAG = "sendMessage"
    try {
      try {
        connectIQ?.sendMessage(
          connectedDevice, myApp, message
        ) { iqDevice: IQDevice, iqApp: IQApp, iqMessageStatus: IQMessageStatus ->
          run {
            Log.e(TAG, "status: " + iqMessageStatus.name);
          }
        };
      } catch (e: InvalidStateException) {
        Log.e(TAG, "ConnectIQ is not in a valid state");
      } catch (e: ServiceUnavailableException) {
        Log.e(
          TAG,
          "ConnectIQ service is unavailable.   Is Garmin Connect Mobile installed and running?"
        );
      }
    } catch (e: Exception) {
      Log.e(TAG, "this isn't good");
    }
  }

  override fun addListener(eventType: String?) {
    throw NotImplementedError("only used on iOS")
  }

  override fun removeListeners(count: Double) {
    throw NotImplementedError("only used on iOS")
  }

  override fun onMessageReceived(
    device: IQDevice?,
    app: IQApp?,
    message: MutableList<Any>?,
    status: IQMessageStatus?
  ) {
    if (message != null && message.size > 0) {
      for (m: Any in message) {
        try {
          val payload = (m as HashMap<String, Any>)[AppConstants.KEY_MESSAGE_PAYLOAD]
          val type = (m as HashMap<String, String>)[AppConstants.KEY_MESSAGE_TYPE]
          val payloadStr = Gson().toJson(payload).toString()
          if (type !== null && payload !== null) {
            onMessage(type, payloadStr)
          }
        } catch (e: Exception) {
          onError(e.toString())
        }
      }
    } else {
      Log.e("onMessage", "Received an empty message from the application");
    }
  }

  override fun onSdkReady() {
    sdkReady = true;
    this.reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onSdkReady", true)
  }

  override fun onInitializeError(error: IQSdkErrorStatus?) {
    sdkReady = false;
    onError(error.toString())
  }

  override fun onSdkShutDown() {
    sdkReady = false;
    this.reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onSdkReady", false)
  }

  override fun onApplicationInfoReceived(info: IQApp?) {
  }

  override fun onApplicationNotInstalled(info: String?) {
    //Garmin Connect not installed
    this.reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onInfo", "Garmin Connect app is required.")
  }

  override fun onDeviceStatusChanged(device: IQDevice?, status: IQDevice.IQDeviceStatus?) {
    if (device != null && device?.friendlyName != null) {
      val writableMap = Arguments.createMap()
      writableMap.putString("name", device?.friendlyName!!);
      writableMap.putString("status", status.toString());

      this.reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("onDeviceStatusChanged", writableMap)
    }
  }
}
