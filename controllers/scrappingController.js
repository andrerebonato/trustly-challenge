'use strict';

const configs = require('../configs/index'),    
    git = require("../helpers/git"),
    linecount = require("../helpers/lineCount");

exports.getRepositoryFilesInfo = async (req, res) => {
    try{
        const { profile, repository } = req.params;

        if(!profile || !repository) {
            return res.status(configs.httpStatus.badRequest).send(configs.sendResponse(false, 'Invalid params', { profile, repository }));
        }

        git.cloneRepo(profile, repository, linecount.countLinesBuilder, (result) => {
            return res.status(configs.httpStatus.ok).send(configs.sendResponse(true, "That's all, folks!", result));
        });
    } catch(err) {
        return res.status(configs.httpStatus.internalServerError, 'An internal server error has occurred, please try again later ...', err);
    }
}