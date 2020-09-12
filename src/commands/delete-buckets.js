const deleteBucket = require('./delete-bucket');

const deleteBuckets = async (argv) => {
	const { buckets } = argv;

	for (bucket of buckets) {
		await deleteBucket({ bucket });
	}
};

module.exports = deleteBuckets;