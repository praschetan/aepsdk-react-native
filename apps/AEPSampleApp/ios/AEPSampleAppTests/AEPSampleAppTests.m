/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import <React/RCTLog.h>
#import <React/RCTRootView.h>

#define TIMEOUT_SECONDS 600
#define TEXT_TO_LOOK_FOR @"Welcome to React"

@interface AEPSampleAppTests : XCTestCase

@end

@implementation AEPSampleAppTests

- (BOOL)findSubviewInView:(UIView *)view matching:(BOOL(^)(UIView *view))test
{
  if (test(view)) {
    return YES;
  }
  for (UIView *subview in [view subviews]) {
    if ([self findSubviewInView:subview matching:test]) {
      return YES;
    }
  }
  return NO;
}

- (void)testRendersWelcomeScreen
{
  UIViewController *vc = [[[RCTSharedApplication() delegate] window] rootViewController];
  NSDate *date = [NSDate dateWithTimeIntervalSinceNow:TIMEOUT_SECONDS];
  BOOL foundElement = NO;

  __block NSString *redboxError = nil;
#ifdef DEBUG
  RCTSetLogFunction(^(RCTLogLevel level, RCTLogSource source, NSString *fileName, NSNumber *lineNumber, NSString *message) {
    if (level >= RCTLogLevelError) {
      redboxError = message;
    }
  });
#endif

  while ([date timeIntervalSinceNow] > 0 && !foundElement && !redboxError) {
    [[NSRunLoop mainRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate dateWithTimeIntervalSinceNow:0.1]];
    [[NSRunLoop mainRunLoop] runMode:NSRunLoopCommonModes beforeDate:[NSDate dateWithTimeIntervalSinceNow:0.1]];

    foundElement = [self findSubviewInView:vc.view matching:^BOOL(UIView *view) {
      if ([view.accessibilityLabel isEqualToString:TEXT_TO_LOOK_FOR]) {
        return YES;
      }
      return NO;
    }];
  }

#ifdef DEBUG
  RCTSetLogFunction(RCTDefaultLogFunction);
#endif

  XCTAssertNil(redboxError, @"RedBox error: %@", redboxError);
  XCTAssertTrue(foundElement, @"Couldn't find element with text '%@' in %d seconds", TEXT_TO_LOOK_FOR, TIMEOUT_SECONDS);
}


@end
