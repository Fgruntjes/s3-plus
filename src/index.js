#!/usr/bin/env node

const { argv } = require('yargs').array('buckets');

const renameBucket = require('./commands/rename-bucket');
const copyBucket = require('./commands/copy-bucket');
const moveBucket = require('./commands/move-bucket');
const deleteBucket = require('./commands/delete-bucket');
const deleteBuckets = require('./commands/delete-buckets');
const listEmptyBuckets = require('./commands/list-empty');
const deleteEmptyBuckets = require('./commands/delete-empty');

const mainCommand = argv._[0];

switch (mainCommand) {
	case 'rename-bucket':
		renameBucket(argv);
		break;
	case 'copy-bucket':
		copyBucket(argv);
		break;
	case 'list-empty':
		listEmptyBuckets();
		break;
	case 'delete-empty':
		deleteEmptyBuckets();
		break;
	case 'delete-bucket':
		deleteBucket(argv);
		break;
	case 'delete-buckets':
		deleteBuckets(argv);
		break;
	case 'move-bucket':
		moveBucket(argv);
		break;
}
