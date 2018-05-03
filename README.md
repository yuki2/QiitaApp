# qiitaapp
Qiita Viewer - React Native

### What's included
| Name             | Description   |
| :-------------:|--------------|
| [React Native](https://github.com/facebook/react-native/) |  Build Native Mobile Apps using JavaScript and React. |
| [React-Navigation](https://github.com/react-navigation/react-navigation) | Routing and navigation for React Native apps. |
| [Redux](https://github.com/reactjs/react-redux) | Predictable state container for JavaScript apps.  |
| [Redux-Saga](https://github.com/redux-saga/redux-saga) | Middleware for Redux. | 

### Installation

Clone this repo

```sh
$ git clone git@github.com:yuki2/qiitaapp.git
$ cd qiitaapp
$ npm install
```

Create `.env` file in your root directory and add the following

```sh
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
SCHEMA=your_defined_schema
```

Change intent-filter schema at android/app/AndroidManifest.xml
```sh
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="your_defined_schema" />
</intent-filter>
```

For the above parameters, you need to set up [here](https://qiita.com/settings/applications) 

### How to start
```sh
$ react-native run-android
$ react-native run-ios
```
