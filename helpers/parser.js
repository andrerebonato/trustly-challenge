"use strict";

const mime = require('mime'), 
    reader = require('buffered-reader'),
    configs = require("../configs/index");

function getExtension(path) {
    let lastDot = path.lastIndexOf('.');
    if (lastDot > -1) {
        return path.substring(lastDot + 1);
    } else {
        return "";
    }
}

function getCodeFileType(extension) {
    return configs.codeFileTypes[extension];
}

function parseCodeFile(path, filetype, onSuccess) {
    var result = {
        filetype: filetype,
        lines: 0
    }
    new reader.DataReader(path, { "encoding": "utf-8" })
        .on("line", function(line) {
            result.lines += 1;   
        })
        .on("end", function() {
            onSuccess(result);
        })
        .read();
}

function parseTextFile(path, onSuccess) {
    let result = {
        filetype: "text",
        lines: 0,
        codeLines: 0
    };

    new reader.DataReader(path, { "encoding": "utf-8" })
        .on("line", function(line) {
            result.lines += 1;   
        })
        .on("end", function() {
            onSuccess(result);
        })
        .read();
}

const Parser = {
    parse: function(path, onSuccess) {
        let extension = getExtension(path);
        let codeFileType = getCodeFileType(extension);
        if (codeFileType) {
            parseCodeFile(path, codeFileType, onSuccess);
        } else if (mime.lookup(path).indexOf("text/") == 0) {
            parseTextFile(path, onSuccess);
        } else {
            onSuccess(null);
        }
    }
};

module.exports = Parser;