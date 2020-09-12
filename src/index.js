const { argv } = require('yargs');

const renameBucket = require('./lib/rename-bucket');
const listEmptyBuckets = require("./lib/list-empty");
const deleteEmptyBuckets = require("./lib/delete-empty");

const mainCommand = argv._[0];

switch (mainCommand) {
  case "rename-bucket": renameBucket(argv); break;
  case "list-empty": listEmpty(); break;
  case "delete-empty": deleteEmptyBuckets(); break;
}