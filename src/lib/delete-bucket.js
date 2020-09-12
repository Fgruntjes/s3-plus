const { argv } = require('yargs');
const AWS = require('aws-sdk');
const ora = require('ora');
const listEmptyBuckets = require('./list-empty');
const yesno = require('yesno');

const profile = argv.profile;
if (profile) {
	AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile });
}

// TODO: perform pre-checks - permissions, etc

const s3 = new AWS.S3();

const deleteBuckets = async (buckets) => {
	const loader = ora(`Deleting ${buckets.length} bucket${buckets.length === 1 ? '' : 's'}...`).start();

	await Promise.all(buckets.map(bucket => s3.deleteBucket({ Bucket: bucket }).promise()));

	loader.stopAndPersist({
		symbol: '👍',
		text: `Deleted ${buckets.length} empty bucket${buckets.length === 1 ? '' : 's'}.`,
	});
}

const deleteEmptyBuckets = async () => {
  const emptyBuckets = await listEmptyBuckets();
  
	const shouldDelete = await yesno({
		question: `Delete ${emptyBuckets.length === 1 ? 'this bucket' : 'these buckets'}? (y/n)`
	});

	if (shouldDelete) {
		await deleteBuckets(emptyBuckets);
	} else {
		console.log(`The ${emptyBuckets.length === 1 ? 'bucket was' : 'buckets were'} not deleted.`);
	}
};

module.exports = deleteEmptyBuckets;
