* Perform permissions check at start of each command
* Handle exceptions gracefully
* Add unit tests
* Add integration tests
* Copy bucket ACL when copying/moving bucket
* Copy lifecycle rules when copying/moving bucket
* Support versioning when copying/moving bucket
* Cancel or force-copy when bucket contains objects in Glacier storage class
* Copy CRR and SRR rules when copying/moving bucket
* Refactor CLI to use Commander: https://www.npmjs.com/package/commander
* Refactor into TypeScript