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

RCT_EXPORT_METHOD(show:(NSDictionary *)args resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *url = args[@"url"];
  NSString *clientId = args[@"clientId"];
  NSArray *scopes = args[@"scopes"];
  NSString *state = args[@"state"];
  NSString *schema = args[@"schema"];
  
  NSString *scope = [scopes componentsJoinedByString:@" "];
  NSArray *queryItems = @[
                          [NSURLQueryItem queryItemWithName:@"client_id" value:clientId],
                          [NSURLQueryItem queryItemWithName:@"state" value:state],
                          [NSURLQueryItem queryItemWithName:@"scope" value:scope]];
  NSURLComponents *components = [[NSURLComponents alloc] initWithString:url];
  components.queryItems = queryItems;
  
  self.session = [[SFAuthenticationSession alloc] initWithURL:[components URL] callbackURLScheme:schema completionHandler:^(NSURL * _Nullable callbackURL, NSError * _Nullable error) {
    if(error != nil) {
      reject([NSString stringWithFormat:@"%ld", error.code], error.description, error);
      return;
    }
    resolve(callbackURL.absoluteString);
  }];
  
  if(!self.session.start){
    reject(@"400", @"Cannot start session", nil);
  }
}

@end
