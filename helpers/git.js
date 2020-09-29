'use strict';

const fs = require('fs'),
    splitter = require('stream-splitter'),
    spawn = require('child_process').spawn;

const buildGitUrl = (user, repo) => `https://github.com/${user}/${repo}.git`;

const buildTmpDirPath = () => `/tmp/challenge-trustly-' ${randomChars(8)}`;

const cleanup = (clonePath) => deleteFolderRecursive(clonePath);

function randomChars(length) {
    let value = 97;
    let result = "";
    for (let i = 0; i < length; i++) {
        result += String.fromCharCode(value + Math.floor(Math.random() * 26));
    }
    return result;
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

//clone repository
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