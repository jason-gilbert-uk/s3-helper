# s3-helper
 A selection of helper functions when working with S3

## createS3BucketIfDoesntExist(bucketName)
Checks to see if the bucket already exists. If it doesn't then creates it. Returns true if bucket was created, false otherwise.
```
const {createS3BucketIfDoesntExist} = require('@jasongilbertuk/s3-helper)
const result = await createS3BucketIfDoesntExist('myBucketName');
```
## createS3Bucket(bucketName)
Creates the named s3 bucket. Returns true if bucket created, false otherwise.
```
const {createS3Bucket} = require('@jasongilbertuk/s3-helper)
const result = await createS3Bucket('myBucketName');
```
## deleteS3Bucket(bucketName)
```
const {deleteS3Bucket} = require('@jasongilbertuk/s3-helper)
const result = await deleteS3Bucket('myBucketName');
```
## generateDateTimeFileName(extension='.json')
Uses current date and time to generate a unique filename in the form YYYYMMDD-HHMMSS.extension.
Return value = filename. Extension can be passed as an optional parameter, by default it is .json
```
const {generateDateTimeFilename} = require('@jasongilbertuk/s3-helper)
const fileName = generateDateTimeFilename();
//Filename will be YYYYMMDD-HHMMSS.json
```
## writeObjectToS3(bucketName,fileName,object)
Writes JSON object to the named file in the named s3 bucket. Returns JSON object in the form {bucket: bucketName, file: fileName}. If unsuccessful, throws error.
```
const {writeObjectToS3} = require('@jasongilbertuk/s3-helper)
const obj = {name: "this is a test"}
const result = await writeObjectToS3("myBucketName","myFileName",obj))
```
## readObjectFromS3(bucketName,fileName)
Reads and returns a JSON object from the named file in the named s3 bucket
```
const {readObjectFromS3} = require('@jasongilbertuk/s3-helper)
const result = readObjectFromS3("myBucketName","myFileName");
```
