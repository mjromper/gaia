
'use strict';

function log(msg) {
  //dump("-*- Permission.js - " + msg + "\n");
}

let permissionList = ["power", "sms", "contacts", "telephony",
                      "mozBluetooth", "browser", "mozApps",
                      "mobileconnection", "mozFM", "systemXHR",
                      "background", "backgroundservice", "settings",
                      "alarm", "camera",
                      "fmradio", "voicemail",
                      "wifi-manage", "wifi", "geolocation",
                      "webapps-manage", "desktop-notification",
                      "device-storage:pictures", "device-storage:music", "device-storage:videos", "device-storage:apps",
                      "alarms", "alarm", "attention",
                      "content-camera", "camera", "tcp-socket", "bluetooth", "storage", "time", "networkstats-manage",
                      "idle", "network-events", "embed-apps",
                      // Just don't.
                      "deprecated-hwvideo"];

let secMan = Cc["@mozilla.org/scriptsecuritymanager;1"]
               .getService(Ci.nsIScriptSecurityManager)

// This file is generated by build/webapp-manifests.js.
// We need to read it to get the localId of each webapp.
let webapps = getJSON(getFile(PROFILE_DIR, "webapps", "webapps.json"));

Gaia.webapps.forEach(function (webapp) {
  if (!webapps[webapp.domain]) {
    return;
  }

  let manifest = webapp.manifest;
  let rootURL = webapp.url;
  let appId = webapps[webapp.domain].localId;

  let principal = secMan.getAppCodebasePrincipal(Services.io.newURI(rootURL, null, null),
                                                 appId, false);

  let perms = manifest.permissions;
  if (!perms)
    return;

  for each(let name in perms) {
    if (permissionList.indexOf(name) == -1) {
      dump("WARNING: permission unknown:" + name + "\n");
      continue;
    }

    if (name == "storage") {
      Services.perms.addFromPrincipal(principal, "indexedDB-unlimited", Ci.nsIPermissionManager.ALLOW_ACTION);
      Services.perms.addFromPrincipal(principal, "offline-app", Ci.nsIPermissionManager.ALLOW_ACTION);
      Services.perms.addFromPrincipal(principal, "pin-app", Ci.nsIPermissionManager.ALLOW_ACTION);
    } else {
      Services.perms.addFromPrincipal(principal, name, Ci.nsIPermissionManager.ALLOW_ACTION);
    }

    log("name: " + name + "\n");
    log("add permission: " + rootURL + " (" + appId + "), " + name);

    Services.perms.addFromPrincipal(principal, name, Ci.nsIPermissionManager.ALLOW_ACTION);
  }
});
