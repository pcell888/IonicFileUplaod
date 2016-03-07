del RingtoneZZ.apk

call cordova build --release android

# call keytool -genkey -v -keystore my-release-key.keystore -alias RingtoneZZ -keyalg RSA -keysize 2048 -validity 10000

call jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore D:\Development\WorkingFolder\IonicFileUplaod\platforms\android\build\outputs\apk\android-release-unsigned.apk RingtoneZZ

call zipalign -v 4 D:\Development\WorkingFolder\IonicFileUplaod\platforms\android\build\outputs\apk\android-release-unsigned.apk RingtoneZZ.apk