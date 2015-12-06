/**
 config_controller.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */
'use strict';
var mongoose = require('mongoose');
var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);
config.dbaddress = process.env.DB_PORT_27017_TCP_ADDR || 'localhost';
var Wrapper = require('./../lib/wrapper');
var wrapper = new Wrapper;
var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);
var ConfigController = (function () {
    function ConfigController() {
    }
    ConfigController.prototype.get_config = function (req, res) {
        logger.trace("begin /config");
        wrapper.Guard(req, res, function (req, res) {
            var number = 16000;
            wrapper.Authenticate(req, res, number, function (user, res) {
                wrapper.SendResult(res, 0, "OK", config);
                logger.trace("end /config");
            });
        });
    };
    ConfigController.prototype.put_config = function (req, res) {
        logger.trace("begin /config");
        wrapper.Guard(req, res, function (req, res) {
            var number = 17000;
            wrapper.Authenticate(req, res, number, function (user, res) {
                wrapper.If(res, number, (user.type != "Viewer"), function (res) {
                    config = req.body.body;
                    fs.writeFile('config/config.json', JSON.stringify(config), function (error) {
                        if (!error) {
                            wrapper.SendResult(res, 0, "OK", config);
                            logger.trace("end /config");
                        }
                        else {
                            wrapper.SendError(res, number + 1, error.message, error);
                        }
                    });
                });
            });
        });
    };
    return ConfigController;
})();
module.exports = ConfigController;
//# sourceMappingURL=config_controller.js.map