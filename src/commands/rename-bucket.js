const copyBucket = require('./copy-bucket');
const { emptyBucket, deleteBucket } = require('../lib/bucket-utils');

const renameBucket = async (argv) => {
  await copyBucket(argv, false);

  const fromBucket = argv.from;

  await emptyBucket(fromBucket);
  await deleteBucket(fromBucket);

  console.log("Rename successful!");
};

module.exports = renameBucket;