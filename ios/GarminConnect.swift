import Foundation
import SwiftUI
import Combine
import ConnectIQ
import Foundation


@objc(GarminConnect)
public class GarminConnect: RCTEventEmitter, IQDeviceEventDelegate, IQAppMessageDelegate {
    private let watchAppUuid = UUID(uuidString: AppConstants.APP_ID)
    private var connectedApp: IQApp? = nil

      override init() {
          super.init()
      }

    
    @objc func initialize(_ urlScheme: String){
        ConnectIQ.sharedInstance().initialize(withUrlScheme: urlScheme, uiOverrideDelegate: nil)
        GarminDeviceStorage.urlScheme = urlScheme
        self.onSdkReady()
    }
    
    @objc
    public override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc func destroy(){
        ConnectIQ.sharedInstance().unregister(forAllDeviceEvents: self)
        ConnectIQ.sharedInstance().unregister(forAllAppMessages: self)
    }

      
    @objc func showDevicesList(){
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            ConnectIQ.sharedInstance().showDeviceSelection()
        }
    }
    
    @objc(getDevicesList:rejecter:)
    func getDevicesList(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        GarminDeviceStorage.getDevicesList(resolve, rejecter: reject)
    }

    @objc(connectDevice:model:name:)
    func connectDevice(id: String, model: String, name: String) {
        let device = IQDevice.init(id: UUID(uuidString: id), modelName: model, friendlyName: name)
        ConnectIQ.sharedInstance().register(forDeviceEvents: device, delegate: self)
    }

    @objc func sendMessage(_ message: String) {
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
        self.sendEvent(withName: "onSdkReady", body: true)
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
        
        self.sendEvent(withName: "onMessage", body: message)
    }

    func onError(error: NSString) {
        self.sendEvent(withName: "onError", body: error)
    }

    func onInfo(info: NSString) {
        self.sendEvent(withName: "onInfo", body: info)
    }

    func onDeviceStatusChanged(_ device: IQDevice, status: String) {
        let deviceObject: NSMutableDictionary = [:]
        deviceObject["name"] = device.friendlyName
        deviceObject["status"] = status
        self.sendEvent(withName: "onDeviceStatusChanged", body: deviceObject)
    }

    open override func supportedEvents() -> [String] {
        ["onSdkReady", "onMessage", "onError", "onInfo", "onDeviceStatusChanged"]
    }
}
