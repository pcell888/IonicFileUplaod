angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('PlaylistsCtrl', function ($scope, $ionicLoading, Items, $firebaseObject) {
        $scope.playlists = Items;
        $scope.playlists.$loaded()
            .then(function () {
                $scope.showMask = true;
            })
            .catch(function (err) {
                console.error(err);
                $scope.showMask = false;
            });
    })
    .controller('BrowseCtrl', function ($scope, $ionicLoading, $state, $http, $timeout, $upload, $cordovaFileTransfer, $ionicPlatform, $cordovaFileOpener2) {
        $scope.upload = [];

        $scope.fileUploadObj = {
            Name: undefined,
            Number: undefined,
            Email: undefined,
            Comments: undefined
        };

        $scope.uploadfile = function () {
            ionic.trigger('click', { target: document.getElementById('fileUpload') });
        }
        $scope.onFileSelect = function ($files) {
            $scope.file = $files;
        };
        $scope.submitForm = function ($files) {
            $files = $scope.file;
            $ionicLoading.show();
            //$files: an array of files selected, each file has name, size, and type AdminFile.
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                (function (index) {
                    $scope.upload[index] = $upload.upload({
                        url: "https://microsoft-apiapp55759bba47b74474bffa45d9538d840b.azurewebsites.net/api/files", // webapi url
                        method: "POST",
                        data: { fileUploadObj: $scope.fileUploadObj },
                        file: $file
                    }).progress(function (evt) {
                        // get upload percentage
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        // file is uploaded successfully
                        $ionicLoading.hide();
                        console.log('Success');
                        $state.go('app.playlists');
                        $scope.fileUploadObj = "";
                    }).error(function (data, status, headers, config) {
                        // file failed to upload
                        console.log('Failure');
                        $ionicLoading.hide();
                        $state.go('app.playlists');
                    });
                })(i);
            }
        }
        $scope.abortUpload = function (index) {
            $scope.upload[index].abort();
        }
    })

    .controller('CatCtrl', function ($scope, $ionicActionSheet, $http, $location, $state, $stateParams, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, $timeout, $ionicLoading) {
        $scope.categories = [
            { name: 'Bollywood' },
            { name: 'Hollywood' },
            { name: 'Romantic' },
            { name: 'Movie' },
            { name: 'Song' }
        ]
    })
    .controller('PlaylistCtrl', function ($scope, $ionicActionSheet, $http, $location, $state, $stateParams, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, $timeout, $ionicLoading) {
        $scope.tone = $location.path().split("/").pop();
        $scope.isDisable = true;
        $scope.lblDownload = "Download Ringtone";
        $cordovaFile.checkFile(cordova.file.externalDataDirectory, $scope.tone)
            .then(function (success) {
                $scope.isDisable = false;
                $scope.lblDownload = "Play Ringtone";
            }, function (error) {
            });

        $scope.showringmodal = function () {

            $ionicActionSheet.show({
                buttons: [
                    { text: '<i class="icon ion-share"></i> Set RingTone' },
                    { text: '<i class="icon ion-share"></i> Set Notification ' },
                    { text: '<i class="icon ion-share"></i> Set Alarm' },
                ],
                buttonClicked: function (index) {
                    $scope.settone(index);
                    return true;
                }
            });
        };

        $scope.delete = function () {
            debugger;
            $ionicLoading.show();
            $http({
                method: 'DELETE',
                url: "https://microsoft-apiapp55759bba47b74474bffa45d9538d840b.azurewebsites.net/api/tone?name=" + $scope.tone
            }).then(function successCallback(response) {
                $ionicLoading.hide();
                $state.go('app.playlists');
            }, function errorCallback(response) {
                $ionicLoading.hide();
                $state.go('app.playlists');
            });

        }
        $scope.download = function () {
            debugger;
            $ionicLoading.show();
            document.addEventListener('deviceready', function () {

                var url = "https://microsoft-apiapp55759bba47b74474bffa45d9538d840b.azurewebsites.net/api/tone?name=" + $scope.tone;
                var targetPath = cordova.file.externalDataDirectory + $scope.tone;
                var trustHosts = true;
                var options = {};

                $cordovaFile.checkFile(cordova.file.externalDataDirectory, $scope.tone)
                    .then(function (success) {
                        $ionicLoading.hide();
                        $scope.isDisable = false;
                        $scope.lblDownload = "Play Ringtone";
                        $cordovaFileOpener2.open(targetPath, 'audio/mpeg').then(function () { $ionicLoading.hide(); }, function (err) { $ionicLoading.hide(); });
                    }, function (error) {
                        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                            .then(function (result) {
                                $ionicLoading.hide();
                                $scope.isDisable = false;
                                $scope.lblDownload = "Play Ringtone";
                                $cordovaFileOpener2.open(targetPath, 'audio/mpeg').then(function () { $ionicLoading.hide(); }, function (err) { $ionicLoading.hide(); });
                            }, function (err) {
                                console.log('Error');
                                $ionicLoading.hide();

                            }, function (progress) {
                                $timeout(function () {
                                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                                });
                            });
                    });
            }, false);

        }

        $scope.settone = function (index) {
            debugger;
            var targetPath = cordova.file.externalDataDirectory + $scope.tone;
            switch (index) {
                case 1:
                    var self = "Myself", type = "notification";
                    break;
                case 2:
                    var self = "", type = "alarm";
                    break;
                default:
                    var self = null, type = "ringtone";
                    break;
            }
            window.ringtone.setRingtone(targetPath, $scope.tone, self, type, function (success) {
                alert('Your Ringtone has been successfully changed');
            },
                function (err) {
                    alert(err);
                })
        }
    });
