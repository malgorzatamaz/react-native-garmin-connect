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


