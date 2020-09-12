const copyBucket = require('./copy-bucket');

const renameBucket = async (argv) => {
  await copyBucket(argv);

  const fromBucket = argv.from;

  await emptyBucket(fromBucket);
  await deleteBucket(fromBucket);
};

module.exports = renameBucket;