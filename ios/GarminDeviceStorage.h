@interface GarminDeviceStorage : NSObject
+ (void)onDevicesReceivedWithOpen:(NSURL * _Nonnull)url;
+ (void)getDevicesList:(RCTPromiseResolveBlock _Nonnull )resolve
                reject:(RCTPromiseRejectBlock _Nonnull )reject;
@end
