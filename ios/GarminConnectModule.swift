import Foundation
import SwiftUI
import Combine
import ConnectIQ
import Foundation

@objc(GarminConnectModule)
public class GarminConnectModule: NSObject, IQDeviceEventDelegate, IQAppMessageDelegate {
    private let watchAppUuid = UUID(uuidString: AppConstants.APP_ID)
    private var connectedApp: IQApp? = nil
    
    private var emitter: RCTEventEmitter!

    @objc public func setEventEmitter(eventEmitter: RCTEventEmitter){
        self.emitter = eventEmitter
    }
    
    @objc public func initGarminSDK(urlScheme: NSString){
        ConnectIQ.sharedInstance().initialize(withUrlScheme: urlScheme as String, uiOverrideDelegate: nil)
        GarminDeviceStorage.urlScheme = urlScheme as String
        self.onSdkReady()
    }
    
    @objc func destroy(){
        ConnectIQ.sharedInstance().unregister(forAllDeviceEvents: self)
        ConnectIQ.sharedInstance().unregister(forAllAppMessages: self)
    }

      
    @objc public func showDevicesList(){
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            ConnectIQ.sharedInstance().showDeviceSelection()
        }
    }
    
    @objc public func getDevicesList(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        GarminDeviceStorage.getDevicesList(resolve, reject: reject)
    }

    @objc(connectDevice:model:name:)
    public func connectDevice(id: String, model: String, name: String) {
        let device = IQDevice.init(id: UUID(uuidString: id), modelName: model, friendlyName: name)
        ConnectIQ.sharedInstance().register(forDeviceEvents: device, delegate: self)
    }

    @objc public func sendMessage(_ message: String) {
        if let currentApp = connectedApp {
            ConnectIQ.sharedInstance().sendMessage(message, to: currentApp, progress: nil, completion: nil)
        }
    }
    
    func getStatus(status: IQDeviceStatus) -> String {
        switch status {
            case .connected:
                return "CONNECTED"
            case .notConnected:
                return "ONLINE"
        case .bluetoothNotReady, .invalidDevice, .notFound:
                return "OFFLINE"
        }
    }

    public func deviceStatusChanged(_ device: IQDevice!, status: IQDeviceStatus) {
        self.onDeviceStatusChanged(device, status: getStatus(status: status))
        switch status {
            case .connected:
                connectedApp = IQApp(uuid: watchAppUuid, store: nil, device: device)
                ConnectIQ.sharedInstance().register(forAppMessages: connectedApp, delegate: self)
            case .bluetoothNotReady, .invalidDevice, .notFound, .notConnected:
                ConnectIQ.sharedInstance().unregister(forAppMessages: connectedApp, delegate: self)
                connectedApp = nil
        }
    }

    public func receivedMessage(_ messages: Any!, from app: IQApp!) {
        if let messagesArray = messages as? [NSMutableDictionary] {
            for message in messagesArray {
                self.onMessage(body: message)
            }
        }
        else if let message = messages as? NSMutableDictionary {
            print("Received message from ConnectIQ: \(message)")
                // just one message
            self.onMessage(body: message)
        }
     }
    
    func onSdkReady() {
        self.emitter.sendEvent(withName: "onSdkReady", body: true)
    }

    func onMessage(body: NSMutableDictionary) {
        let message: NSMutableDictionary = [:]
        message["type"] = body[AppConstants.KEY_MESSAGE_TYPE]
        let payload = body[AppConstants.KEY_MESSAGE_PAYLOAD]
        
        let payloadData = try? JSONSerialization.data(withJSONObject: payload!, options: [])
        if let unwrappedPayloadData = payloadData {
            let payloadString = String(data: unwrappedPayloadData, encoding: String.Encoding.ascii)!
            message["payload"] = payloadString;
        }
        
        self.emitter.sendEvent(withName: "onMessage", body: message)
    }

    func onError(error: NSString) {
        self.emitter.sendEvent(withName: "onError", body: error)
    }


    func onDeviceStatusChanged(_ device: IQDevice, status: String) {
        let deviceObject: NSMutableDictionary = [:]
        deviceObject["name"] = device.friendlyName
        deviceObject["status"] = status
        self.emitter.sendEvent(withName: "onDeviceStatusChanged", body: deviceObject)
    }
}
