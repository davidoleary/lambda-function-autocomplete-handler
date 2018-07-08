## Setup
npm install
npm install serverless -g
Make sure you can connect to AWS.

## Run
- serverless invoke local --function search
- serverless invoke local --function search --path test/events/event_mens_en_denis.json
- serverless invoke local --function search --path test/events/event_womens_ko_gucci_ko_term.json
- serverless invoke local --function search --path test/events/event_womens_en_black_dress.json
- SEE /test/events for other examples that can be run

### Dev Notes
This is a serverless function https://serverless.com/
The invoke example above when run will query against redis on AWS
The redis db is populated populated by a lambda which imports json files exported to a s3 bucket by hybris.
This serverless function is readonly.

### How to debug?
### How to deploy?
Initially you can generate a package. Long term we should be using CI deploy the code.
1. serveless package --package [path] --> creates zip package that can be released.
2. Connect to our S3 bucket via CyberDuck
3. Create a folder for the build
4. Copy the zip from the package created in step 2

### How to view specific data from service
// TODO: implement test case to aid viewing redis values
// 1. list all keys in redis
const result = await model.getAllKeys(keys);
console.log(result)

// 2. get the value of a specific key
const result = await model.getMultiple([{ name: 'autocomplete_designers-data_en_womens' }]);
console.log(result)

### Redis hosts
Production: search-cache.XXXXXXXX.0001.euw1.cache.amazonaws.com
Test/Dev: search-cache.ZZZZZZZZ.0001.euw1.cache.amazonaws.com
