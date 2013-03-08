#import <Foundation/Foundation.h>
#import "GAI.h"
#import <Cordova/CDV.h>
@interface GoogleAnalyticsPlugin : CDVPlugin  {
}

- (void) trackerWithTrackingId:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) trackEventWithCategory:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) trackView:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end