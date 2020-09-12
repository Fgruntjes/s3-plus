const { v4: uuidv4 } = require('uuid');
const renameBucket = require('./rename-bucket');
const yesno = require('yesno');

const moveBucket = async (argv) => {
	if (
		!(await yesno({
			question:
				'Moving buckets between regions may take some time (usually a few minutes, occasionally up to a few hours), as we need to wait for AWS to free the bucket name globally. This is NOT recommended for buckets that are currently in use. Do you understand and wish to proceed anyway? (y/n)',
		}))
	)
		return;

	const { bucket, newRegion } = argv;

	const tempBucketName = bucket.slice(0, 20) + '-temp-' + uuidv4();

	await renameBucket({ from: bucket, to: tempBucketName, region: newRegion });

	await renameBucket({ from: tempBucketName, to: bucket });
};

module.exports = moveBucket;
