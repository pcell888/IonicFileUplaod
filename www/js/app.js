// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'angularFileUpload'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .controller('UploadCtrl', function ($scope, $http, $timeout, $upload) {

        $scope.upload = [];
        $scope.fileUploadObj = { testString1: "Test string 1", testString2: "Test string 2" };

        $scope.onFileSelect = function ($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                (function (index) {
                    $scope.upload[index] = $upload.upload({
                        url: "https://microsoft-apiapp55759bba47b74474bffa45d9538d840b.azurewebsites.net/api/files/upload", // webapi url
                        method: "POST",
                        data: { fileUploadObj: $scope.fileUploadObj },
                        file: $file
                    }).progress(function (evt) {
                        // get upload percentage
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        // file is uploaded successfully
                        console.log('Success');
                        console.log(data);
                    }).error(function (data, status, headers, config) {
                        // file failed to upload
                        console.log('Failure');
                        console.log(data);
                    });
                })(i);
            }
        }

        $scope.abortUpload = function (index) {
            $scope.upload[index].abort();
        }
    })


    .controller('DownloadController', function ($scope, $http, $timeout, $upload) {

        $scope.download = function () {
            debugger;
            // $http({
            //     method: 'GET',
            //     url: 'https://microsoft-apiapp55759bba47b74474bffa45d9538d840b.azurewebsites.net/api/download',
            //     headers: {
            //         //'Accept': 'audio/mpeg',
            //         'Accept': 'application/json',
            //        // 'Content-Disposition': 'attachment; filename=foo.mp3'
            //     },
            //     responseType: 'arraybuffer'
            // }).then(function (data, status, headers, config) {
            //     var blob = new Blob([data], { type: "audio/mpeg" });
            //     var objectUrl = URL.createObjectURL(blob);
            //     console.log('Success' + objectUrl);
            //     window.open(objectUrl);
            // }, function (error) {
            //     console.log(error);
            // });
            
            
            $http({
                method: 'get',
                responseType: 'arraybuffer',
                //url: 'https://microsoft-apiapp55759bba47b74474bffa45d9538d840b.azurewebsites.net/api/download'
                url: "https://ringblob.blob.core.windows.net/ringtones/MyTone%20-16.%20The%20Weeknd%20-%20Can't%20Feel%20My%20Face.mp3",
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                console.log(response);

                var blob = new Blob([response.data], {
                    type: 'application/json'
                });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(blob);
                var anchor = document.createElement("a");
                anchor.download = "MyTone -16. The Weeknd - Can't Feel My Face.mp3";
                anchor.href = blobURL;
                anchor.click();
                // when the response is available
            }, function errorCallback(response) {
                console.log(response);
     
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
            
            
            //window.location.href = 'https://microsoft-apiapp55759bba47b74474bffa45d9538d840b.azurewebsites.net/api/download';
            //$http({ method: 'GET', url: 'https://microsoft-apiapp55759bba47b74474bffa45d9538d840b.azurewebsites.net/api/download' }).success(function (data, status, headers, config) {
            //    //var anchor = angular.element('<a/>');
            //    //anchor.attr({
            //    //    href: 'data:attachment/mp3;charset=utf-8,' + encodeURI(data),
            //    //    target: '_blank',
            //    //    download: 'filename.mp3'
            //    //})[0].click();

            //}).error(function (data, status, headers, config) {
            //    // if there's an error you should see it here
            //    console.log(data);
            //});



            //window.location.href = 'https://microsoft-apiapp55759bba47b74474bffa45d9538d840b.azurewebsites.net/api/download';
            //$http({
            //    method: 'POST',
            //    url: 'https://microsoft-apiapp55759bba47b74474bffa45d9538d840b.azurewebsites.net/api/download'
            //}).then(function successCallback(response) {
            //    console.log(response)
            //    // this callback will be called asynchronously
            //    // when the response is available
            //}, function errorCallback(response) {
            //    // called asynchronously if an error occurs
            //    // or server returns response with an error status.
            //});
        }
    });