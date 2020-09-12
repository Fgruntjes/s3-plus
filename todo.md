* Support copying buckets
* Support deleting non-empty buckets
* Support bulk deleting buckets
* Publish package
* Better error handling (+ make this point more specific)
* Perform permissions check at start of each command
* Refactor CLI to use Commander: https://www.npmjs.com/package/commander
* Refactor into TypeScript
* Copy bucket policy when copying/moving bucket
* Copy bucket ACL when copying/moving bucket
* Copy SSE-S3 encryption when copying/moving bucket
* Copy SSE-KMS encryption when copying/moving bucket
* Copy lifecycle rules when copying/moving bucket
* Support versioning when copying/moving bucket
* Cancel when bucket contains objects in Glacier
* Copy CRR and SRR rules when copying/moving bucket