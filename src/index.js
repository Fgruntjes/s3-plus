const { argv } = require('yargs');

const renameBucket = require('./lib/rename-bucket');
const listEmpty = require("./lib/list-empty");

const mainCommand = argv._[0];

switch (mainCommand) {
  case "rename-bucket": renameBucket(argv); break;
  case "list-empty": listEmpty(); break;
}