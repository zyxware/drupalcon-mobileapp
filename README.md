# drupalcon-neworleans2016

## Synopsis

Mobile application built for DrupalCon New Orleans 2016. This application uses Conference Organizing Distribution (COD) to pull the conference details.

This app can be used to work along with any website built on Drupal COD. 

The companion module at COD end to generate the data required for the app in JSON is available at

https://www.drupal.org/project/cod_mobile

## App Functionlities

Main Features of this app are

1. Complete session listing based on various filter critirea - Tracks, Rooms, Speakers and Date.
2. Speaker and session details.
3. Bookmark the favourite sessions and speakers.
4. Filter by sesssion and speaker title.
5. Offline mode.
6. User Authenitication: Registered used os the synchronized site can login to the app via the same credential as that of site.
7. Rate and review the session: Authenticated users can rate and review the sessions. This ratings and reviews will be synchronized with the website, when the app is online.
   
## APP Data Storage

The app will be intialized and will be updated with data stored in the JSON file. This json file path can be changed in service.js

## config.xml Changes

Change the id in  <widget>

## How to customize App

1. Create a new folder with a proper name under arachive folder and Move the current current custom folder to that, for future reference
2. Change css styles in custom/css/ionic.app.css
3. Place the background images and icons in the custom/img folder. Use the same name and extensions.
4. Change spalsh screens and icons on app into "resources/"
5. Change the JSON file in  json/ folder.

## App Usage

using ionic:-

1. Clone the repository
2. Add platform "cordova platform add android"
3. Enter the Command for getting the dependencies "bower install"
4. Install the follwing pluggins:
    cordova plugin add ionic-plugin-keyboard
    cordova plugin add cordova-plugin-splashscreen
    cordova plugin add cordova-plugin-file
    cordova plugin add cordova-plugin-file-transfer
    cordova plugin add https://github.com/litehelpers/Cordova-sqlite-storage.git
    cordova plugin add cordova-plugin-network-information
    cordova plugin add cordova-plugin-device
    cordova plugin add cordova-plugin-inappbrowser
    cordova plugin add cordova-plugin-device-orientation
    ionic plugin add https://github.com/apache/cordova-plugin-whitelist.git


  using phonegap:-

  1.Clone the repository
  2.Add xmlns:gap="http://cordova.apache.org/ns/1.0" in config.xml <widget>
  3Add to config.xml file pluggins :-
    <gap:plugin name="com.ionic.keyboard" spec="1.0.3" source="pgb"/>
    <gap:plugin name="br.com.paveisitemas.splashscreen" spec="2.1.1" source="pgb"/>
    <gap:plugin name="com.surfernetwork.fileplugin" spec="1.0.2" source="pgb" />
    <gap:plugin name="com.chanthu.evri.gcs-file-transfer" spec="1.0.0" source="pgb" />
    <gap:plugin name="com.millerjames01.sqlite-plugin" spec="1.0.1" source="pgb"/>
    <gap:plugin name="com.butterflyeffect.plugins" spec="0.1.1" source="pgb"/>
    <gap:plugin name="org.apache.cordova.network-information" spec="0.2.12" source="pgb" />
    <gap:plugin name="it.adacto.cordova.device" spec="0.1" source="pgb" />
    <gap:plugin name="org.apache.cordova.inappbrowser" />
    <gap:plugin name="org.apache.cordova.device-orientation" />

## Code Structure
  resources/
    android/
      icon/           // Android app icons          
      splash/         // Android app splash screens        
    ios/
      icon/           // ios app icons          
      splash/         // ios app splash screens
 archive/               // Old conference themes
    newOrleans/         //newOrleans conference themes
      data/
        sessions.json   //old conference sessions file
      themes/
        css/            //css files     
        img/            // old app used images and icons
        resources/      //splash screens and icons
 www/
    custom/
      css/
        ionic.app.css     //This is the User customized classes and styles
        ionic.app.min.css // Ionic styles and classes
      img/
        Logo_purple.png   //Application home page logo
        avatar.png        //Speaker image is empty then select this image as default
        room.png          //Home page Rooms icon
        sessions.png      //Home page Sessions icon
        speakers.png      //Home page Speakers icon
        Tracks.png        //Home page Tracks icon
        Start_BG_screen_without_logo.jpg //Home page background image
    js/
      app.js            // Main functions of the App such as .run,.config,.filter
      config.js         // Manage database and its tables
      controllers.js    // Define all page controllers and its functionalities
      services.js       // Define all Services and factories ;- ajaxService, sessionService ,dataService, syncDataBase
    json/
      sessions.json     //Server data file in json format it is SYNCHRONOUS in to local database
    lib/                //Angular,ionic and cordova files.Enter the Command for getting the dependencies "bower install"    
    templates/
      about.html
      about-app.html
      detail.html
      favourites.html
      filters.html
      home.html
      Login_model.html
      menu.html
      rooms.html
      schedules.html
      sessiondetail.html
      sessions.html
      speakers.html
      speakerDetail.html
      tracks.html

## Build Generation

using ionic:-

1. install android sdk on System
2. cordova platform add android
3. ionic build android

Using phonegap;-

1. Login to https://build.phonegap.com
2. Compress the App files
3. Upload into the phonegap server
4. Produce the Android apk file then download
