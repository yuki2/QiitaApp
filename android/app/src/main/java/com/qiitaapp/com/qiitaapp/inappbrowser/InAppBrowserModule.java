package com.qiitaapp.com.qiitaapp.inappbrowser;

import android.app.Activity;
import android.net.Uri;
import android.support.customtabs.CustomTabsIntent;
import android.support.v4.content.ContextCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.qiitaapp.R;

public class InAppBrowserModule extends ReactContextBaseJavaModule {

  public InAppBrowserModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "InAppBrowser";
  }

  @ReactMethod
  public void show(String url, Promise promise) {
    Activity activity = getCurrentActivity();
    final CustomTabsIntent tabsIntent = new CustomTabsIntent.Builder()
            .setShowTitle(true)
            .setToolbarColor(ContextCompat.getColor(activity, R.color.primary))
            .build();
    Uri uri = Uri.parse(url);
    tabsIntent.launchUrl(activity, uri);
    promise.resolve(true);
  }

}
