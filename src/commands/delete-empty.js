const listEmptyBuckets = require('./list-empty');
const yesno = require('yesno');
const { deleteBuckets } = require("../lib/bucket-utils");

const deleteEmptyBuckets = async () => {
	const emptyBuckets = await listEmptyBuckets();

	const shouldDelete = await yesno({
		question: `Delete ${emptyBuckets.length === 1 ? 'this bucket' : 'these buckets'}? (y/n)`,
	});

	if (shouldDelete) {
		await deleteBuckets(emptyBuckets);
	} else {
		console.log(`The ${emptyBuckets.length === 1 ? 'bucket was' : 'buckets were'} not deleted.`);
	}
};

module.exports = deleteEmptyBuckets;
