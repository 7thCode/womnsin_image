/**
 patient.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Patient = new Schema({
    'Date': { type: Date, default: Date.now },
    'Status': { type: String, default: "Init" },
    'Category': { type: String, default: "1" },
    'Information': {},
    'Input': {},
    'Sequential': 0
});
module.exports = mongoose.model('Patient', Patient);
//# sourceMappingURL=patient.js.map