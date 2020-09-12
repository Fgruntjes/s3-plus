const { argv } = require('yargs');

const renameBucket = require('./commands/rename-bucket');
const copyBucket = require('./commands/copy-bucket');
const deleteBucket = require('./commands/delete-bucket');
const listEmptyBuckets = require("./commands/list-empty");
const deleteEmptyBuckets = require("./commands/delete-empty");

const mainCommand = argv._[0];

switch (mainCommand) {
  case "rename-bucket": renameBucket(argv); break;
  case "copy-bucket": copyBucket(argv); break;
  case "list-empty": listEmptyBuckets(); break;
  case "delete-empty": deleteEmptyBuckets(); break;
  case "delete-bucket": deleteBucket(argv); break;
}