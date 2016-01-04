/**
 view_controller.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */
'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);
config.dbaddress = process.env.DB_PORT_27017_TCP_ADDR || 'localhost';
var ViewModel = require('../../model/view');
var result = require('./../lib/result');
var Wrapper = require('./../lib/wrapper');
var wrapper = new Wrapper;
var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);
var messages = {
    already: "Already found"
};
var ViewController = (function () {
    function ViewController() {
    }
    ViewController.prototype.post_view = function (req, res) {
        logger.trace("begin /view");
        wrapper.Guard(req, res, function (req, res) {
            var number = 18000;
            var view = new ViewModel();
            var data = req.body.data;
            var viewdata = JSON.parse(data);
            view.Pages = viewdata.Pages;
            view.Name = viewdata.Name;
            wrapper.Save(res, number, view, function (res, view) {
                wrapper.SendResult(res, 0, "OK", view);
                logger.trace("end /view");
            });
        });
    };
    ViewController.prototype.post_view_create = function (req, res) {
        logger.trace("begin /view/create");
        wrapper.Guard(req, res, function (req, res) {
            var number = 19000;
            wrapper.Authenticate(req, res, number, function (user, res) {
                wrapper.If(res, number, (user.type != "Viewer"), function (res) {
                    ViewModel.count({ Name: req.body.Name }, function (error, count) {
                        if (!error) {
                            if (count === 0) {
                                var view = new ViewModel();
                                view.Name = req.body.Name;
                                view.Pages = req.body.Pages;
                                wrapper.Save(res, number, view, function (res, view) {
                                    wrapper.SendResult(res, 0, "OK", view);
                                    logger.trace("end /view/create");
                                });
                            }
                            else {
                                wrapper.SendResult(res, number + 1, "already", {});
                            }
                        }
                        else {
                            wrapper.SendError(res, number + 20, error.message, error);
                        }
                    });
                });
            });
        });
    };
    ViewController.prototype.get_view_id = function (req, res) {
        logger.trace("begin /view/:id");
        wrapper.Guard(req, res, function (req, res) {
            var number = 20000;
            wrapper.FindById(res, number, ViewModel, req.params.id, function (res, view) {
                wrapper.SendResult(res, 0, "OK", view);
            });
        });
    };
    ViewController.prototype.put_view_id = function (req, res) {
        logger.trace("begin /view/:id");
        wrapper.Guard(req, res, function (req, res) {
            var number = 21000;
            wrapper.Authenticate(req, res, number, function (user, res) {
                wrapper.If(res, number, (user.type != "Viewer"), function (res) {
                    wrapper.FindById(res, number, ViewModel, req.params.id, function (res, view) {
                        view.Name = req.body.Name;
                        view.Pages = req.body.Pages;
                        wrapper.Save(res, number, view, function (res, object) {
                            wrapper.SendResult(res, 0, "OK", view);
                            logger.trace("end /view/:id");
                        });
                    });
                });
            });
        });
    };
    ViewController.prototype.delete_view_id = function (req, res) {
        logger.trace("begin /view/:id");
        wrapper.Guard(req, res, function (req, res) {
            var number = 22000;
            wrapper.Authenticate(req, res, number, function (user, res) {
                wrapper.If(res, number, (user.type != "Viewer"), function (res) {
                    wrapper.Remove(res, number, ViewModel, req.params.id, function (res) {
                        wrapper.SendResult(res, 0, "OK", {});
                        logger.trace("end /view/:id");
                    });
                });
            });
        });
    };
    ViewController.prototype.get_view_query_query = function (req, res) {
        logger.trace("begin /view/:id");
        wrapper.Guard(req, res, function (req, res) {
            var number = 23000;
            wrapper.Authenticate(req, res, number, function (user, res) {
                var query = JSON.parse(decodeURIComponent(req.params.query));
                wrapper.Find(res, number, ViewModel, {}, {}, {}, function (res, views) {
                    wrapper.SendResult(res, 0, "OK", views);
                    logger.trace("end /view/:id");
                });
            });
        });
    };
    return ViewController;
})();
module.exports = ViewController;
//# sourceMappingURL=view_controller.js.map