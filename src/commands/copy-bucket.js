const { createBucket, syncBucketMeta, syncBucketObjects } = require('../lib/bucket-utils');

const copyBucket = async (argv, standalone=true) => {
  const fromBucket = argv.from;
  const toBucket = argv.to;

  await createBucket(toBucket);
  await syncBucketMeta(fromBucket, toBucket);
  await syncBucketObjects(fromBucket, toBucket);

  if (standalone) console.log("Copy successful!");
};

module.exports = copyBucket;