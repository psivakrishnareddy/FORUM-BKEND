import log4js from 'log4js';
var logger = log4js.getLogger('BoxUtility');
import BoxSDK from 'box-node-sdk';
import * as sdkConfig from '../config/boxConfig.json';
import BoxClient from 'box-node-sdk/lib/box-client';
var sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);
import fs from 'fs';


/**
 * Get the Box Client Object
 * @returns {Promise.<BoxClient>} the box client object
 */
export const getBoxClient = () => {
    logger.info(`Entering method: BoxUtility.getBoxClient`);
    return new Promise((resolve, reject) => {
        try {
            let serviceAccountClient = sdk.getAppAuthClient('enterprise');
            logger.info("Exitting method: BoxUtility.getBoxClient");
            resolve(serviceAccountClient);
        } catch (err) {
            logger.error("Error from method: BoxUtility.getBoxClient", err.message);
            reject(err);
        }
    });
}

/**
 * Create a New Box Folder
 * @param {String} folderName The folder name of the box folder to be created
 * @returns {Promise.<Number>} the created folder's box folder folder id
 */
export const createBoxFolder = (folderName) => {
    logger.info(`Entering method: BoxUtility.createBoxFolder [params - folderName (${folderName})]`);
    return new Promise(async (resolve, reject) => {
        try {
            let boxClient = await getBoxClient();
            let folderDetails = await boxClient.folders.create('0', folderName+'');
            logger.info("Exitting method: BoxUtility.createBoxFolder");
            resolve(folderDetails.id);
        } catch (err) {
            logger.error("Exitting method: BoxUtility.createBoxFolder", err.message);
            reject(err);
        }
    });
}

/**
 * Upload a file to box fodler storage
 * @param {fs.ReadStream} fileStream The stream of file to be uploaded
 * @param {Number} parentFolderId The parent folder box folder id
 * @param {String} fileName Filename of the file to be uploaded
 * @returns {Number} the box file id
 */
export const uploadFileToBox = (fileStream, parentFolderId, fileName) => {
    logger.info(`Entering method: BoxUtility.uploadFileToBox [params - fileStream, parentFolderId (${parentFolderId}), fileName (${fileName})]`);
    return new Promise(async (resolve, reject) => {
        try {
            let boxClient = await getBoxClient(null);
            let fileDetails = await boxClient.files.uploadFile(parentFolderId, fileName, fileStream);
            logger.info("Exitting method: BoxUtility.uploadFileToBox");
            resolve(fileDetails.entries[0].id);
        } catch (err) {
            logger.error("Exitting method: BoxUtility.uploadFileToBox", err.message);
            reject(err);
        }
    });
}

/**
 * Delete a file from box storage
 * @param {Number} boxFileId The box file id to be deleted
 * @returns {Boolean} Returns true if deletion successful
 */
export const deleteFileFromBox = (boxFileId) => {
    logger.info(`Enter Method BoxUtility.deleteFileFromBox [params - boxFileId (${boxFileId})]`);
    return new Promise(async (resolve, reject) => {
        try {
            let boxClient = await getBoxClient(null);
            await boxClient.del('/files/' + boxFileId);
            logger.info("Exit Method BoxUtility.deleteFileFromBox");
            resolve(true);
        } catch (err) {
            logger.error("Error from Method BoxUtility.deleteFileFromBox", err.message);
            reject(err);
        }
    });
}

/**
 * Delete a folder from box storage
 * @param {Number} boxFolderId The box folder id to be deleted
 * @returns {Boolean} Returns true if deletion successful
 */
 export const deleteFolderFromBox = (boxFolderId) => {
    logger.info(`Enter Method BoxUtility.deleteFolderFromBox [params - boxFolderId (${boxFolderId})]`);
    return new Promise(async (resolve, reject) => {
        try {
            let boxClient = await getBoxClient(null);
            await boxClient.folders.delete(boxFolderId, {recursive: true});
            logger.info("Exit Method BoxUtility.deleteFolderFromBox");
            resolve(true);
        } catch (err) {
            logger.error("Error from Method BoxUtility.deleteFolderFromBox", err.message);
            reject(err);
        }
    });
}