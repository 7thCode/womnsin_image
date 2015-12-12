/**
 account_controller.ts
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
var AccountModel = require('../../model/account');
var passport = require('passport');
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
var AccountController = (function () {
    function AccountController() {
    }
    AccountController.prototype.post_account_create = function (request, response) {
        logger.trace("begin /account/create");
        wrapper.Guard(request, response, function (request, response) {
            var number = 9000;
            wrapper.Authenticate(request, response, number, function (user, res) {
                wrapper.If(res, number, (user.type != "Viewer"), function (res) {
                    wrapper.FindOne(res, number, AccountModel, { username: request.body.username.toLowerCase() }, function (res, account) {
                        if (!account) {
                            AccountModel.register(new AccountModel({
                                username: request.body.username,
                                type: request.body.type
                            }), request.body.password, function (error, account) {
                                if (!error) {
                                    wrapper.SendResult(res, 0, "OK", account);
                                    logger.trace("end /account/create");
                                }
                                else {
                                    wrapper.SendError(response, number + 100, error.message, error);
                                }
                            });
                        }
                        else {
                            wrapper.SendResult(res, 1, messages.already, {});
                        }
                    });
                });
            });
        });
    };
    /*! logout */
    AccountController.prototype.post_account_logout = function (req, res) {
        logger.trace("begin /account/logout");
        wrapper.Guard(req, res, function (req, res) {
            req.logout();
            wrapper.SendResult(res, 0, "OK", {});
            logger.trace("end /account/logout");
        });
    };
    /*! login */
    AccountController.prototype.post_account_login = function (request, response, next) {
        passport.authenticate('local', function (error, user, info) {
            var number = 10000;
            try {
                if (!error) {
                    if (user) {
                        logger.trace("begin /account/login");
                        request.login(user, function (error) {
                            if (!error) {
                                wrapper.SendResult(response, 0, "OK", user);
                                logger.trace("end /account/login");
                            }
                            else {
                                wrapper.SendError(response, number + 1, error.message, error);
                            }
                        });
                    }
                    else {
                        wrapper.SendResult(response, number + 2, "", {});
                    }
                }
                else {
                    wrapper.SendError(response, number + 3, error.message, error);
                }
            }
            catch (e) {
                wrapper.SendFatal(response, 100000, e.message, e);
            }
        })(request, response, next);
    };
    /*! get */
    AccountController.prototype.get_account_id = function (req, res) {
        logger.trace("begin /account/:id");
        wrapper.Guard(req, res, function (req, res) {
            var number = 11000;
            wrapper.Authenticate(req, res, number, function (user, res) {
                wrapper.FindById(res, number, AccountModel, req.params.id, function (res, account) {
                    wrapper.SendResult(res, 0, "OK", account);
                    logger.trace("end /account/:id");
                });
            });
        });
    };
    /*! update */
    AccountController.prototype.put_account_id = function (req, res) {
        logger.trace("begin /account/:id");
        wrapper.Guard(req, res, function (req, res) {
            var number = 12000;
            wrapper.Authenticate(req, res, number, function (user, res) {
                wrapper.If(res, number, (user.type != "Viewer"), function (res) {
                    wrapper.FindById(res, number, AccountModel, req.params.id, function (res, account) {
                        account.username = req.body.username;
                        account.type = req.body.type;
                        wrapper.Save(res, number, account, function (res, account) {
                            wrapper.SendResult(res, 0, "OK", account);
                            logger.trace("end /account/:id");
                        });
                    });
                });
            });
        });
    };
    /*! delete */
    AccountController.prototype.delete_account_id = function (req, res) {
        logger.trace("begin /account/:id");
        wrapper.Guard(req, res, function (req, res) {
            var number = 13000;
            wrapper.Authenticate(req, res, number, function (user, res) {
                wrapper.If(res, number, (user.type != "Viewer"), function (res) {
                    wrapper.Remove(res, number, AccountModel, req.params.id, function (res) {
                        wrapper.SendResult(res, 0, "OK", {});
                        logger.trace("end /account/:id");
                    });
                });
            });
        });
    };
    /*! query */
    AccountController.prototype.get_account_query_query = function (req, res) {
        logger.trace("begin /account/query/:query");
        wrapper.Guard(req, res, function (req, res) {
            var number = 14000;
            // Authenticate(req, res, number, (user:any, res:any) => {
            var query = JSON.parse(decodeURIComponent(req.params.query));
            wrapper.Find(res, number, AccountModel, query, {}, {}, function (res, docs) {
                wrapper.SendResult(res, 0, "OK", wrapper.StripAccounts(docs));
                logger.trace("end /account/query/:query");
            });
            //});
        });
    };
    /*! update */
    AccountController.prototype.get_account_password_id = function (req, res) {
        logger.trace("begin /account/password/:id");
        wrapper.Guard(req, res, function (req, res) {
            var number = 15000;
            wrapper.Authenticate(req, res, number, function (user, res) {
                //  If(res, number, (user.type != "Viewer"), (res:any) => {
                wrapper.FindById(res, number, AccountModel, req.params.id, function (res, account) {
                    account.setPassword(req.body.password, function (error) {
                        if (!error) {
                            wrapper.Save(res, number, account, function (res, account) {
                                wrapper.SendResult(res, 0, "OK", account);
                            });
                        }
                        else {
                            wrapper.SendError(res, number + 200, error.message, error);
                        }
                    });
                });
                //  });
            });
        });
    };
    return AccountController;
})();
module.exports = AccountController;
//# sourceMappingURL=account_controller.js.map