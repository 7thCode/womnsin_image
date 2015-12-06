/**
 PatientController.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */
/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
var controllers = angular.module('PatientsControllers', ["ngMaterial", "ngResource", 'ngMessages', 'ngMdIcons', 'ngAnimate']);
var Browser = (function () {
    function Browser() {
        this.name = window.navigator.userAgent.toLowerCase();
        this.isIE = (this.name.indexOf('msie') >= 0 || this.name.indexOf('trident') >= 0);
        this.isiPhone = this.name.indexOf('iphone') >= 0;
        this.isiPod = this.name.indexOf('ipod') >= 0;
        this.isiPad = this.name.indexOf('ipad') >= 0;
        this.isiOS = (this.isiPhone || this.isiPod || this.isiPad);
        this.isAndroid = this.name.indexOf('android') >= 0;
        this.isPhone = (this.isiOS || this.isAndroid);
        this.isTablet = (this.isiPad || (this.isAndroid && this.name.indexOf('mobile') < 0));
        if (this.isIE) {
            this.verArray = /(msie|rv:?)\s?([0-9]{1,})([\.0-9]{1,})/.exec(this.name);
            if (this.verArray) {
                this.ver = parseInt(this.verArray[2], 10);
            }
        }
        if (this.isiOS) {
            this.verArray = /(os)\s([0-9]{1,})([\_0-9]{1,})/.exec(this.name);
            if (this.verArray) {
                this.ver = parseInt(this.verArray[2], 10);
            }
        }
        if (this.isAndroid) {
            this.verArray = /(android)\s([0-9]{1,})([\.0-9]{1,})/.exec(this.name);
            if (this.verArray) {
                this.ver = parseInt(this.verArray[2], 10);
            }
        }
    }
    return Browser;
})();
controllers.value('Global', {
    socket: null
});
controllers.value("Views", {
    Data: []
});
controllers.value("CurrentPatient", {
    "Information": {
        "name": "",
        "insurance": ""
    },
    "Status": "",
    "Category": "",
    'Input': {},
    'Sequential': 0
});
function List(resource, query, success) {
    resource.query({ query: encodeURIComponent(JSON.stringify(query)) }, function (data) {
        if (data) {
            if (data.code === 0) {
                success(data.value);
            }
        }
    });
}
// Patient resource
controllers.factory('PatientQuery', ['$resource', function ($resource) {
        return $resource('/patient/query/:query', { query: '@query' }, {
            query: { method: 'GET' }
        });
    }]);
controllers.factory('Patient', ['$resource', function ($resource) {
        return $resource('/patient/:id', {}, {
            update: { method: 'PUT' }
        });
    }]);
controllers.factory('ViewQuery', ['$resource',
    function ($resource) {
        return $resource('/view/query/:query', { query: '@query' }, {
            query: { method: 'GET' }
        });
    }]);
function PatientsList(resource, success) {
    var today = new Date();
    today.setHours(23, 59, 59, 99);
    var yesterday = new Date();
    yesterday.setHours(0, 0, 0, 1);
    var query = { $and: [{ Date: { $lte: today } }, { Date: { $gt: yesterday } }] };
    resource.query({ query: encodeURIComponent(JSON.stringify(query)) }, function (data, headers) {
        if (data != null) {
            if (data.code === 0) {
                success(data.value, headers);
            }
        }
    });
}
controllers.controller('BrowseSController', ["$scope", "$stateParams", "$location", 'Patient', 'PatientQuery', "CurrentPatient", "Global", 'ViewQuery', 'Views',
    function ($scope, $stateParams, $location, Patient, PatientQuery, CurrentPatient, Global, ViewQuery, Views) {
        List(ViewQuery, {}, function (data) {
            PatientsList(PatientQuery, function (patients) {
                $scope.patients = patients;
                Views.Data = data;
            });
        });
        $scope.next = function (id) {
            var resource = new Patient();
            resource.$get({ id: id }, function (data) {
                if (data != null) {
                    if (data.code === 0) {
                        CurrentPatient.id = id;
                        CurrentPatient.Category = data.value.Category;
                        CurrentPatient.Information = data.value.Information;
                        CurrentPatient.Sequential = data.value.Sequential;
                        $scope.Information = CurrentPatient.Information;
                        $scope.Input = CurrentPatient.Input;
                        $scope.Sequential = CurrentPatient.Sequential;
                        $location.path('/browse/0');
                    }
                }
            });
        };
        // SocketIO
        if (Global.socket === null) {
            Global.socket = io.connect();
        }
        Global.socket.on('client', function (data) {
            if (data.value === "1") {
                PatientsList(PatientQuery, function (data) {
                    $scope.patients = data;
                });
            }
        });
    }]);
controllers.controller('BrowseController', ["$scope", "$stateParams", "$location", "CurrentPatient", 'Views',
    function ($scope, $stateParams, $location, CurrentPatient, Views) {
        $scope.Input = CurrentPatient.Input;
        var page = $stateParams.page;
        var color = "rgba(200, 20, 30, 0.4)";
        var depertment = _.filter(Views.Data, function (data) {
            return (data.Name === CurrentPatient.Category);
        });
        $scope.contents = depertment[0].Pages[page];
        if ($scope.contents.picture.length > 0) {
            var canvas = new fabric.Canvas('schema');
            _.map($scope.contents.picture, function (value, key) {
                canvas.setBackgroundImage("/file/" + value.path, canvas.renderAll.bind(canvas), {
                    backgroundImageOpacity: 1.0,
                    backgroundImageStretch: false
                });
                if ($scope.Input[value.name] === null) {
                    fabric.Image.fromURL("/file/" + value.path, function (image) {
                    });
                }
                var hoge = JSON.stringify($scope.Input[value.name]);
                canvas.loadFromJSON(hoge, canvas.renderAll.bind(canvas), function (o, object) {
                });
            });
            canvas.on({
                'touch:gesture': function (options) {
                },
                'touch:drag': function (options) {
                },
                'touch:orientation': function (options) {
                },
                'touch:shake': function (options) {
                },
                'touch:longpress': function (options) {
                },
                'mouse:up': function (options) {
                    var radius = 20;
                    var browser = new Browser(); // browser_is();
                    if (browser.isTablet) {
                        var circle = new fabric.Circle({
                            radius: radius,
                            fill: color,
                            left: options.e.changedTouches[0].clientX - (radius / 2) - canvas._offset.left,
                            top: options.e.changedTouches[0].clientY - (radius / 2) - canvas._offset.top
                        });
                    }
                    else {
                        var circle = new fabric.Circle({
                            radius: radius,
                            fill: color,
                            left: options.e.layerX - (radius / 2),
                            top: options.e.layerY - (radius / 2)
                        });
                    }
                    canvas.add(circle);
                }
            });
        }
        $scope.clearPicture = function () {
            canvas.clear().renderAll();
        };
        $scope.setColor = function (val) {
            color = val;
        };
        $scope.next = function (path) {
            _.map($scope.contents.items, function (value, key) {
                if (value.type === "check") {
                    var name_and_value = value.name.split("-"); //"name-value"コンベンション。
                    var value1 = name_and_value[1];
                    if (!value.model) {
                        value1 = false;
                    }
                    $scope.Input[value.name] = {
                        'name': name_and_value[0],
                        'value': value1,
                        'type': value.type
                    };
                }
                else {
                    $scope.Input[value.name] = { 'name': value.name, 'value': value.model, 'type': value.type };
                }
            });
            _.map($scope.contents.picture, function (value, key) {
                $scope.Input[value.name] = { 'name': value.name, 'value': canvas.toJSON(), 'type': value.type };
            });
            CurrentPatient.Input = $scope.Input;
            $location.path(path);
        };
    }]);
controllers.controller('ConfirmController', ["$scope", "$stateParams", "CurrentPatient", "Patient", 'Global',
    function ($scope, $stateParams, CurrentPatient, Patient, Global) {
        $scope.Input = CurrentPatient.Input;
    }]);
controllers.controller('WriteController', ["$scope", "$stateParams", "$location", "CurrentPatient", "Patient", 'Global',
    function ($scope, $stateParams, $location, CurrentPatient, Patient, Global) {
        $scope.Input = CurrentPatient.Input;
        $scope.send = true;
        var patient = new Patient();
        patient.Input = CurrentPatient.Input;
        patient.Sequential = CurrentPatient.Sequential;
        patient.Status = "Accepted";
        patient.$update({ id: CurrentPatient.id }, function (result, headers) {
            CurrentPatient.Input = {};
            $location.path('/browseS');
            Global.socket.emit('server', { value: "1" });
            $scope.send = false;
        });
    }]);
//# sourceMappingURL=PatientsControllers.js.map