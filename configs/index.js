'use strict';

module.exports = {
    requests: {
        limiter: {
            rateLimitWindow: 60 * 1000,
            maxRequestsPerRateLimitWindow: 350,
        },
        slower: {
            rateLimitWindow: 60 * 1000,
            delayAfterPerRateLimitWindow: 300,
            delayMs: 250
        }
    },
    morganMiddleware: {
        type: "common"
    },
    routes: {
        getRepositoryFileInfos: "/repository/files/info/:profile/:repository"
    },
    httpStatus: {
        ok: 200,
        badRequest: 400,
        notFound: 404,
        methodNotAllowed: 405,
        requestTimeout: 408,
        internalServerError: 500 
    },
    sendResponse: (isValid, message, model) => ({ isValid, message, model: model }),
    codeFileTypes: { 
        "java": "java",
        "scala": "scala",
        "rb": "rb",
        "c": "c",
        "c++": "c++",
        "php": "php",
        "pl": "pl",
        "js": "js",
        "sh": "sh",
        "cs": "cs",
        "fs": "fs",
        "vb": "vb",
        "py": "py",
        "bat": "bat",
        "html": "html",
        "css": "css",
        "xml": "Xml",
        "json": "json",
        "ts": "ts"
    }
}