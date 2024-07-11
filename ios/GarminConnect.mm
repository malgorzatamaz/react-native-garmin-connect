#import "GarminConnect.h"
#import "GarminConnectModule.h"
#import <React/RCTBridgeModule.h>
//#import <react_native_garmin_connect-Swift.h>

@implementation GarminConnect

RCT_EXPORT_MODULE()

- (instancetype)init
{
    self = [super init];
    self.garminConnect = [[GarminConnectModule alloc] init];
    [self.garminConnect setEventEmitterWithEventEmitter:self];
    
    return self;
}

- (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(getDevicesList:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [self.garminConnect getDevicesList:resolve reject:reject];
}

RCT_EXPORT_METHOD(connectDevice:(NSString *)id model:(NSString *)model name:(NSString *)name) {
    [self.garminConnect connectDevice:id model:model name:name];
}

RCT_EXPORT_METHOD(initGarminSDK:(NSString *)urlParam) {
    [self.garminConnect initGarminSDKWithUrlScheme:urlParam];
}

RCT_EXPORT_METHOD(sendMessage:(NSString *)message) {
    [self.garminConnect sendMessage:message];
}

RCT_EXPORT_METHOD(destroy) {
    [self.garminConnect destroy];
}

RCT_EXPORT_METHOD(showDevicesList) { 
    [self.garminConnect showDevicesList];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onSdkReady", @"onMessage", @"onError", @"onInfo", @"onDeviceStatusChanged"];
}

 // Don't compile this code when we build for the old architecture.
 #ifdef RCT_NEW_ARCH_ENABLED
 - (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
     (const facebook::react::ObjCTurboModule::InitParams &)params
 {
     return std::make_shared<facebook::react::NativeGarminConnectSpecJSI>(params);
 }
 #endif



@end
