## Description
Purpose of this package is to allow communication between Garmin Device and React Native app. It requires custom Garmin app to send messages that can be received by React Native app.

Check out my presentation at RN EU 2023

https://www.youtube.com/watch?v=CRQOkie6Ej8

## Installation

```sh
npm install react-native-garmin-connect
```

or

```sh
yarn add react-native-garmin-connect
```

## Getting started

### SDK initalization

First, initialize Garmin SDK using `initGarminSDK` function.

Url schema is required for ios in order to get devices list from Garmin Connect.

```sh
initGarminSDK("YOUR_CUSTOM_URL_SCHEMA")
```

Remember to cleanup it on app closing with `destroy`.

### Getting your devices

To work with Garmin SDK, it's required to have Garmin Connect installed. It gets data about devices from Garmin's mobile app.

#### Android
To get list of devices attached to your account, simply call:

```sh
showDevicesList()
```

#### iOS
When working with iOS there is an inconvinience, to get devices list, you need to get it through url schema. Requesting data is done with: 

```sh
showDevicesList()
```

They it follows the same pattern as Android.

```sh
showDevicesList()
```

### Connecting to the device
Due to another iOS limitation, when connecting to device, function requires to pass it's id, model and name.

```sh
connectDevice(id, model, name)
```

### Sending message (not tested by author)
Sending message from mobile app to Garmin device is done with:

```sh
sendMessage(message)
```

### Handling events
To interact with SDK, certain events are being send:
`onSdkReady` - send after SDK initialization
`onMessage` - send when received message from Garmin device
`onError` - send when SDK encounters error
`onInfo` - send when SDK finds that Garmin Connect app is not installed

Way to handle them is to define event emitter:

```sh
import { Platform, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import { GarminConnect } from 'react-native-garmin-connect';

const emitter = useMemo(() => {
  if (Platform.OS === 'ios') {
    return new NativeEventEmitter(GarminConnect);
  }
  return DeviceEventEmitter;
}, []);

 emitter.addListener('onSdkReady', yourFunction);
```

## New architecture
New architecture is supported for both platforms.

## Docs
Docs can be found [here](https://malgorzatamaz.github.io/react-native-garmin-connect/).

## Example
Example app can be found in [example](https://github.com/malgorzatamaz/react-native-garmin-connect/tree/main/example) it works with [Garmin app](https://github.com/malgorzatamaz/conering-bank-angle).

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
