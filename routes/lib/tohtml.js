/**
 tohtml.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */
'use strict';
var _ = require('lodash');
var ElementData = (function () {
    function ElementData() {
    }
    return ElementData;
})();
var ToHtml = (function () {
    function ToHtml() {
    }
    ToHtml.prototype.render = function (element) {
        if ("dv_tag" in element) {
            var haschild = false;
            var result = "<" + element["dv_tag"];
            for (var attribute in element) {
                if (attribute != "dv_tag") {
                    if (attribute != "dv_childelements") {
                        result += (" " + attribute + '="' + element[attribute] + '"');
                    }
                    else {
                        haschild = (element["dv_childelements"].length != 0);
                    }
                }
            }
            if (haschild) {
                result = result += ">";
                _.each(element["dv_childelements"], function (childelement) {
                    var child = new ToHtml();
                    result += child.render(childelement);
                });
                result += "</" + element["dv_tag"] + ">";
            }
            else {
                switch (element["dv_tag"]) {
                    case "link":
                        result = result += ">";
                        break;
                    case "meta":
                        result = result += ">";
                        break;
                    default:
                        result = result += "/>";
                        break;
                }
            }
        }
        else {
            if ("dv_value" in element) {
                result = element["dv_value"];
            }
        }
        return result;
    };
    return ToHtml;
})();
module.exports = ToHtml;
//# sourceMappingURL=tohtml.js.map