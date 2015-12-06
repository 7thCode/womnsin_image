/**
 formatpdf.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */
'use strict';
var PDFDocument = require('pdfkit-cjk');
var _ = require('lodash');
var FormatPDF = (function () {
    function FormatPDF() {
        this.doc = null;
        this.font = "";
        this.pagehight = 0;
        this.originx = 40;
        this.originy = 40;
        this.nameboxwidth = 200;
        this.valueboxwidth = 300;
        this.boxhight = 20;
        this.stringoffsetx = 3;
        this.stringoffsety = 2;
        this.font = "public/font/ttf/ipaexg.ttf";
        this.doc = new PDFDocument;
        this.pagehight = 660;
        this.originx = 40;
        this.originy = 40;
        this.nameboxwidth = 200;
        this.valueboxwidth = 300;
        this.boxhight = 20;
        this.stringoffsetx = 3;
        this.stringoffsety = 2;
    }
    FormatPDF.prototype.TextBox = function (text, value) {
        this.doc.rect(this.originx, this.originy, this.nameboxwidth, this.boxhight);
        this.doc.font(this.font).fontSize(12).text(text, this.originx + this.stringoffsetx, this.originy + this.stringoffsety);
        this.doc.rect(this.originx + this.nameboxwidth, this.originy, this.valueboxwidth, this.boxhight);
        this.doc.font(this.font).fontSize(12).text(value, this.originx + this.stringoffsetx + this.nameboxwidth, this.originy + this.stringoffsety);
    };
    FormatPDF.prototype.write = function (patient) {
        var _this = this;
        this.doc.info['Title'] = patient.Information.name;
        this.doc.info['Author'] = 'WMONSIN';
        this.doc.info['Subject'] = patient.Information.kana;
        this.originy += 20;
        this.TextBox("かな", patient.Information.kana);
        this.originy += 20;
        this.TextBox("氏名", patient.Information.name);
        this.originy += 20;
        var date = patient.Date.getFullYear() + "/" + (patient.Date.getMonth() + 1) + "/" + patient.Date.getDate();
        var time = patient.Date.getHours() + ":" + patient.Date.getMinutes() + ":" + patient.Date.getSeconds();
        this.TextBox("日時", date + " " + time);
        _.each(patient.Input, function (item) {
            switch (item.type) {
                case "text":
                    _this.originy += 20;
                    _this.TextBox(item.name, item.value);
                    break;
                case "select":
                    _this.originy += 20;
                    _this.TextBox(item.name, item.value);
                    break;
                case "check":
                    if (item.value) {
                        _this.originy += 20;
                        _this.TextBox(item.name, item.value);
                    }
                    break;
                case "numeric":
                    _this.originy += 20;
                    _this.TextBox(item.name, item.value);
                    break;
                default:
                    break;
            }
            if (_this.originy > _this.pagehight) {
                _this.originy = 20;
                _this.doc.stroke();
                _this.doc.addPage();
            }
        });
        this.doc.stroke();
        return this.doc;
    };
    return FormatPDF;
})();
module.exports = FormatPDF;
//# sourceMappingURL=formatpdf.js.map