/**
 pdf_controller.ts
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
var PatientModel = require('../../model/patient');
var formatpdf = require('./../lib/formatpdf');
var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);
var PdfController = (function () {
    function PdfController() {
    }
    PdfController.prototype.get_pdf_id = function (request, response, next) {
        try {
            logger.trace("begin /pdf/:id");
            PatientModel.findById(request.params.id, function (error, patient) {
                if (!error) {
                    if (patient) {
                        var format = new formatpdf;
                        var doc = format.write(patient);
                        doc.write('public/output/output.pdf', function () {
                            var responsePDF = fs.createReadStream('public/output/output.pdf');
                            responsePDF.pipe(response);
                            logger.trace("end /pdf/:id");
                        });
                    }
                    else {
                        logger.error("//pdf/:id 1");
                        next();
                    }
                }
                else {
                    logger.error("//pdf/:id 2");
                    next();
                }
            });
        }
        catch (e) {
            logger.error("//pdf/:id 3");
            next();
        }
    };
    return PdfController;
})();
module.exports = PdfController;
//# sourceMappingURL=pdf_controller.js.map