
function update {
	plugin=${1}
	echo "Plugin ${1}"
	cordova plugin rm ${1}
	cordova plugin add ${1}
}

update cordova-plugin-device
update cordova-plugin-console
update cordova-plugin-whitelist
update cordova-plugin-splashscreen
update cordova-plugin-statusbar
update cordova-plugin-dialogs
update cordova-plugin-geolocation

