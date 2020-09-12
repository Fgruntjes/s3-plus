const ora = require('ora');
const { listBuckets, checkIfBucketEmpty } = require("../lib/bucket-utils");

// TODO: perform pre-checks - permissions, etc

const listEmptyBuckets = async () => {
  const allBuckets = await listBuckets();
  
  const loader = ora(`Checking which of these are empty...`).start();

  const bucketsEmptyMap = await Promise.all(allBuckets.map(checkIfBucketEmpty));
  const emptyBuckets = allBuckets.filter((_, i) => bucketsEmptyMap[i]);
  
	loader.stopAndPersist({
		symbol: '👍',
		text: `Found ${emptyBuckets.length} empty bucket${emptyBuckets.length === 1 ? '' : 's'}.`,
	});

  console.log(`Empty buckets: ${emptyBuckets.join(', ')}`);
  
  return emptyBuckets;
};

module.exports = listEmptyBuckets;
