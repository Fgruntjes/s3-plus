const { createBucket, syncBucketMeta, syncBucketObjects } = require('../lib/bucket-utils');

const copyBucket = async (argv) => {
  const fromBucket = argv.from;
  const toBucket = argv.to;

  await createBucket(toBucket);
  await syncBucketMeta(fromBucket, toBucket);
  await syncBucketObjects(fromBucket, toBucket);

  console.log("Copy successful!");
};

module.exports = copyBucket;