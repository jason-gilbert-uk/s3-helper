const AWS = require('aws-sdk')
AWS.config.update({region:'eu-west-1'});
const S3 = new AWS.S3({apiVersion: '2006-03-01'});

//----------------------------------------------------------------------------
// function: checkBucketExists(bucketName)
// returns true if bucket exists, false if it doesnt
// throws exception if any unexpected errors encountered
//----------------------------------------------------------------------------
async function checkBucketExists(bucketName) { 
  const s3 = new AWS.S3();
  const options = {
    Bucket: bucketName
  };
  try {
    await s3.headBucket(options).promise();
    //if the above call succeeds, the bucket exists
    return true;   
   } catch (error) {
    //if the above throws a 404 exception, the the bucket doesn't exist
     if (error.statusCode === 404) {
      return false;
    }
    //if a non 404 exception is thrown, it's a real error and should be 
    //propogated up to the caller.
    throw error;
  }
};

//----------------------------------------------------------------------------
// function: createS3Bucket(bucketName)
// creates the named s3 bucket
// returns true if bucket created, false otherwise.
//----------------------------------------------------------------------------
async function createS3Bucket(bucketName) {
    var bucketParams = {
        Bucket : bucketName
    };
      
    try {
        var result = await S3.createBucket(bucketParams).promise();
        return true;
    } catch (err) {
        console.log("Error", err);
        return false;
    }
}

//----------------------------------------------------------------------------
// function: createS3BucketIfDoesntExist(bucketName)
// checks to see if the bucket already exists. If it doesn't then creates it.
// returns true if bucket was created, false otherwise.
//----------------------------------------------------------------------------
async function createS3BucketIfDoesntExist(bucketName) {
    if (await checkBucketExists(bucketName)) {
        return false;
    } else {
        await createS3Bucket(bucketName);
        return true;
    }
}

//----------------------------------------------------------------------------
// function: generateDateTimeFileName(extension='.json') 
// Uses current date and time to generate a unique filename in the form
// YYYYMMDD-HHMMSS.extension.
// return value = filename.
// extension can be passed as an optional parameter, by default it's .json
//----------------------------------------------------------------------------
function generateDateTimeFileName(extension='.json') {
    const date = new Date();
    // 1e4 gives us the the other digits to be filled later, so 20210000.
    const year = date.getFullYear() * 1e4; 
    // months are numbered 0-11 in JavaScript, * 100 to move 
    // two digits to the left. 20210011 => 20211100
    const month = (date.getMonth() + 1) * 100; 
    const day = date.getDate(); 
    // 20211100 => 20211124
    // `+ ''` to convert to string from number, 20211124 => "20211124"
    const result = year + month + day + '' 

    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds();
    if (hours < 10) {
        hours = "0"+hours;
    }
    if (minutes < 10) {
        minutes = "0"+minutes
    }
    if (seconds < 10) {
        seconds = "0"+seconds
    }

    var nameOfFile = result +"-"+hours+minutes+seconds+extension;
    return nameOfFile;
}

//----------------------------------------------------------------------------
// function: readObjectFromS3(bucketName,fileName)
// NOTE: file must contain a JSON object.
// Reads and returns a JSON object from the named file in the named s3 bucket
//----------------------------------------------------------------------------
async function readObjectFromS3(bucketName,fileName) {
    var params = {
        Bucket : bucketName,
        Key : fileName,
    }
    try {
        var result = await S3.getObject(params).promise();
        var messages = JSON.parse(result.Body.toString('utf-8'));
        return messages;

    } catch (err) {
        console.log('error in s3-helper.readObjectFromS3 : ',err)
        throw err;
    }
}

//----------------------------------------------------------------------------
// function: writeObjectFromS3(bucketName,fileName,object)
// NOTE: Object supplied must be a JSON object.
// Writes JSON object to the named file in the named s3 bucket
// returns JSON object in the form {bucket: bucketName, file: fileName}
// If unsuccessful, throws error.
//----------------------------------------------------------------------------
async function writeObjectToS3(s3BucketName,fileName,obj) {
    var params = {
        Bucket : s3BucketName,
        Key : fileName,
        Body : JSON.stringify(obj)
    }
    try {
        var result = await S3.putObject(params).promise();
        return {bucket: s3BucketName,file: fileName};

    } catch (err) {
        console.log('error in s3-helper.writeObjectToS3 :',err)
        throw err;
    }
}

//----------------------------------------------------------------------------
// function: deleteS3Bucket(bucketName)
// Deletes the named s3 bucket.
// returns true if bucket deleted, false id bucket didnt exist.
// throws error on any other failure.
//----------------------------------------------------------------------------
async function deleteS3Bucket(bucketName) {
    var bucketParams = {
        Bucket : bucketName
    };
      
    // call S3 to create the bucket
    try {
        var result = await S3.deleteBucket(bucketParams).promise();
        console.log('S3 Bucket deleted : ',bucketName)
        return true;
    } catch (err) {
        if (err.code !== 'NoSuchBucket') {
            console.log("Error", err);
            return false;
        }
        console.log('error in s3-helper.deleteS3Bucket :',err)
        throw err
    }
}


exports.createS3BucketIfDoesntExist = createS3BucketIfDoesntExist;
exports.createS3Bucket = createS3Bucket;
exports.deleteS3Bucket = deleteS3Bucket;
exports.generateDateTimeFileName = generateDateTimeFileName;
exports.writeObjectToS3 = writeObjectToS3;
exports.readObjectFromS3 = readObjectFromS3
