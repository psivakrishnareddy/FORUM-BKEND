import log4js from 'log4js';
import { InvalidRequestError } from '../errors/InvalidRequestError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { NotfoundError } from '../errors/NotfoundError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { ForumSystemError } from '../errors/ForumSystemError.js';
var logger = log4js.getLogger('ErrorHandler');

export const ErrorHandler = (error, req, res, next) => {
    logger.error(`Error Handler Middleware`, error.stack);
    
    switch(error.constructor) {
        
        case InvalidRequestError: {
            res.status(400).send({
                timestamp: new Date(),
                status: 400,
                error: "Bad Request",
                message: error.message || null,
                path: req.originalUrl
            });
            break;
        }

        case ForbiddenError: {
            res.status(403).send({
                timestamp: new Date(),
                status: 403,
                error: "Forbidden",
                message: error.message || null,
                path: req.originalUrl
            });
            break;
        }

        case NotfoundError: {
            res.status(404).send({
                timestamp: new Date(),
                status: 404,
                error: "Requested Resource Not Found",
                message: error.message || null,
                path: req.originalUrl
            });
            break;
        }

        case UnauthorizedError: {
            res.status(308).send({ 
                location: "/login",
                timestamp: new Date(),
                status: 308,
                error: "Unauthorized Access",
                message: error.message || null,
                path: req.originalUrl
            });
            break;
        }

        case ForumSystemError: {
            res.status(500).send({ 
                timestamp: new Date(),
                status: 500,
                error: "Internal Server Error",
                message: error.message || null,
                path: req.originalUrl
            });
            break;
        }

        default: {
            res.status(500).send({
                timestamp: new Date(),
                status: 500,
                error: "Internal Server Error",
                message: error.message || null,
                path: req.originalUrl
            });
            break;
        }
    }
    next();
}