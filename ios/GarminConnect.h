#import <React/RCTEventEmitter.h>
#import "GarminConnectModule.h"
#import <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import "NativeGarminConnect.h"

@interface GarminConnect : RCTEventEmitter<NativeGarminConnectSpec>
#else
#import <React/RCTBridgeModule.h>
@interface GarminConnect : RCTEventEmitter<RCTBridgeModule>
#endif
@property (strong, nonatomic) GarminConnectModule *garminConnect;
@end
