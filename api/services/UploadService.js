'use strict';

const formidable = require('formidable');
const systemConfig = require('config');
const fs = require('fs');
const commonUtil = require('../util/common');
const ResCode = require('../util/validation').RESPONSE_CODE;

async function getFormData(req, folder) {
    var formData = new formidable.IncomingForm();
    let tmp = new Promise(function(resolve, reject){
        formData.parse(req, function(err, fields, files){
            if (fields) {
                let result = {
                    fields: fields
                }
                resolve(result);
            } else reject(err);
        });
    });
    var data;
    await tmp.then(function(res){
        data = res.fields;
    });
    
    return data;
}

async function uploadBase64(data, folder) {
    var dateNow = new Date();
    var folderName = folder === null ? commonUtil.dateToyyyyMMdd(dateNow) : folder;
    if (!fs.existsSync(systemConfig.get('TestENV.uploadPath'))){
        fs.mkdirSync(systemConfig.get('TestENV.uploadPath'));
    }
    if (!fs.existsSync(systemConfig.get('TestENV.uploadPath') + '/' + folderName)){
        fs.mkdirSync(systemConfig.get('TestENV.uploadPath') + '/' + folderName);
    }
    var fileNameDb = '画像' + commonUtil.dateToyyyyMMddHHmm(dateNow);
    var fileNameLocal = '画像' + commonUtil.dateToyyyyMMddHHmmssii(dateNow) + '_' + data.FileID;
    
    var result = commonUtil.writeBase64File(data.FileBase64, folderName, fileNameLocal);
    if (result.ok){
        return {
            code: ResCode.SUCCESS,
            message: '',
            data: {
                file_path: folderName,
                file_name_db: fileNameDb,
                file_name_local: fileNameLocal + "." + result.fileExtension
            }
        }
    }
    else {
        return {
            code: ResCode.SERVER_ERROR,
            message: result.msg
        }
    }
}

async function uploadFile(req, folder) {
    var dateNow = new Date();
    var folderName = folder === null ? commonUtil.dateToyyyyMMdd(dateNow) : folder;
    if (!fs.existsSync(systemConfig.get('TestENV.uploadPath'))){
        fs.mkdirSync(systemConfig.get('TestENV.uploadPath'));
    }
    if (!fs.existsSync(systemConfig.get('TestENV.uploadPath') + '/' + folderName)){
        fs.mkdirSync(systemConfig.get('TestENV.uploadPath') + '/' + folderName);
    }
    var formData = new formidable.IncomingForm();
    formData.uploadDir = systemConfig.get('TestENV.uploadPath') + '/' + folderName;
    formData.keepExtensions = true;
    
    var fileNameDb = '画像' + commonUtil.dateToyyyyMMddHHmm(dateNow);
    var fileNameLocal = '画像' + commonUtil.dateToyyyyMMddHHmmssii(dateNow) + '_';

    var result;
    let tmp = new Promise(function(resolve, reject){
        formData.on('field', function(name, value) {
            if (name === "file_id"){
                fileNameLocal += value;
            }
        });
        formData.on('file', function(field, file) {
            fileNameLocal += file.path.substr(file.path.lastIndexOf('.'));
            fs.rename(file.path, formData.uploadDir + "/" + fileNameLocal);
        });
        formData.parse(req, function(err, fields, files){
            if (fields) {
                let result = {
                    fields: fields,
                    files: files
                }
                resolve(result);
            } else reject(err);
        });
    });
    await tmp.then(function(res){
        result = {
            file: res.files,
            code: ResCode.SUCCESS,
            message: "",
            data: {
                field: res.fields,
                file_path: folderName,
                file_name_db: fileNameDb,
                file_name_local: fileNameLocal
            }
        }
    });
    
    return result;
}

async function upload(req) {
    var data;
    var form = new formidable.IncomingForm();
    var folderName = commonUtil.dateToyyyyMMdd(new Date());
    var fileName;
    if (!fs.existsSync(systemConfig.get('TestENV.uploadPath') + '/' + folderName)){
        fs.mkdirSync(systemConfig.get('TestENV.uploadPath') + '/' + folderName);
    }
    form.uploadDir = systemConfig.get('TestENV.uploadPath') + '/' + folderName;
    form.keepExtensions = true;
    
    let tmp = new Promise(function(resolve, reject){
        form.on('field', function(name, value) {
            if (name === "file_name"){
                fileName = value;
            }
        });

        form.on('file', function(field, file) {
            fileName += file.path.substr(file.path.lastIndexOf('.'));
            fs.rename(file.path, form.uploadDir + "/" + fileName);
        });

        form.parse(req, function(err, fields, files){
            if (fields) {
                let result = {
                    fields: fields,
                    files: files
                }
                resolve(result);
            } else reject(err);
        });
    });
    await tmp.then(function(res){
        data = res.fields;
        data.file_path = '/' + folderName;
        data.file_name = fileName;

        data.ok = true;
        data.msg = "";
    });
    return data;
}

module.exports = {
    getFormData,
    uploadBase64,
    uploadFile,
    upload
}