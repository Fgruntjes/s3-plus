const yesno = require('yesno');
const { checkIfBucketEmpty, emptyBucket, deleteBucket } = require('../lib/bucket-utils');

const deleteBucketCmd = async (argv) => {
	const { bucket } = argv;

  const isEmpty = await checkIfBucketEmpty(bucket);
  
  if (isEmpty) {
    console.log(`Bucket ${bucket} is empty.`);
  }

	const shouldDelete = isEmpty || await yesno({
		question: `Bucket '${bucket}' is not empty, delete it anyway? (y/n)`
	});

	if (shouldDelete) {
    if (!isEmpty) await emptyBucket(bucket);
		await deleteBucket(bucket);
	} else {
		console.log(`The bucket was not deleted.`);
	}
};

module.exports = deleteBucketCmd;