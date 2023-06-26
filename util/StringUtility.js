/**
 * Get String Regex Expression with escaped expressions
 * @param {String} string 
 * @returns String Regex Expression with escaped expressions
 */
export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
  
/**
 * Replace all occurances of Characters
 * @param {String | any} str The String in which the value has to be replaced
 * @param {String} find The list of characters to be replaced
 * @param {String} replace The character that with thich it has to be replaced
 * @returns String With replaced characters
 */
export const replaceAll = (str, find, replace) => {
    if(typeof str == 'string')
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    else 
        return str;
}
