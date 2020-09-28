'use strict';

const fs = require('fs'),
    parser = require('./parser');

function walkRepo(path, onFile) {
    if(fs.existsSync(path))  {
        fs.readdirSync(path).forEach(function(file,index){
            if (file.indexOf(".git") != 0) { // skip git-related files and dirs
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    walkRepo(curPath, onFile);
                } else { // process file and update accumulated result
                    onFile(curPath);
                }
            }
        });
    }
}

function addResult(acc, newResult) {
    if (newResult) {
        if (acc.hasOwnProperty(newResult.filetype)) {
            acc[newResult.filetype].files += 1;
            acc[newResult.filetype].lines += newResult.lines;
        } else {
            acc[newResult.filetype] = {
                files: 1,
                lines: newResult.lines
            };
        }
    }
}

function countLines(rootDir, onComplete, callback) {
    let filesRemaining = 0; 
    let results = {};
    let walkComplete = false;

    let onFileParseResult = function(fileResult) {
        addResult(results, fileResult);
        filesRemaining -= 1;
        if (walkComplete && filesRemaining == 0) {
            onComplete();
            callback && callback(results);
        }
    };

    let onFile = function(path) {
        filesRemaining += 1;
        parser.parse(path, onFileParseResult);
    };

    walkRepo(rootDir, onFile);
    walkComplete = true;
}

const LineCount = {
    countLinesBuilder: function(onComplete, callback) {
        return function(rootDir) {
            countLines(rootDir, onComplete, callback);
        }
    }
};

module.exports = LineCount;