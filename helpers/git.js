'use strict';
const fs = require('fs'),
    splitter = require('stream-splitter'),
    spawn = require('child_process').spawn;

function buildGitUrl(user, repo) {
    return 'https://github.com/' + user + '/' + repo + '.git';
}

function randomChars(length) {
    let value = 97;
    let result = "";
    for (let i = 0; i < length; i++) {
        result += String.fromCharCode(value + Math.floor(Math.random() * 26));
    }
    return result;
}

function buildTmpDirPath() {
    return '/tmp/line-count-clone-' + randomChars(8);
}

function deleteFolderRecursive(path) {
    if(fs.existsSync(path))  {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function execGitCloneCmd(gitUrl, clonePath, onSuccess, onError) {
    let proc = spawn('git', ['clone', '-v', gitUrl, clonePath]); 
    let stdoutLines = proc.stdout.pipe(splitter("\n"));
    let stderrLines = proc.stderr.pipe(splitter("\n"));

    stdoutLines.encoding = "utf-8";
    stderrLines.encoding = "utf-8";

    proc.on("close", function(code) {
        if (code != 0) {
            onError();
        } else {
            onSuccess(clonePath);
        } 
    });
}

function cleanup(clonePath) {
    deleteFolderRecursive(clonePath);
};
    
const Git = {
    cloneRepo: function(user, repo, onSuccessBuilder, callback) {
        let gitUrl = buildGitUrl(user, repo);
        let clonePath = buildTmpDirPath();
        let cleanupFn = function() {
            cleanup(clonePath);
        };
        let onSuccess = onSuccessBuilder(cleanupFn, callback);
        execGitCloneCmd(gitUrl, clonePath, onSuccess, cleanupFn);
    }
};

module.exports = Git;