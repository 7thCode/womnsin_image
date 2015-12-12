/**
 TopApplication.js
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */
/// <reference path="../../typings/tsd.d.ts" />
'use strict';
var app = angular.module('TopApplication', ['ui.router', 'TopControllers']);
/*
app.config(['$translateProvider', function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/i18n/locale-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('ja');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useLocalStorage();
}]);
*/
app.config(['$stateProvider', '$urlRouterProvider', '$compileProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $compileProvider, $httpProvider) {
        $compileProvider.debugInfoEnabled(false);
        $httpProvider.defaults.headers.common = { 'x-requested-with': 'XMLHttpRequest' };
        $stateProvider
            .state('start', {
            url: '/',
            templateUrl: 'partials/logo',
            controller: 'TopController'
        });
        $urlRouterProvider.otherwise('/');
    }]);
app.config(['$mdThemingProvider', function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('deep-orange')
            .warnPalette('red');
    }]);
app.filter('message', function () {
    return function (input) {
        var result = "?????";
        switch (input) {
            case "front":
                result = "問診票";
                break;
            case "stuff":
                result = "スタッフ";
                break;
        }
        return result;
    };
});
//# sourceMappingURL=TopApplication.js.map