const { createBucket, syncBuckets } = require('../lib/bucket-utils');

const copyBucket = async (argv) => {
  const fromBucket = argv.from;
  const toBucket = argv.to;

  await createBucket(toBucket);
  await syncBuckets(fromBucket, toBucket);

  console.log("Copy successful!");
};

module.exports = copyBucket;