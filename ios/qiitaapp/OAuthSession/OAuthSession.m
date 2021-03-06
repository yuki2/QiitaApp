#import "OAuthSession.h"

@import SafariServices;

@interface OAuthSession()

@property (nonatomic) SFAuthenticationSession *session;

@end

@implementation OAuthSession
RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(start:(NSDictionary *)args resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *url = args[@"url"];
  NSString *schema = args[@"schema"];
//  NSString *state = args[@"schema"];
  
  self.session = [[SFAuthenticationSession alloc] initWithURL:[NSURL URLWithString:url] callbackURLScheme:schema completionHandler:^(NSURL * _Nullable callbackURL, NSError * _Nullable error) {
    if(error != nil) {
      reject([NSString stringWithFormat:@"%ld", error.code], error.description, error);
      return;
    }
    
    NSURLComponents *callbackURLComponents = [[NSURLComponents alloc] initWithURL:callbackURL resolvingAgainstBaseURL:YES];
//    if(![self checkState:callbackURLComponents state:state]) {
//      reject(@"401", @"Unauthorized state", nil);
//      return;
//    }
    resolve(@{@"code": [self extractCode:callbackURLComponents]});
  }];
  
  if(!self.session.start){
    reject(@"400", @"Cannot start session", nil);
  }
}

- (BOOL)checkState:(NSURLComponents *)components state:(NSString *)state
{
  for (NSURLQueryItem *queryItem in components.queryItems) {
    if ([queryItem.name isEqualToString:@"state"] && [queryItem.value isEqualToString:state]) {
      return YES;
    }
  }
  return NO;
}

- (NSString *)extractCode:(NSURLComponents *)components
{
  for (NSURLQueryItem *queryItem in components.queryItems) {
    if ([queryItem.name isEqualToString:@"code"]) {
      return queryItem.value;
    }
  }
  return @"";
}

@end
