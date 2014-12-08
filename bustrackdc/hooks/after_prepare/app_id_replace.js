#!/usr/bin/env node

// this plugin replaces arbitrary text in arbitrary files
//

//console.log('start');

var fs = require("fs");
var path = require("path");

var rootdir = process.argv[2];

function replace_string_in_file(filename, to_replace, replace_with) {
    var data = fs.readFileSync(filename, "utf8");

    var result = data.replace(to_replace, replace_with);
    fs.writeFileSync(filename, result, "utf8");
}

function update_app_id(rootdir, platform, configobj) {
    var appId = configobj[platform].app_id,
        stringToReplace = "com.JasonRosenbaum.BusTrackDC";

    if (platform === "android") {

       /*
 replace_string_in_file(path.join(rootdir, "platforms/android/AndroidManifest.xml"), stringToReplace, appId);
        replace_string_in_file(path.join(rootdir, "platforms/android/res/xml/config.xml"), stringToReplace, appId);
*/

    } else if (platform === "ios") {

        replace_string_in_file(path.join(rootdir, "platforms/ios/BusTrackDC/BusTrackDC-Info.plist"), stringToReplace, appId);
        replace_string_in_file(path.join(rootdir, "platforms/ios/BusTrackDC/config.xml"), stringToReplace, appId);

    }
}

if (rootdir) {
    var ourconfigfile = path.join(rootdir, "project.json");
    var configobj = JSON.parse(fs.readFileSync(ourconfigfile, "utf8"));

    // Update each platform's specific configuration/properties files
    update_app_id(rootdir, "android", configobj);
    update_app_id(rootdir, "ios", configobj);
}