#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
//#import "GarminConnect-Swift.h"

@interface RCT_EXTERN_MODULE(GarminConnect, RCTEventEmitter)
    RCT_EXTERN_METHOD(initialize:(NSString)urlParam)
    RCT_EXTERN_METHOD(destroy)
    RCT_EXTERN_METHOD(showDevicesList)
    RCT_EXTERN_METHOD(getDevicesList:(RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject);
    RCT_EXTERN_METHOD(connectDevice:(NSString)id
                  model:(NSString)model
                  name:(NSString)name);
@end

// // Don't compile this code when we build for the old architecture.
// #ifdef RCT_NEW_ARCH_ENABLED
// - (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
//    (const facebook::react::ObjCTurboModule::InitParams &)params
// {
//    return std::make_shared<facebook::react::NativeGarminConnectSpecJSI>(params);
// }
// #endif


