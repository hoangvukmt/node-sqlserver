'use_strict';

// const systemConfig = require('config');
const Email_Length = 255;

const RESPONSE_CODE = {
    'SUCCESS': '001',
    'REQUIRED': '101',
    'SERVER_ERROR': '500',
    'NOT_EXIST': '404',
    'AUTH_FAIL': '401',
    'DUPLICATE': '400'
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // console.dir(`${isEmptyObject(email)} : ${email}`);
    if(isEmptyObject(email) || email.length > Email_Length) {
        return false;
    }
    return re.test(email);
}
function isEmptyObject(...listObject) {
    let check = false;
    listObject.forEach(obj => {
        if(obj === undefined || obj === null || obj === '') check = true;
    });
    return check;
}
function isNullObject(...listObject) {
    let check = false;
    listObject.forEach(obj => {
        if(obj === undefined || obj === null) check = true;
    });
    return check;
}
function check_T_Family(family) {
    let notNullFields = [
        'UserNo',
        'Sex'
    ]
    //check null fields
    let hasNull = false;
    let requiredFields = '';
    notNullFields.forEach( key => {
        hasNull = hasNull && isEmptyObject(family.key);
        if(hasNull) {
            requiredFields += `, ${key}`;
        }
    })
    if(hasNull) {
        return false;
    }else {
        return true;
    }
    
}
function checkUpdateFamily(family) {
    let requiredFields = [
        'FamilyNo',
        'UserNo',
        'Relation',
        'Sex'
    ]
    let checkRequired =  checkRequiredFields(family, requiredFields);
    if(!checkRequired.required) {
        //check Birthday ....
        if(family["Birthday"] === null || family["Birthday"].getTime()) {
            return checkRequired;
        }else {
            return {
                required: true,
                requiredFields: 'Birthday is invalid!'
            }
        }
    }
    return checkRequired;
    
}
function checkCreateFamily(family) {
    let requiredFields = [
        'UserNo',
        'Relation',
        'Sex'
    ]
    let checkRequired =  checkRequiredFields(family, requiredFields);
    if(!checkRequired.required) {
        //check Birthday ....
        if(family["Birthday"] === null || family["Birthday"].getTime()) {
            return checkRequired;
        }else {
            return {
                required: true,
                requiredFields: 'Birthday is invalid!'
            }
        }
    }
    return checkRequired;
}
/**
 * 
 * @param {Object} checkObject object that want to check ...
 * @param {Array} requiredKeys  list of required keys
 */
function checkRequiredFields(checkObject, requiredKeys) {
    let hasNull = false;
    let requiredTextList = '';
    requiredKeys.forEach( key => {
        if(isEmptyObject(checkObject[key])) {
            hasNull = true;
            requiredTextList += `${key}, `  ;
        }
    });
    return {
        required: hasNull,
        requiredFields: requiredTextList
    }
}
function checkRequiredAlowEmpty(checkObject, requiredKeys, alowEmpty) {
    let hasNull = false;
    let requiredTextList = '';
    requiredKeys.forEach( key => {
        if (alowEmpty.indexOf(',' + key + ',') < 0) {
            if(isEmptyObject(checkObject[key])) {
                hasNull = true;
                requiredTextList += `${key}, `  ;
            }
        }
        else {
            if(isNullObject(checkObject[key])) {
                hasNull = true;
                requiredTextList += `${key}, `  ;
            }
        }
    });
    return {
        required: hasNull,
        requiredFields: requiredTextList
    }
}
module.exports = {
    validateEmail,
    isEmptyObject,
    isNullObject,
    check_T_Family,
    checkUpdateFamily,
    checkCreateFamily,
    RESPONSE_CODE,
    checkRequiredFields,
    checkRequiredAlowEmpty
}