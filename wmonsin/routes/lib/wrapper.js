/**
 wrapper.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */
'use strict';
var _ = require('lodash');
var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);
var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);
var result = require('./result');
var View = require('./../../model/view');
var Wrapper = (function () {
    function Wrapper() {
    }
    Wrapper.prototype.GetView = function (name, success, notfound, error) {
        View.findOne({ "Name": name }, function (finderror, doc) {
            if (!finderror) {
                if (doc) {
                    success(doc);
                }
                else {
                    notfound();
                }
            }
            else {
                error("Find Error", finderror);
            }
        });
    };
    Wrapper.prototype.BasicHeader = function (response, session) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Pragma", "no-cache");
        response.header("Cache-Control", "no-cache");
        response.contentType('application/json');
        return response;
    };
    Wrapper.prototype.Guard = function (req, res, callback) {
        try {
            if (req.headers["x-requested-with"] === 'XMLHttpRequest') {
                logger.trace("|enter Guard ");
                res = this.BasicHeader(res, "");
                callback(req, res);
                logger.trace("|exit Guard ");
            }
            else {
                if (res) {
                    this.SendWarn(res, 1, 'CSRF Attack.', {});
                }
            }
        }
        catch (e) {
            if (res) {
                this.SendFatal(res, 100000, e.message, e);
            }
        }
    };
    Wrapper.prototype.Authenticate = function (req, res, code, callback) {
        if (req.isAuthenticated()) {
            logger.trace("|enter Authenticate " + code);
            callback(req.user, res);
            logger.trace("|exit Authenticate " + code);
        }
        else {
            if (res) {
                this.SendWarn(res, code + 2, "Unacceptable", {});
            }
        }
    };
    Wrapper.prototype.FindById = function (res, code, model, id, callback) {
        var _this = this;
        model.findById(id, function (error, object) {
            if (!error) {
                if (object) {
                    logger.trace("|enter FindById " + code);
                    callback(res, object);
                    logger.trace("|exit FindById " + code);
                }
                else {
                    _this.SendWarn(res, code + 10, "", {});
                }
            }
            else {
                if (res) {
                    _this.SendError(res, code + 100, error.message, error);
                }
            }
        });
    };
    Wrapper.prototype.FindOne = function (res, code, model, query, callback) {
        var _this = this;
        model.findOne(query, function (error, doc) {
            if (!error) {
                logger.trace("|enter FindOne " + code);
                callback(res, doc);
                logger.trace("|exit FindOne " + code);
            }
            else {
                if (res) {
                    _this.SendError(res, code + 100, error.message, error);
                }
            }
        });
    };
    Wrapper.prototype.Find = function (res, code, model, query, count, sort, callback) {
        var _this = this;
        model.find(query, count, sort, function (error, docs) {
            if (!error) {
                if (docs) {
                    logger.trace("|enter Find " + code);
                    callback(res, docs);
                    logger.trace("|exit Find " + code);
                }
                else {
                    _this.SendError(res, code + 10, "", {});
                }
            }
            else {
                if (res) {
                    _this.SendError(res, code + 100, error.message, error);
                }
            }
        });
    };
    Wrapper.prototype.Save = function (res, code, instance, callback) {
        var _this = this;
        instance.save(function (error) {
            if (!error) {
                logger.trace("|enter Save " + code);
                callback(res, instance);
                logger.trace("|exit Save " + code);
            }
            else {
                if (res) {
                    _this.SendError(res, code + 100, error.message, error);
                }
            }
        });
    };
    Wrapper.prototype.Remove = function (res, code, model, id, callback) {
        var _this = this;
        model.remove({ _id: id }, function (error) {
            if (!error) {
                logger.trace("|enter Remove " + code);
                callback(res);
                logger.trace("|exit Remove " + code);
            }
            else {
                if (res) {
                    _this.SendError(res, code + 100, error.message, error);
                }
            }
        });
    };
    Wrapper.prototype.If = function (res, code, condition, callback) {
        if (condition) {
            logger.trace("|enter If " + code);
            callback(res);
            logger.trace("|exit If " + code);
        }
        else {
            if (res) {
                this.SendWarn(res, code + 1, "", {});
            }
        }
    };
    Wrapper.prototype.SendWarn = function (res, code, message, object) {
        logger.warn(message + " " + code);
        res.send(JSON.stringify(new result(code, message, object)));
    };
    Wrapper.prototype.SendError = function (res, code, message, object) {
        logger.error(message + " " + code);
        res.send(JSON.stringify(new result(code, message, object)));
    };
    Wrapper.prototype.SendFatal = function (res, code, message, object) {
        logger.fatal(message + " " + code);
        res.send(JSON.stringify(new result(code, message, object)));
    };
    Wrapper.prototype.SendResult = function (res, code, message, object) {
        if (code != 0) {
            logger.info(message + " " + code);
        }
        res.send(JSON.stringify(new result(code, message, object)));
    };
    Wrapper.prototype.StripAccount = function (account) {
        delete account._id;
        delete account.hash;
        delete account.salt;
        return account;
    };
    Wrapper.prototype.StripAccounts = function (accounts) {
        var _this = this;
        var result = [];
        _.each(accounts, function (member) {
            result.push(_this.StripAccount(member));
        });
        return result;
    };
    return Wrapper;
})();
module.exports = Wrapper;
//# sourceMappingURL=wrapper.js.map