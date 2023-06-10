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
import com.google.gson.Gson

class GarminConnectModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ConnectIQListener, IQApplicationEventListener,
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
  fun init() {
    myApp = IQApp(AppConstants.APP_ID);
    connectIQ = ConnectIQ.getInstance(getContext(), IQConnectType.WIRELESS);
    connectIQ?.initialize(getContext(), false, this);
  }

  @ReactMethod
  fun destroy() {
    if (connectIQ != null) {
      disconnectDevice()
      connectIQ?.unregisterAllForEvents();
      connectIQ?.shutdown(getContext());
    }
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
  fun getKnownDeviceList(promise: Promise) {
    val devices: WritableArray = WritableNativeArray()
    try {
      val knownDevices = connectIQ?.knownDevices;
      if (knownDevices != null && knownDevices.isNotEmpty()) {
        knownDevices.forEach {
          devices.pushString(it.friendlyName)
        }
      }
    } catch (e: InvalidStateException) {
      Log.d("error", "ConnectIQ is not in a valid state");
      promise.reject(e);
      // This generally means you forgot to call initialize(), but since
      // we are in the callback for initialize(), this should never happen
    } catch (e: ServiceUnavailableException) {
      Log.d("error", "ServiceUnavailableException");
      promise.reject(e);
      // This will happen if for some reason your app was not able to connect
      // to the ConnectIQ service running within Garmin Connect Mobile.  This
      // could be because Garmin Connect Mobile is not installed or needs to
      // be upgraded.
    }

    promise.resolve(devices);
  }

  @ReactMethod
  fun getConnectedDeviceList(promise: Promise) {
    val devices: WritableArray = WritableNativeArray()

    try {
      val connectedDevices = connectIQ?.connectedDevices;
      if (connectedDevices != null && connectedDevices.isNotEmpty()) {

        connectedDevices.forEach {
          devices.pushString(it.friendlyName)
        }
      }
    } catch (e: InvalidStateException) {
      Log.d("error", "ConnectIQ is not in a valid state");
      promise.reject(e);
      // This generally means you forgot to call initialize(), but since
      // we are in the callback for initialize(), this should never happen
    } catch (e: ServiceUnavailableException) {
      promise.reject(e);
      Log.d("error", "ServiceUnavailableException");
      // This will happen if for some reason your app was not able to connect
      // to the ConnectIQ service running within Garmin Connect Mobile.  This
      // could be because Garmin Connect Mobile is not installed or needs to
      // be upgraded.
    }
    promise.resolve(devices)
  }

  private fun disconnectDevice() {
    if (connectedDevice != null && sdkReady) {
      // It is a good idea to unregister everything and shut things down to
      // release resources and prevent unwanted callbacks.
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
  fun sendMessage(messageObject: WritableMap) {
    val TAG = "sendMessage"
    try {
      Log.d(TAG, messageObject.toString())
      try {
        connectIQ?.sendMessage(
          connectedDevice, myApp, messageObject
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

  @ReactMethod
  fun connectDevice(deviceName: String, promise: Promise) {
    val TAG = "connectDevice";
    var registerdForDeviceEvents = false;
    var registerdForApplicationInfo = false;
    var registerForAppEvents = false;

    if (deviceName != null && sdkReady) {
      val connectIQdevice =
        connectIQ?.knownDevices?.first { device -> device.friendlyName.equals(deviceName) }

      // Register for device status updates
      try {
        connectIQ?.registerForDeviceEvents(connectIQdevice, this)
        registerdForDeviceEvents = true;
      } catch (e: InvalidStateException) {
        Log.d(TAG, "InvalidStateException:  We should not be here!")
        promise.reject(e)
      }

      // Register for application status updates
      try {
        connectIQ?.getApplicationInfo(AppConstants.APP_ID, connectIQdevice, this)
        registerdForApplicationInfo = true;
      } catch (e1: InvalidStateException) {
        Log.d(TAG, "e1: " + e1.message)
        promise.reject(e1)
      } catch (e2: ServiceUnavailableException) {
        Log.d(TAG, "e2: " + e2.message)
        promise.reject(e2)
      }

      // Register to receive messages from the device
      try {
        connectIQ?.registerForAppEvents(connectIQdevice, myApp, this)
        registerForAppEvents = true;
      } catch (e: InvalidStateException) {
        Log.d(TAG, "ConnectIQ is not in a valid state. " + e.message)
        promise.reject(e)
      }
    }

    if (registerForAppEvents && registerdForDeviceEvents && registerdForApplicationInfo) promise.resolve(
      null
    )
    else promise.reject(Exception("Not connected to every events"))
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
            val payload = (m as HashMap<String,Any>)[AppConstants.KEY_MESSAGE_PAYLOAD]
            val type = (m as HashMap<String,String>)[AppConstants.KEY_MESSAGE_TYPE]
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
    //Garmin Connect installed
    this.reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onInfo", info.toString())
  }

  override fun onApplicationNotInstalled(info: String?) {
    //Garmin Connect not installed
    this.reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onInfo", info.toString())
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
