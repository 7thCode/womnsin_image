/**
 AccountControllers.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */
/// <reference path="../../../typings/tsd.d.ts" />
/**
 0 - ok
 1 - rights
 2 - auth
 3 - user already found
 10 - db
 20 - session
 100 - auth

 Init
 Accepted
 Done

 */
'use strict';
var _this = this;
var controllers = angular.module('AccountControllers', ["ngMaterial", "ngResource", 'ngMessages', 'ngMdIcons', 'ngAnimate', 'flow']);
controllers.value('Global', {
    socket: null
});
controllers.value("CurrentPatient", {
    'id': ""
});
controllers.value("CurrentView", {
    'Page': 0,
    'Data': {}
});
controllers.value("CurrentAccount", {
    'username': "",
    'type': ""
});
controllers.value("CurrentQuery", {
    'query': {}
});
controllers.factory('ViewItem', ['$resource',
    function ($resource) {
        return $resource('/view', {}, {});
    }]);
controllers.factory('Login', ['$resource',
    function ($resource) {
        return $resource('/account/login', {}, {
            login: { method: 'POST' }
        });
    }]);
controllers.factory('Logout', ['$resource',
    function ($resource) {
        return $resource('/account/logout', {}, {
            logout: { method: 'POST' }
        });
    }]);
controllers.factory('AccountQuery', ['$resource',
    function ($resource) {
        return $resource('/account/query/:query', { query: '@query' }, {
            query: { method: 'GET' }
        });
    }]);
controllers.factory('Account', ['$resource',
    function ($resource) {
        return $resource('/account/:id', {}, {
            get: { method: 'GET' },
            update: { method: 'PUT' },
            remove: { method: 'DELETE' }
        });
    }]);
controllers.factory('AccountPassword', ['$resource',
    function ($resource) {
        return $resource('/account/password/:id', {}, {
            update: { method: 'PUT' }
        });
    }]);
controllers.factory('AccountCreate', ['$resource',
    function ($resource) {
        return $resource('/account/create', {}, {});
    }]);
controllers.factory('PatientAccept', ['$resource',
    function ($resource) {
        return $resource('/patient/accept', {}, {});
    }]);
controllers.factory('PatientQuery', ['$resource',
    function ($resource) {
        return $resource('/patient/query/:query', { query: '@query' }, {
            query: { method: 'GET' }
        });
    }]);
controllers.factory('PatientCount', ['$resource',
    function ($resource) {
        return $resource('/patient/count/:query', { query: '@query' }, {
            query: { method: 'GET' }
        });
    }]);
controllers.factory('Patient', ['$resource',
    function ($resource) {
        return $resource('/patient/:id', {}, {
            update: { method: 'PUT' },
            remove: { method: 'DELETE' }
        });
    }]);
controllers.factory('PatientStatus', ['$resource',
    function ($resource) {
        return $resource('/patient/status/:id', {}, {
            update: { method: 'PUT' }
        });
    }]);
controllers.factory('PatientInformation', ['$resource',
    function ($resource) {
        return $resource('/patient/information/:id', {}, {
            update: { method: 'PUT' }
        });
    }]);
controllers.factory('ViewCreate', ['$resource',
    function ($resource) {
        return $resource('/view/create', {}, {});
    }]);
controllers.factory('View', ['$resource',
    function ($resource) {
        return $resource('/view/:id', {}, {
            update: { method: 'PUT' },
            remove: { method: 'DELETE' }
        });
    }]);
controllers.factory('ViewQuery', ['$resource',
    function ($resource) {
        return $resource('/view/query/:query', { query: '@query' }, {
            query: { method: 'GET' }
        });
    }]);
controllers.factory('Config', ['$resource',
    function ($resource) {
        return $resource('/config', {}, {
            update: { method: 'PUT' }
        });
    }]);
controllers.factory('File', ['$resource',
    function ($resource) {
        return $resource('/file/:name', { name: '@name' }, {
            send: { method: 'POST' },
            update: { method: 'PUT' }
        });
    }]);
controllers.factory('FileQuery', ['$resource',
    function ($resource) {
        return $resource('/file/query/:query', { query: '@query' }, {
            query: { method: 'GET' }
        });
    }]);
controllers.factory('Pdf', ['$resource',
    function ($resource) {
        return $resource('/pdf/:id', {}, {});
    }]);
function TodayQuery() {
    var today = new Date();
    today.setHours(23, 59, 59, 99);
    var yesterday = new Date();
    yesterday.setHours(0, 0, 0, 1);
    return { $and: [{ Date: { $lte: today } }, { Date: { $gt: yesterday } }] };
}
function PatientsList(resource, query, success) {
    resource.query({ query: encodeURIComponent(JSON.stringify(query)) }, function (data, headers) {
        if (data) {
            if (data.code === 0) {
                success(data.value, headers);
            }
        }
    });
}
function List(resource, query, success) {
    resource.query({ query: encodeURIComponent(JSON.stringify(query)) }, function (data) {
        if (data) {
            if (data.code === 0) {
                success(data.value);
            }
        }
    });
}
/*! Controllers  */
controllers.controller("StartController", ["$scope", "$state", 'CurrentAccount',
    function ($scope, $state, CurrentAccount) {
        if (CurrentAccount.username !== "") {
            $scope.username = CurrentAccount.username;
            $scope.type = CurrentAccount.type;
        }
        else {
            $state.go('start');
        }
    }]);
controllers.controller("ApplicationController", ["$scope", "$rootScope", '$state', "$mdDialog", '$mdToast', "$mdSidenav", '$mdUtil', 'Login', 'Logout', 'CurrentAccount', 'Global',
    function ($scope, $rootScope, $state, $mdDialog, $mdToast, $mdSidenav, $mdUtil, Login, Logout, CurrentAccount, Global) {
        $scope.goBack = function () {
            window.history.back();
        };
        $scope.goTop = function () {
            $state.go('start');
        };
        $scope.goConfig = function () {
            $state.go('controlles');
        };
        $scope.goEdit = function () {
            $state.go('departments');
        };
        $scope.goPatient = function () {
            $scope.mode = "Patient";
            $state.go('patients');
        };
        $scope.goAccount = function () {
            $scope.mode = "Account";
            $state.go('accounts');
        };
        $scope.open = buildToggler();
        function buildToggler() {
            return $mdUtil.debounce(function () {
                $mdSidenav('nav').toggle().then(function () {
                });
            }, 300);
            //   return debounceFn;
        }
        $scope.close = function () {
            $mdSidenav('nav').close().then(function () {
            });
        };
        $scope.showLoginDialog = function () {
            $mdDialog.show({
                controller: 'LoginDialogController',
                templateUrl: '/backend/partials/account/logindialog',
                targetEvent: null
            }).then(function (account) {
                CurrentAccount.username = account.value.username;
                CurrentAccount.type = account.value.type;
                $scope.username = account.value.username;
                $scope.type = account.value.type;
                localStorage.setItem("account", JSON.stringify(CurrentAccount));
                $rootScope.$broadcast('Login');
            }, function () {
            });
        };
        $scope.Logout = function () {
            var account = new Logout();
            account.$logout(function (account) {
                if (account) {
                    if (account.code === 0) {
                        CurrentAccount.username = "";
                        CurrentAccount.type = "";
                        $scope.username = "";
                        $scope.type = "";
                        localStorage.removeItem("account");
                        $rootScope.$broadcast('Logout');
                        $state.go('start');
                    }
                    else {
                        $mdToast.show($mdToast.simple().content(account.message));
                    }
                }
                else {
                    $mdToast.show($mdToast.simple().content("network error(logout)"));
                }
            });
        };
        if (Global.socket === null) {
            Global.socket = io.connect();
        }
        if (localStorage.getItem("account") !== null) {
            var account = JSON.parse(localStorage.getItem("account"));
            CurrentAccount.username = account.username;
            CurrentAccount.type = account.type;
        }
        else {
            $scope.showLoginDialog();
        }
        $scope.username = CurrentAccount.username;
        $scope.type = CurrentAccount.type;
        $scope.mode = "Account";
    }]);
controllers.controller('PatientsController', ['$scope', '$state', '$stateParams', '$q', "$mdDialog", '$mdBottomSheet', '$mdToast', 'Patient', 'PatientAccept', 'PatientQuery', 'CurrentQuery', 'PatientCount', 'CurrentAccount', 'CurrentPatient', 'Global',
    function ($scope, $state, $stateParams, $q, $mdDialog, $mdBottomSheet, $mdToast, Patient, PatientAccept, PatientQuery, CurrentQuery, PatientCount, CurrentAccount, CurrentPatient, Global) {
        if (CurrentAccount.username !== "") {
            $scope.username = CurrentAccount.username;
            $scope.type = CurrentAccount.type;
            CurrentQuery.query = TodayQuery();
            $scope.progress = true;
            PatientsList(PatientQuery, CurrentQuery.query, function (data) {
                $scope.patients = data;
                $scope.progress = false;
            });
            $scope.showPatientDescription = function (id) {
                CurrentPatient.id = id;
                $stateParams.id = id;
                $state.go('description', { id: id });
            };
            $scope.icon = "vertical_align_top";
            $scope.showSheet = function ($event) {
                $scope.icon = "vertical_align_bottom";
                $mdBottomSheet.show({
                    templateUrl: '/backend/partials/patient/sheet',
                    controller: 'PatientSheetControl',
                    targetEvent: $event
                }).then(function (clickedItem) {
                    $scope.icon = "vertical_align_top";
                }, function () {
                    $scope.icon = "vertical_align_top";
                });
            };
            $scope.showPatientAcceptDialog = function (id) {
                PatientCount.query({ query: encodeURIComponent(JSON.stringify(CurrentQuery.query)) }, function (data) {
                    if (data) {
                        if (data.code === 0) {
                            var items = { count: 0 };
                            items.count = data.value;
                            $mdDialog.show({
                                controller: 'PatientAcceptDialogController',
                                templateUrl: '/backend/partials/patient/patientacceptdialog',
                                targetEvent: id,
                                locals: {
                                    items: items
                                }
                            }).then(function (answer) {
                                var patient = new PatientAccept();
                                patient.Input = {};
                                patient.Information = { name: "", time: "", kana: "", insurance: "", patientid: "", birthday: "", gender: "" };
                                patient.Information.name = answer.items.name;
                                var now = new Date();
                                var hour = ("0" + now.getHours()).slice(-2); // 時
                                var min = ("0" + now.getMinutes()).slice(-2); // 分
                                var sec = ("0" + now.getSeconds()).slice(-2); // 秒
                                patient.Information.time = hour + ':' + min + ':' + sec;
                                patient.Information.birthday = answer.items.birthday.toDateString();
                                patient.Information.gender = answer.items.gender;
                                answer.items.kana = answer.items.kana.replace(/[ぁ-ん]/g, function (s) {
                                    return String.fromCharCode(s.charCodeAt(0) + 0x60);
                                });
                                patient.Information.kana = answer.items.kana;
                                patient.Information.insurance = answer.items.insurance;
                                patient.Category = answer.items.category;
                                patient.Sequential = items.count;
                                $scope.progress = true;
                                patient.$save({}, function (result) {
                                    if (result) {
                                        if (result.code === 0) {
                                            PatientsList(PatientQuery, CurrentQuery.query, function (data) {
                                                $scope.progress = false;
                                                Global.socket.emit('server', { value: "1" });
                                                $scope.patients = data;
                                            });
                                        }
                                        else {
                                            $mdToast.show($mdToast.simple().content(result.message));
                                        }
                                    }
                                    else {
                                        $mdToast.show($mdToast.simple().content("network error(save)"));
                                    }
                                });
                            }, function () {
                            });
                        }
                    }
                });
            };
            $scope.querySearch = function (query) {
                var deferred = $q.defer();
                PatientQuery.query({ query: encodeURIComponent(CurrentQuery.query) }, function (data) {
                    //     PatientQuery.query({query: encodeURIComponent(JSON.stringify({$and: [query, {"Information.name": {$regex: querystring}}]}))}, (data:any):void => {
                    deferred.resolve(data.value);
                });
                return deferred.promise;
            };
            $scope.searchTextChange = function (text) {
                if (text != "") {
                    CurrentQuery.query = { "Information.name": { $regex: text } };
                }
                else {
                    CurrentQuery.query = TodayQuery();
                }
                PatientsList(PatientQuery, CurrentQuery.query, function (data) {
                    $scope.patients = data;
                    $scope.progress = false;
                });
            };
            $scope.selectedItemChange = function (item) {
                if (item != "") {
                    CurrentQuery.query = { "Information.name": { $regex: item } };
                }
                else {
                    CurrentQuery.query = TodayQuery();
                }
                PatientsList(PatientQuery, CurrentQuery.query, function (data) {
                    $scope.patients = data;
                    $scope.progress = false;
                });
            };
            $scope.$on('Login', function () {
                $scope.progress = true;
                PatientsList(PatientQuery, CurrentQuery.query, function (data) {
                    $scope.patients = data;
                    $scope.progress = false;
                });
            });
            $scope.$on('Logout', function () {
                CurrentAccount.username = "";
                CurrentAccount.type = "";
                $scope.patients = [];
            });
            $scope.$on('Update', function () {
                $scope.progress = true;
                PatientsList(PatientQuery, CurrentQuery.query, function (data) {
                    $scope.patients = data;
                    $scope.progress = false;
                });
            });
            Global.socket.on('client', function (data) {
                if (data.value === "1") {
                    $scope.progress = true;
                    PatientsList(PatientQuery, CurrentQuery.query, function (data) {
                        $scope.patients = data;
                        $scope.progress = false;
                    });
                }
            });
            $scope.showTotalSheet = function ($event) {
                $scope.icon = "vertical_align_bottom";
                $mdBottomSheet.show({
                    templateUrl: '/backend/partials/patient/totalsheet',
                    controller: 'PatientTotalSheetControl',
                    targetEvent: $event
                }).then(function (clickedItem) {
                    $scope.icon = "vertical_align_top";
                }, function () {
                    $scope.icon = "vertical_align_top";
                });
            };
        }
        else {
            $state.go('start');
        }
    }]);
controllers.controller('DescriptionController', ['$scope', '$mdBottomSheet', '$mdToast', 'Patient', 'PatientStatus', 'PatientInformation', 'CurrentAccount', 'CurrentPatient', 'Pdf', 'Global',
    function ($scope, $mdBottomSheet, $mdToast, Patient, PatientStatus, PatientInformation, CurrentAccount, CurrentPatient, Pdf, Global) {
        if (CurrentPatient) {
            $scope.selectedIndex = 0;
            $scope.load = function () {
                var patient = new Patient();
                patient.$get({ id: CurrentPatient.id }, function (data) {
                    if (data) {
                        if (data.code === 0) {
                            $scope.Input = [];
                            _.each(data.value.Input, function (value, index, array) {
                                if (value.type === "picture") {
                                    var canvas = new fabric.Canvas('schema-' + value.name);
                                    canvas.loadFromJSON(JSON.stringify(value.value), canvas.renderAll.bind(canvas), function (o, object) {
                                    });
                                }
                                $scope.Input.push(value);
                            });
                            var d = new Date();
                            d.setTime(Date.parse(data.value.Information.birthday));
                            $scope.birthday = d;
                            $scope.Information = data.value.Information;
                        }
                        else {
                            $mdToast.show($mdToast.simple().content(data.message));
                        }
                    }
                    else {
                        $mdToast.show($mdToast.simple().content('network error(patient)'));
                    }
                });
            };
            var patient = new PatientStatus();
            patient.$get({ id: CurrentPatient.id }, function (result) {
                if (result) {
                    if (result.code === 0) {
                        $scope.IsDone = (result.value === "Done");
                    }
                    else {
                        $mdToast.show($mdToast.simple().content(result.message));
                    }
                }
                else {
                    $mdToast.show($mdToast.simple().content("network error(status)"));
                }
            });
            $scope.icon = "vertical_align_top";
            $scope.showSheet = function ($event) {
                $scope.icon = "vertical_align_bottom";
                $mdBottomSheet.show({
                    templateUrl: '/backend/partials/patient/sheet',
                    controller: 'PatientSheetControl',
                    targetEvent: $event
                }).then(function (clickedItem) {
                    $scope.icon = "vertical_align_top";
                }, function () {
                    $scope.icon = "vertical_align_top";
                });
            };
            $scope.setPatientID = function () {
                var patientinformation = new PatientInformation();
                patientinformation.name = $scope.Information.name;
                patientinformation.time = $scope.Information.time;
                patientinformation.kana = $scope.Information.kana;
                patientinformation.insurance = $scope.Information.insurance;
                patientinformation.patientid = $scope.Information.patientid;
                patientinformation.birthday = $scope.birthday.toDateString(); //  $scope.Information.birthday;
                patientinformation.gender = $scope.Information.gender;
                patientinformation.$update({ id: CurrentPatient.id }, function (result) {
                    $mdToast.show($mdToast.simple().content("OK."));
                });
            };
            $scope.done = function () {
                var patient = new Patient();
                patient.$remove({ id: CurrentPatient.id }, function (result) {
                    if (result) {
                    }
                    else {
                        $mdToast.show($mdToast.simple().content("network error(patient)"));
                    }
                });
            };
            $scope.download = function (name) {
                var canvas = document.getElementById(name);
                Canvas2Image.saveAsPNG(canvas);
            };
            $scope.$watch('IsDone', function () {
                if ($scope.IsDone !== null) {
                    var patient = new PatientStatus();
                    patient.$get({ id: CurrentPatient.id }, function (result) {
                        if (result) {
                            if (result.code === 0) {
                                if ($scope.IsDone === true) {
                                    if (result.value !== "Done") {
                                        patient.Status = "Done";
                                        patient.$update({ id: CurrentPatient.id }, function (result) {
                                            if (result) {
                                                if (result.code === 0) {
                                                    Global.socket.emit('server', { value: "1" });
                                                }
                                                else {
                                                    $mdToast.show($mdToast.simple().content(result.message));
                                                }
                                            }
                                            else {
                                                $mdToast.show($mdToast.simple().content("network error(status)"));
                                            }
                                        });
                                    }
                                }
                                else {
                                    if (result.value !== "Accepted") {
                                        patient.Status = "Accepted";
                                        patient.$update({ id: CurrentPatient.id }, function (result) {
                                            if (result) {
                                                if (result.code === 0) {
                                                    Global.socket.emit('server', { value: "1" });
                                                }
                                                else {
                                                    $mdToast.show($mdToast.simple().content(result.message));
                                                }
                                            }
                                            else {
                                                $mdToast.show($mdToast.simple().content("network error(login)"));
                                            }
                                        });
                                    }
                                }
                            }
                            else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        }
                        else {
                            $mdToast.show($mdToast.simple().content("network error(login)"));
                        }
                    });
                }
            });
        }
    }]);
controllers.controller('AccountsController', ['$scope', '$state', "$mdDialog", '$mdToast', 'Account', 'AccountQuery', 'AccountCreate', 'AccountPassword', 'CurrentAccount',
    function ($scope, $state, $mdDialog, $mdToast, Account, AccountQuery, AccountCreate, AccountPassword, CurrentAccount) {
        if (CurrentAccount.username !== "") {
            $scope.username = CurrentAccount.username;
            $scope.type = CurrentAccount.type;
            $scope.progress = true;
            List(AccountQuery, {}, function (data) {
                $scope.progress = false;
                $scope.accounts = data;
            });
            $scope.showRegisterDialog = function () {
                $mdDialog.show({
                    controller: 'RegisterDialogController',
                    templateUrl: '/backend/partials/account/registerdialog',
                    targetEvent: null
                }).then(function (answer) {
                    var account = new AccountCreate();
                    account.username = answer.items.username;
                    account.password = answer.items.password;
                    account.type = answer.items.type;
                    $scope.progress = true;
                    account.$save({}, function (result) {
                        if (result) {
                            if (result.code === 0) {
                                List(AccountQuery, {}, function (data) {
                                    $scope.accounts = data;
                                    $scope.progress = false;
                                });
                            }
                            else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        }
                        else {
                            $mdToast.show($mdToast.simple().content('network error(status)'));
                        }
                    });
                }, function () {
                });
            };
            $scope.showAccountDeleteDialog = function (id) {
                $mdDialog.show({
                    controller: 'AccountDeleteDialogController',
                    templateUrl: '/backend/partials/account/deletedialog',
                    targetEvent: id
                }).then(function (answer) {
                    var account = new Account();
                    $scope.progress = true;
                    account.$remove({ id: id }, function (result) {
                        if (result) {
                            if (result.code === 0) {
                                List(AccountQuery, {}, function (data) {
                                    $scope.accounts = data;
                                    $scope.progress = false;
                                });
                            }
                            else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        }
                        else {
                            $mdToast.show($mdToast.simple().content('network error(status)'));
                        }
                    });
                }, function () {
                });
            };
            $scope.showAccountUpdateDialog = function (id) {
                var account = new Account();
                account.$get({ id: id }, function (data) {
                    if (data) {
                        if (data.code === 0) {
                            $scope.items = data.value;
                            $scope.items.password = "";
                            $mdDialog.show({
                                controller: 'AccountUpdateDialogController',
                                templateUrl: '/backend/partials/account/accountdialog',
                                targetEvent: id,
                                locals: {
                                    items: $scope.items
                                }
                            }).then(function (answer) {
                                switch (answer.a) {
                                    case 1:
                                        {
                                            var account = new AccountPassword();
                                            account.password = answer.items.password;
                                            account.$update({ id: id }, function (result) {
                                                if (result) {
                                                }
                                                else {
                                                    $mdToast.show($mdToast.simple().content('network error(password)'));
                                                }
                                            });
                                            break;
                                        }
                                    case 2:
                                        {
                                            var account = new Account();
                                            account.username = answer.items.username;
                                            account.type = answer.items.type;
                                            $scope.progress = true;
                                            account.$update({ id: id }, function (result) {
                                                if (result) {
                                                    if (result.code === 0) {
                                                        List(AccountQuery, {}, function (data) {
                                                            $scope.accounts = data;
                                                            $scope.progress = false;
                                                        });
                                                    }
                                                    else {
                                                        $mdToast.show($mdToast.simple().content(result.message));
                                                    }
                                                }
                                                else {
                                                    $mdToast.show($mdToast.simple().content('network error(account)'));
                                                }
                                            });
                                            break;
                                        }
                                }
                            }, function () {
                            });
                        }
                        else {
                            $mdToast.show($mdToast.simple().content(data.message));
                        }
                    }
                    else {
                    }
                });
            };
            $scope.$on('Login', function () {
                $scope.progress = true;
                List(AccountQuery, {}, function (data) {
                    $scope.accounts = data;
                    $scope.progress = false;
                });
            });
            $scope.$on('Logout', function () {
                $scope.accounts = [];
            });
            $scope.$on('Update', function () {
                $scope.progress = true;
                List(AccountQuery, {}, function (data) {
                    $scope.accounts = data;
                    $scope.progress = false;
                });
            });
        }
        else {
            $state.go('start');
        }
    }]);
controllers.controller('DepartmentsController', ['$scope', '$state', "$mdDialog", "$mdToast", "CurrentView", "ViewCreate", "View", "ViewQuery",
    function ($scope, $state, $mdDialog, $mdToast, CurrentView, ViewCreate, View, ViewQuery) {
        $scope.progress = true;
        List(ViewQuery, {}, function (data) {
            $scope.Departments = data;
            $scope.progress = false;
        });
        $scope.back = function () {
            window.history.back();
        };
        $scope.showDepartmentCreateDialog = function () {
            $mdDialog.show({
                controller: 'DepartmentCreateDialogController',
                templateUrl: '/backend/partials/edit/departmentcreatedialog',
                targetEvent: null
            }).then(function (answer) {
                var view = new ViewCreate();
                view.Name = answer.items.department;
                view.$save({}, function (result) {
                    if (result) {
                        if (result.code === 0) {
                            $scope.progress = true;
                            List(ViewQuery, {}, function (data) {
                                $scope.Departments = data;
                                $scope.progress = false;
                            });
                        }
                        else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    }
                    else {
                        $mdToast.show($mdToast.simple().content("network error(save)"));
                    }
                });
            }, function () {
            });
        };
        $scope.showDepartmentCopyDialog = function (id) {
            var view = new View();
            view.$get({ id: id }, function (data) {
                $mdDialog.show({
                    controller: 'DepartmentCopyDialogController',
                    templateUrl: '/backend/partials/edit/departmentcopydialog',
                    targetEvent: null,
                    locals: {
                        items: view
                    }
                }).then(function (answer) {
                    var view = new ViewCreate();
                    view.Pages = data.value.Pages;
                    view.Name = answer.items.department;
                    view.$save({}, function (result) {
                        if (result) {
                            if (result.code === 0) {
                                $scope.progress = true;
                                List(ViewQuery, {}, function (data) {
                                    $scope.Departments = data;
                                    $scope.progress = false;
                                });
                            }
                            else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        }
                        else {
                            $mdToast.show($mdToast.simple().content("network error(save)"));
                        }
                    });
                }, function () {
                });
            });
        };
        $scope.DepartmentUpdate = function (id) {
            var view = new View();
            view.$get({ id: id }, function (data) {
                CurrentView.Data = data.value;
                $scope.Pages = CurrentView.Data.Pages;
                $state.go('department');
            });
        };
        $scope.showDepartmentDeleteDialog = function (id) {
            $mdDialog.show({
                controller: 'DepartmentDeleteDialogController',
                templateUrl: '/backend/partials/edit/departmentdeletedialog',
                targetEvent: id
            }).then(function (answer) {
                var view = new View();
                $scope.progress = true;
                view.$remove({ id: id }, function (result) {
                    if (result) {
                        if (result.code === 0) {
                            $scope.progress = true;
                            List(ViewQuery, {}, function (data) {
                                $scope.Departments = data;
                                $scope.progress = false;
                            });
                        }
                        else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    }
                    else {
                        $mdToast.show($mdToast.simple().content("network error(save)"));
                    }
                });
            }, function () {
            });
        };
    }]);
controllers.controller('DepartmentEditController', ['$scope', '$state', '$mdDialog', "$mdToast", "CurrentView", "View",
    function ($scope, $state, $mdDialog, $mdToast, CurrentView, View) {
        if (CurrentView.Data) {
            $scope.Title = CurrentView.Data.Name;
            $scope.Pages = CurrentView.Data.Pages;
            $scope.back = function () {
                window.history.back();
            };
            $scope.up = function (index) {
                if (index > 0) {
                    var control = CurrentView.Data.Pages[index];
                    CurrentView.Data.Pages[index] = CurrentView.Data.Pages[index - 1];
                    CurrentView.Data.Pages[index - 1] = control;
                }
            };
            $scope.down = function (index) {
                if (index < CurrentView.Data.Pages.length - 1) {
                    var control = CurrentView.Data.Pages[index];
                    CurrentView.Data.Pages[index] = CurrentView.Data.Pages[index + 1];
                    CurrentView.Data.Pages[index + 1] = control;
                }
            };
            $scope.DepartmentUpdate = function () {
                var view = new View();
                view.Name = CurrentView.Data.Name;
                view.Pages = CurrentView.Data.Pages;
                view.$update({ id: CurrentView.Data._id }, function (result) {
                    if (result) {
                        if (result.code === 0) {
                        }
                        else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    }
                    else {
                        $mdToast.show($mdToast.simple().content('network error(account)'));
                    }
                });
            };
            $scope.showPageCreateDialog = function () {
                $mdDialog.show({
                    controller: 'PageCreateDialogController',
                    templateUrl: '/backend/partials/edit/pagecreatedialog',
                    targetEvent: null
                }).then(function (answer) {
                    var name = answer.items.title;
                    var page = {
                        headline: name,
                        items: [],
                        picture: []
                    };
                    if (!CurrentView.Data.Pages) {
                        CurrentView.Data.Pages = [];
                    }
                    CurrentView.Data.Pages.push(page);
                    $scope.Pages = CurrentView.Data.Pages;
                }, function () {
                });
            };
            $scope.PageUpdate = function (index) {
                CurrentView.Page = index;
                $state.go('page');
            };
            $scope.showPageDeleteDialog = function (index) {
                $mdDialog.show({
                    controller: 'PageDeleteDialogController',
                    templateUrl: '/backend/partials/edit/pagedeletedialog',
                    targetEvent: index
                }).then(function (answer) {
                    CurrentView.Data.Pages[index] = null;
                    CurrentView.Data.Pages = _.compact(CurrentView.Data.Pages);
                    $scope.Pages = CurrentView.Data.Pages;
                }, function () {
                });
            };
        }
        else {
            $state.go('departments');
        }
    }]);
controllers.controller('PageEditController', ['$scope', '$state', '$mdDialog', '$mdToast', "CurrentView", "View",
    function ($scope, $state, $mdDialog, $mdToast, CurrentView, View) {
        if (CurrentView.Data.Pages) {
            $scope.Page = CurrentView.Data.Pages[CurrentView.Page];
            $scope.back = function () {
                window.history.back();
            };
            $scope.up = function (index) {
                if (index > 0) {
                    var control = CurrentView.Data.Pages[CurrentView.Page].items[index];
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = CurrentView.Data.Pages[CurrentView.Page].items[index - 1];
                    CurrentView.Data.Pages[CurrentView.Page].items[index - 1] = control;
                }
            };
            $scope.down = function (index) {
                if (index < CurrentView.Data.Pages[CurrentView.Page].items.length - 1) {
                    var control = CurrentView.Data.Pages[CurrentView.Page].items[index];
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = CurrentView.Data.Pages[CurrentView.Page].items[index + 1];
                    CurrentView.Data.Pages[CurrentView.Page].items[index + 1] = control;
                }
            };
            $scope.DepartmentUpdate = function () {
                var view = new View();
                view.Name = CurrentView.Data.Name;
                view.Pages = CurrentView.Data.Pages;
                view.$update({ id: CurrentView.Data._id }, function (result) {
                    if (result) {
                        if (result.code === 0) {
                        }
                        else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    }
                    else {
                        $mdToast.show($mdToast.simple().content('network error(account)'));
                    }
                });
            };
            $scope.showTextCreateDialog = function () {
                $mdDialog.show({
                    controller: 'TextCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/text/textcreatedialog',
                    targetEvent: null
                }).then(function (answer) {
                    var control = {
                        label: answer.items.label,
                        name: answer.items.name,
                        model: "",
                        type: "text",
                        items: [
                            { name: "required", message: "Required" },
                            { name: "md-maxlength", message: "Max" }
                        ]
                    };
                    CurrentView.Data.Pages[CurrentView.Page].items.push(control);
                }, function () {
                });
            };
            $scope.showCheckCreateDialog = function () {
                $mdDialog.show({
                    controller: 'CheckCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/check/checkcreatedialog',
                    targetEvent: null
                }).then(function (answer) {
                    var control = {
                        label: answer.items.label,
                        name: answer.items.name + "-" + answer.items.label,
                        model: "",
                        type: "check"
                    };
                    CurrentView.Data.Pages[CurrentView.Page].items.push(control);
                }, function () {
                });
            };
            $scope.showSelectCreateDialog = function () {
                $mdDialog.show({
                    controller: 'SelectCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/select/selectcreatedialog',
                    targetEvent: null
                }).then(function (answer) {
                    var control = {
                        label: answer.items.label,
                        name: answer.items.name,
                        model: "",
                        type: "select",
                        items: answer.tags
                    };
                    CurrentView.Data.Pages[CurrentView.Page].items.push(control);
                }, function () {
                });
            };
            $scope.showNumericCreateDialog = function () {
                $mdDialog.show({
                    controller: 'NumericCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/numeric/numericcreatedialog',
                    targetEvent: null
                }).then(function (answer) {
                    var control = {
                        label: answer.items.label,
                        name: answer.items.name,
                        model: "",
                        type: "numeric"
                    };
                    CurrentView.Data.Pages[CurrentView.Page].items.push(control);
                }, function () {
                });
            };
            $scope.showPictureCreateDialog = function () {
                $mdDialog.show({
                    controller: 'PictureCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/picture/picturecreatedialog',
                    targetEvent: null
                }).then(function (answer) {
                    CurrentView.Data.Pages[CurrentView.Page].picture[0] = {
                        height: 600,
                        width: 300,
                        path: answer.items.path,
                        type: "picture",
                        model: "",
                        name: answer.items.name,
                        label: answer.items.label
                    };
                }, function () {
                });
            };
            $scope.showPictureUpdateDialog = function (index) {
                var items = CurrentView.Data.Pages[CurrentView.Page].picture[0];
                $mdDialog.show({
                    controller: 'PictureUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/picture/pictureupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then(function (answer) {
                    var control = {
                        height: 600,
                        width: 300,
                        path: answer.items.path,
                        type: "picture",
                        model: "",
                        name: answer.items.name,
                        label: answer.items.label
                    };
                    CurrentView.Data.Pages[CurrentView.Page].picture[0] = control;
                }, function () {
                });
            };
            $scope.showButtonCreateDialog = function () {
                var items = {
                    type: "button",
                    validate: true,
                    class: "md-accent"
                };
                $mdDialog.show({
                    controller: 'ButtonCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/button/buttoncreatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then(function (answer) {
                    var path = "";
                    if (answer.isPage) {
                        path = "/browse/" + answer.items.page;
                    }
                    else {
                        path = "/write";
                    }
                    var control = {
                        label: answer.items.label,
                        name: answer.items.name,
                        model: "",
                        type: "button",
                        validate: answer.items.validate,
                        path: path,
                        class: answer.items.class
                    };
                    CurrentView.Data.Pages[CurrentView.Page].items.push(control);
                }, function () {
                });
            };
            $scope.showTextUpdateDialog = function (index) {
                var items = CurrentView.Data.Pages[CurrentView.Page].items[index];
                $mdDialog.show({
                    controller: 'TextUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/check/textupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then(function (answer) {
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = answer.items;
                }, function () {
                });
            };
            $scope.showCheckUpdateDialog = function (index) {
                var items = CurrentView.Data.Pages[CurrentView.Page].items[index];
                items.name = items.name.split("-")[0];
                $mdDialog.show({
                    controller: 'CheckUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/check/checkupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then(function (answer) {
                    answer.items.name = answer.items.name + "-" + answer.items.label;
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = answer.items;
                }, function () {
                });
            };
            $scope.showSelectUpdateDialog = function (index) {
                var items = CurrentView.Data.Pages[CurrentView.Page].items[index];
                $mdDialog.show({
                    controller: 'SelectUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/select/selectupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then(function (answer) {
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = answer.items;
                }, function () {
                });
            };
            $scope.showNumericUpdateDialog = function (index) {
                var items = CurrentView.Data.Pages[CurrentView.Page].items[index];
                $mdDialog.show({
                    controller: 'NumericUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/numeric/numericupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then(function (answer) {
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = answer.items;
                }, function () {
                });
            };
            $scope.showButtonUpdateDialog = function (index) {
                var items = CurrentView.Data.Pages[CurrentView.Page].items[index];
                $mdDialog.show({
                    controller: 'ButtonUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/button/buttonupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then(function (answer) {
                    var path = "";
                    if (answer.isPage) {
                        path = "/browse/" + answer.items.page;
                    }
                    else {
                        path = "/write";
                    }
                    answer.items.path = path;
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = answer.items;
                }, function () {
                });
            };
            $scope.showTextDeleteDialog = function (index) {
                $mdDialog.show({
                    controller: 'TextDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/check/textdeletedialog',
                    targetEvent: index
                }).then(function (answer) {
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = null;
                    CurrentView.Data.Pages[CurrentView.Page].items = _.compact(CurrentView.Data.Pages[CurrentView.Page].items);
                }, function () {
                });
            };
            $scope.showCheckDeleteDialog = function (index) {
                $mdDialog.show({
                    controller: 'CheckDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/check/checkdeletedialog',
                    targetEvent: index
                }).then(function (answer) {
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = null;
                    CurrentView.Data.Pages[CurrentView.Page].items = _.compact(CurrentView.Data.Pages[CurrentView.Page].items);
                }, function () {
                });
            };
            $scope.showSelectDeleteDialog = function (index) {
                $mdDialog.show({
                    controller: 'SelectDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/select/selectdeletedialog',
                    targetEvent: index
                }).then(function (answer) {
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = null;
                    CurrentView.Data.Pages[CurrentView.Page].items = _.compact(CurrentView.Data.Pages[CurrentView.Page].items);
                }, function () {
                });
            };
            $scope.showNumericDeleteDialog = function (index) {
                $mdDialog.show({
                    controller: 'NumericDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/numeric/numericdeletedialog',
                    targetEvent: index
                }).then(function (answer) {
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = null;
                    CurrentView.Data.Pages[CurrentView.Page].items = _.compact(CurrentView.Data.Pages[CurrentView.Page].items);
                }, function () {
                });
            };
            $scope.showPictureDeleteDialog = function (index) {
                $mdDialog.show({
                    controller: 'PictureDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/picture/picturedeletedialog',
                    targetEvent: index
                }).then(function (answer) {
                    CurrentView.Data.Pages[CurrentView.Page].picture[0] = null;
                    CurrentView.Data.Pages[CurrentView.Page].picture = _.compact(CurrentView.Data.Pages[CurrentView.Page].picture);
                }, function () {
                });
            };
            $scope.showButtonDeleteDialog = function (index) {
                $mdDialog.show({
                    controller: 'ButtonDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/button/buttondeletedialog',
                    targetEvent: index
                }).then(function (answer) {
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = null;
                    CurrentView.Data.Pages[CurrentView.Page].items = _.compact(CurrentView.Data.Pages[CurrentView.Page].items);
                }, function () {
                });
            };
        }
        else {
            $state.go('departments');
        }
    }]);
controllers.controller('FilesController', ['$scope', 'FileQuery',
    function ($scope, FileQuery) {
        List(FileQuery, {}, function (data) {
            $scope.files = data;
        });
    }]);
/*! Dialogs  */
controllers.controller('ControllpanelController', ['$scope', '$mdToast', '$mdBottomSheet', '$mdDialog', 'Config',
    function ($scope, $mdToast, $mdBottomSheet, $mdDialog, Config) {
        var config = new Config();
        config.$get({}, function (result) {
            if (result) {
                if (result.code === 0) {
                    $scope.config = result.value;
                }
                else {
                    $mdToast.show($mdToast.simple().content(result.message));
                }
            }
            else {
                $mdToast.show($mdToast.simple().content("network error(config)"));
            }
        });
        $scope.showNotificationDialog = function () {
            $mdDialog.show({
                controller: 'NotificationDialogController',
                templateUrl: '/backend/partials/controll/notification',
                targetEvent: ""
            }).then(function (answer) {
                var config = new Config();
                config.body = $scope.config;
                config.$update({}, function (result) {
                    if (result) {
                        if (result.code === 0) {
                        }
                        else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    }
                    else {
                        $mdToast.show($mdToast.simple().content("network error(notification)"));
                    }
                });
            }, function () {
            });
        };
        $scope.icon = "vertical_align_top";
        $scope.showConfigSheet = function ($event) {
            $scope.icon = "vertical_align_bottom";
            $mdBottomSheet.show({
                templateUrl: '/backend/partials/patient/configsheet',
                controller: 'PatientConfigSheetControl',
                targetEvent: $event
            }).then(function (clickedItem) {
                $scope.icon = "vertical_align_top";
            }, function () {
                $scope.icon = "vertical_align_top";
            });
        };
    }]);
controllers.controller('PatientSheetControl', ['$scope', '$mdBottomSheet', '$location', 'CurrentPatient',
    function ($scope, $mdBottomSheet, $location, CurrentPatient) {
        if (CurrentPatient) {
            $scope.items = [
                { name: 'PDF', icon: 'content_copy' }
            ];
            $scope.ItemClick = function ($index) {
                $mdBottomSheet.hide($scope.items[$index]);
                window.open("/pdf/" + CurrentPatient.id, CurrentPatient.name, "location=no");
            };
        }
    }]);
controllers.controller('PatientTotalSheetControl', ['$scope', '$mdBottomSheet', '$location',
    function ($scope, $mdBottomSheet, $location) {
        $scope.items = [];
        $scope.ItemClick = function ($index) {
            $mdBottomSheet.hide($scope.items[$index]);
        };
    }]);
controllers.controller('PatientConfigSheetControl', ['$scope', '$mdBottomSheet', '$location',
    function ($scope, $mdBottomSheet, $location) {
        $scope.items = [];
        $scope.ItemClick = function ($index) {
            $mdBottomSheet.hide($scope.items[$index]);
        };
    }]);
controllers.controller('LoginDialogController', ['$scope', '$q', '$mdDialog', '$mdToast', 'AccountQuery', 'Login',
    function ($scope, $q, $mdDialog, $mdToast, AccountQuery, Login) {
        $scope.querySearch = function (querystring) {
            var deferred = $q.defer();
            AccountQuery.query({ query: encodeURIComponent(JSON.stringify({ "username": { $regex: querystring } })) }, function (data) {
                deferred.resolve(data.value);
            });
            return deferred.promise;
        };
        $scope.searchTextChange = function (text) {
        };
        $scope.selectedItemChange = function (item) {
        };
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (items) {
            var account = new Login();
            account.username = items.username;
            account.password = items.password;
            account.$login(function (account) {
                if (account) {
                    if (account.code === 0) {
                        $mdDialog.hide(account);
                    }
                    else {
                        $mdToast.show($mdToast.simple().content(account.message));
                    }
                }
                else {
                    $mdToast.show($mdToast.simple().content("network error(login)"));
                }
            });
        };
    }]);
controllers.controller('RegisterDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('AccountDeleteDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('AccountUpdateDialogController', ['$scope', '$mdDialog', 'items',
    function ($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.iconsize = "42";
        $scope.onEnter = function () {
            $scope.iconsize = "52";
        };
        $scope.onLeave = function () {
            $scope.iconsize = "42";
        };
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.changePassword = function (answer) {
            $scope.a = 1;
            $mdDialog.hide($scope);
        };
        $scope.answer = function (answer) {
            $scope.a = 2;
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('NotificationDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('PatientAcceptDialogController', ['$scope', '$mdDialog', 'ViewQuery', 'items',
    function ($scope, $mdDialog, ViewQuery, items) {
        $scope.items = items;
        $scope.categories = [];
        $scope.progress = true;
        List(ViewQuery, {}, function (data) {
            _.each(data, function (item, index) {
                $scope.categories.push(item.Name);
            });
            $scope.progress = false;
        });
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('DepartmentCreateDialogController', ['$scope', '$mdDialog', 'ViewQuery',
    function ($scope, $mdDialog, ViewQuery) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('DepartmentCopyDialogController', ['$scope', '$mdDialog', 'ViewQuery', 'items',
    function ($scope, $mdDialog, ViewQuery, items) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('DepartmentDeleteDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('PageCreateDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('PageDeleteDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('TextCreateDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('CheckCreateDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('SelectCreateDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        var self = _this;
        self.tags = [];
        $scope.tags = angular.copy(self.tags);
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('NumericCreateDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('PictureCreateDialogController', ['$scope', '$mdDialog', '$mdToast', 'File', 'FileQuery',
    function ($scope, $mdDialog, $mdToast, File, FileQuery) {
        $scope.items = {};
        List(FileQuery, {}, function (data) {
            $scope.files = data;
        });
        $scope.images = [];
        $scope.processFiles = function (files) {
            var filename = files[0].name;
            List(FileQuery, { filename: filename }, function (data) {
                if (data) {
                    if (data.length == 0) {
                        $scope.items.path = filename;
                        $scope.images[0] = {};
                        var fileReader = new FileReader();
                        var image = new Image();
                        fileReader.onload = function (event) {
                            var uri = event.target.result;
                            image.src = uri;
                            image.onload = function () {
                                var file = new File();
                                file.url = uri;
                                file.$send({ name: $scope.items.path });
                                $scope.$apply();
                            };
                        };
                        fileReader.readAsDataURL(files[0].file);
                    }
                    else {
                        $mdToast.show($mdToast.simple().content("already found."));
                    }
                }
                else {
                    $mdToast.show($mdToast.simple().content("network error(file)"));
                }
            });
        };
        $scope.selectFile = function (filename) {
            $scope.items.path = filename;
        };
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('PictureUpdateDialogController', ['$scope', '$mdDialog', 'File', 'FileQuery', 'items',
    function ($scope, $mdDialog, File, FileQuery, items) {
        $scope.items = items;
        List(FileQuery, {}, function (data) {
            $scope.files = data;
        });
        $scope.images = [];
        $scope.processFiles = function (files) {
            $scope.items.path = files[0].name;
            $scope.images[0] = {};
            var fileReader = new FileReader();
            var image = new Image();
            fileReader.onload = function (event) {
                var uri = event.target.result;
                image.src = uri;
                image.onload = function () {
                    var file = new File();
                    file.url = uri;
                    file.$send({ name: $scope.items.path });
                    $scope.$apply();
                };
            };
            fileReader.readAsDataURL(files[0].file);
        };
        /*
         $scope.processFiles = (files:any):void => {
         $scope.images[0] = {};
         var fileReader = new FileReader();
         var image = new Image();
         fileReader.onload = (event:any):void => {
         var uri = event.target.result;
         image.src = uri;
         image.onload = ():void => {
         var file = new File();
         file.url = uri;
         file.$update({name: $scope.items.path});
         $scope.$apply();
         };
         };
         fileReader.readAsDataURL(files[0].file);
         };

         */
        $scope.selectFile = function (filename) {
            $scope.items.path = filename;
        };
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('ButtonCreateDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('CheckUpdateDialogController', ['$scope', '$mdDialog', 'items',
    function ($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('SelectUpdateDialogController', ['$scope', '$mdDialog', 'items',
    function ($scope, $mdDialog, items) {
        $scope.items = items;
        //  var self = this;
        //  self.tags = [];
        //  $scope.tags = angular.copy(self.tags);
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('NumericUpdateDialogController', ['$scope', '$mdDialog', 'items',
    function ($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('ButtonUpdateDialogController', ['$scope', '$mdDialog', 'items',
    function ($scope, $mdDialog, items) {
        var path = items.path;
        $scope.items = items;
        $scope.isPage = (path != "/write");
        if ($scope.isPage) {
            var elements = path.split("/");
            if (elements.length === 3) {
                $scope.items.page = elements[2];
            }
        }
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('TextDeleteDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('CheckDeleteDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('SelectDeleteDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('NumericDeleteDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('PictureDeleteDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
controllers.controller('ButtonDeleteDialogController', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide($scope);
        };
    }]);
//# sourceMappingURL=AccountControllers.js.map