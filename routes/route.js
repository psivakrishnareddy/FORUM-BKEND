import { SecurityConfig } from '../config/securityConfig.js';
import { DiscussionApi } from '../server/api/DiscussionApi.js';
import { UserApi } from '../server/api/UserApi.js';
import Express from 'express';

/**
 * Configure Routing for the Express Application
 * @param {Express} app The Express Application
 */
export const ConfigureRoute = (app) => {
    SecurityConfig(app);
    DiscussionApi(app);
    UserApi(app);
}