
import Foundation

@objc(GarminDeviceStorage)
public class GarminDeviceStorage: NSObject {
    static var urlScheme = ""
    static var devicesListKey = "devicesListKey"
    
    @objc
    public static func onDevicesReceived(open url: URL){

        if (url.scheme == urlScheme){
            let devices = ConnectIQ.sharedInstance()?.parseDeviceSelectionResponse(from: url) as? [IQDevice]
            var devicesToSet: [Data] = []
            
            if let unwrappedDevices = devices {
                for device in unwrappedDevices {
                    let garminDevice = GarminDevice(id: device.uuid.uuidString, model: device.modelName, name: device.friendlyName)
                    let result = try? JSONEncoder().encode(garminDevice)
                    if let unwrappedDevice = result {
                        devicesToSet.append(unwrappedDevice)
                    }
                }
            }

            UserDefaults.standard.set(devicesToSet, forKey: devicesListKey)
        }
    }
    
    static func getDevicesList(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        let result = UserDefaults.standard.object(forKey: self.devicesListKey)
        let devicesList: NSMutableArray = []
        
        if let devices: [Data] = result as? [Data] {
            for device in devices {
                let decoded = try? JSONDecoder().decode(GarminDevice.self, from: device)
                if let unwrappedDevice = decoded {
                    let deviceObject: NSMutableDictionary = [:]
                    deviceObject["id"] = unwrappedDevice.id
                    deviceObject["name"] = unwrappedDevice.name
                    deviceObject["model"] = unwrappedDevice.model
                    deviceObject["status"] = "ONLINE"
                    devicesList.add(deviceObject)
                }
            }
        }

        resolve(devicesList);
    }
}
