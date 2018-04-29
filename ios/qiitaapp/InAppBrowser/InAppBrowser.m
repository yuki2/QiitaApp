#import "InAppBrowser.h"

#import <React/RCTUtils.h>

@import SafariServices;

@implementation InAppBrowser

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(show:(NSString *)url resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (url == nil || url.length == 0) {
    reject(@"400", @"You must specify a url.", nil);
    return;
  }
  
  UIViewController *ctrl = RCTPresentedViewController();
  SFSafariViewController *safariCtrl = [[SFSafariViewController alloc]initWithURL: [NSURL URLWithString:url]];
  [ctrl presentViewController:safariCtrl animated:YES completion:nil];
  
  resolve(@YES);
}

@end
