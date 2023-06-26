import moment from 'moment';

/**
 * Get UTC Time [YYYY-MM-DD-HH.mm.ss]
 * @returns {String} Returns UTC Time string
 */
export const getCurrentDateTime = () => {
    return moment.utc().format("YYYY-MM-DD-HH.mm.ss").toString();
}

/**
 * Returns formatted Date
 * @param {String} date date should on format YYYY-MM-DD-HH.mm.ss
 * @returns return formatted Date
 */
export const parseDate = (date) => {
    if(date.includes('T')) return moment(date).format('YYYY-MM-DDTHH:mm:ss').toString()+'.000+0000';
    return moment(date, 'YYYY-MM-DD-HH.mm.ss').format('YYYY-MM-DDTHH:mm:ss').toString()+'.000+0000';
}