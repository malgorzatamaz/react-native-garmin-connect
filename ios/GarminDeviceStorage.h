@interface GarminDeviceStorage : NSObject
+ (void)onDevicesReceivedWithOpen:(NSURL * _Nonnull)url;
+ (void)getDevicesList;
@end
