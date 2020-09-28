'use strict';
const configs = require('../configs/index');

module.exports = (app) => {
    const scrappingController = require('../controllers/scrappingController');

    app.route(configs.routes.getRepositoryFileInfos)
        .get(scrappingController.getRepositoryFilesInfo);
}