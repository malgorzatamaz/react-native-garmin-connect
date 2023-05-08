
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNGarminConnectSpec.h"

@interface GarminConnect : NSObject <NativeGarminConnectSpec>
#else
#import <React/RCTBridgeModule.h>

@interface GarminConnect : NSObject <RCTBridgeModule>
#endif

@end
