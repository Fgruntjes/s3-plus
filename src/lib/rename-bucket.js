// Does not handle updating API calls to bucket, or updating CRR targets, etc.
// Also does not handle objects in Glacier.

const { argv } = require('yargs');
const AWS = require('aws-sdk');
const ora = require('ora');

const profile = argv.profile;
if (profile) {
	AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile });
}

const { accessKeyId, secretAccessKey } = AWS.config.credentials;

const { Aws: AwsWrapper, Options: AwsWrapperOptions } = require('aws-cli-js');
const wrapperOptions = new AwsWrapperOptions(accessKeyId, secretAccessKey);
const awsCli = new AwsWrapper(wrapperOptions);

/**
 * Steps:
 * 1. Create new bucket
 * 2. Sync old bucket with new bucket
 * 3. Empty old bucket
 * 4. Delete old bucket
 */

// TODO: perform pre-checks - permissions, does fromBucket exist, are there any Glacier objects, versioning enabled etc.

const s3 = new AWS.S3();

const createNewBucket = async (toBucket) => {
  const loader = ora(`Creating bucket "${toBucket}"...`).start();

  const data = await s3.createBucket({ Bucket: toBucket }).promise();

  loader.stopAndPersist({
        symbol: '👍',
        text: `Created bucket "${toBucket}".`,
      });
  // console.log(data);
}

const syncToNewBucket = async (fromBucket, toBucket) => {
  const loader = ora(`Synching from bucket "${fromBucket}" to bucket "${toBucket}"...`).start();

  const data = await awsCli.command(`s3 sync s3://${fromBucket} s3://${toBucket}`);

  loader.stopAndPersist({
        symbol: '👍',
        text: `Synched from bucket "${fromBucket}" to bucket "${toBucket}".`,
      });
  // console.log(data);
}

const emptyOldBucket = async (fromBucket) => {
  const loader = ora(`Emptying bucket "${fromBucket}"...`).start();

  const data = await awsCli.command(`s3 rm s3://${fromBucket} --recursive`);

  loader.stopAndPersist({
        symbol: '👍',
        text: `Emptied bucket "${fromBucket}".`,
      });
  // console.log(data);
}

const deleteOldBucket = async (fromBucket) => {
  const loader = ora(`Deleting bucket "${fromBucket}"...`).start();

  const data = await s3.deleteBucket({ Bucket: fromBucket }).promise();

  loader.stopAndPersist({
        symbol: '👍',
        text: `Deleted bucket "${fromBucket}".`,
      });
  // console.log(data);
}

const renameBucket = async (argv) => {
  const fromBucket = argv.from;
  const toBucket = argv.to;

  await createNewBucket(toBucket);
  await syncToNewBucket(fromBucket, toBucket);
  await emptyOldBucket(fromBucket);
  await deleteOldBucket(fromBucket);
};

module.exports = renameBucket;