#import "ConnectIQ.h"
#import "React/RCTEventEmitter.h"

@interface GarminConnectModule : NSObject <IQAppMessageDelegate, IQDeviceEventDelegate>
- (void)setEventEmitterWithEventEmitter:(RCTEventEmitter * _Nonnull)eventEmitter;
- (void)initGarminSDKWithUrlScheme:(NSString * _Nonnull)urlScheme;
- (void)showDevicesList;
- (void)getDevicesList:(RCTPromiseResolveBlock _Nonnull )resolve
                reject:(RCTPromiseRejectBlock _Nonnull )reject;
- (void)connectDevice:(NSString * _Nonnull)id model:(NSString * _Nonnull)model name:(NSString * _Nonnull)name;
- (void)sendMessage:(NSString * _Nonnull)message;
- (void)deviceStatusChanged:(IQDevice * _Null_unspecified)device status:(IQDeviceStatus)status;
- (void)receivedMessage:(id _Null_unspecified)messages fromApp:(IQApp * _Null_unspecified)app;
- (void)destroy;
@end
