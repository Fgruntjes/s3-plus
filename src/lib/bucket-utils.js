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

const s3 = new AWS.S3();

const createBucket = async (toBucket) => {
	const loader = ora(`Creating bucket "${toBucket}"...`).start();

	const data = await s3.createBucket({ Bucket: toBucket }).promise();

	loader.stopAndPersist({
		symbol: '👍',
		text: `Created bucket "${toBucket}".`,
	});
	// console.log(data);
};

const syncBuckets = async (fromBucket, toBucket) => {
	const loader = ora(`Synching from bucket "${fromBucket}" to bucket "${toBucket}"...`).start();

	const data = await awsCli.command(`s3 sync s3://${fromBucket} s3://${toBucket}`);

	loader.stopAndPersist({
		symbol: '👍',
		text: `Synched from bucket "${fromBucket}" to bucket "${toBucket}".`,
	});
	// console.log(data);
};

const emptyBucket = async (bucket) => {
	const loader = ora(`Emptying bucket "${bucket}"...`).start();

	const data = await awsCli.command(`s3 rm s3://${bucket} --recursive`);

	loader.stopAndPersist({
		symbol: '👍',
		text: `Emptied bucket "${bucket}".`,
	});
	// console.log(data);
};

const deleteBuckets = async (buckets) => {
	const loader = ora(`Deleting ${buckets.length} empty bucket${buckets.length === 1 ? '' : 's'}...`).start();

	const data = await Promise.all(buckets.map(bucket => s3.deleteBucket({ Bucket: bucket }).promise()));

	loader.stopAndPersist({
		symbol: '👍',
		text: `Deleted ${buckets.length} empty bucket${buckets.length === 1 ? '' : 's'}.`,
	});
	// console.log(data);
};

const deleteBucket = async (bucket) => {
	const loader = ora(`Deleting bucket "${bucket}"...`).start();

	const data = await s3.deleteBucket({ Bucket: bucket }).promise();

	loader.stopAndPersist({
		symbol: '👍',
		text: `Deleted bucket "${bucket}".`,
	});
	// console.log(data);
};

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

module.exports = {
	createBucket,
	syncBuckets,
	emptyBucket,
	deleteBucket,
	deleteBuckets,
	listBuckets,
	checkIfBucketEmpty,
};
