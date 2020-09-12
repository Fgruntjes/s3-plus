const { createBucket, syncBucketMeta, syncBucketObjects, getBucketRegion } = require('../lib/bucket-utils');

const copyBucket = async (options, standalone=true) => {
  const fromBucket = options.from;
  const toBucket = options.to;

  const region = options.region || await getBucketRegion(fromBucket);
  await createBucket(toBucket, region);

  await syncBucketMeta(fromBucket, toBucket);
  await syncBucketObjects(fromBucket, toBucket);

  if (standalone) console.log("Copy successful!");
};

module.exports = copyBucket;