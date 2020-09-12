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

// awsCli.command('iam list-users').then(function (data) {
// 	console.log('data = ', data.object);
// });

// console.log(argv);

const fromBucket = argv.from;
const toBucket = argv.to;

// console.log(fromBucket, toBucket);

/**
 * Steps:
 * 1. Create new bucket
 * 2. Sync old bucket with new bucket
 * 3. Empty old bucket
 * 4. Delete old bucket
 */

// TODO: perform pre-checks - permissions, does fromBucket exist, are there any Glacier objects, versioning enabled etc.

const s3 = new AWS.S3();

const listBuckets = async () => {
	const loader = ora(`Getting list of all buckets...`).start();

	const data = await s3.listBuckets({}).promise();

	loader.stopAndPersist({
		symbol: '👍',
		text: `Found ${data.Buckets.length} bucket${data.Buckets.length === 1 ? '' : 's'} total.`,
	});

	const bucketNames = data.Buckets.map((bucket) => bucket.Name);
	return bucketNames;
};

const checkIfBucketEmpty = async (bucketName) => {
	const data = await s3.listObjectsV2({ Bucket: bucketName, MaxKeys: 1 }).promise();

	return !Boolean(data.KeyCount);
};

const listEmptyBuckets = async () => {
  const allBuckets = await listBuckets();
  
  const loader = ora(`Checking which of these are empty...`).start();

  const bucketsEmptyMap = await Promise.all(allBuckets.map(checkIfBucketEmpty));
  const emptyBuckets = allBuckets.filter((_, i) => bucketsEmptyMap[i]);
  
	loader.stopAndPersist({
		symbol: '👍',
		text: `Found ${emptyBuckets.length} empty bucket${emptyBuckets.length === 1 ? '' : 's'}.`,
	});

	console.log(`Empty buckets: ${emptyBuckets.join(', ')}`);
};

module.exports = listEmptyBuckets;
