# S3 Plus

## Installation

Currently, you can clone this repo and run locally with `npm start`. S3 Plus is not yet published, as it is a WIP with various issues needing to be ironed out. Once it is published, you will be able to install with:

`npm i -g s3-plus`

The `s3-plus` command will then become available for you to use.

You must also have the AWS CLI installed and credentials set up for this software to work.

## What can this do?

Many things that are not possible from the AWS CLI or console!

* Rename buckets
* Move buckets between regions
* Make point-in-time copies of buckets
* Delete buckets, even if they aren't empty (you will be asked to confirm!)
* Delete many buckets at once
* List all the empty buckets in your account
* Clean up account by deleting empty buckets

Disclaimer: use at your own risk! No responsibility is taken for lost, corrupted or otherwise damaged data, unexpected charges, or undesired impacts on your AWS account. Please read all notes and disclaimers on each of the commands to see how they work and their limitations. If in doubt, consult the source code, test on unimportant data before using in production, or do not use this software.

## Usage

### Rename bucket

`s3-plus rename-bucket --from my-old-bucket --to my-new-bucket`

Please note:
* The 'to' bucket name must not be taken, and the bucket must not yet exist.
* The 'from' bucket must be a bucket in your account that your credentials permit full read access to.
* This command performs a copy/sync under the hood, and may take some time for buckets with many or large objects.
* Any references to the old bucket in your code will break. If this is important, perform a bucket copy instead, update bucket references and then delete the old bucket yourself.

#### Limitations

This command supports copying the following bucket settings:
* Bucket policies, including policies to make the bucket public - references to the old bucket name in the policy will be replaced with the new bucket name.
* Bucket default encryption settings (SSE-S3 and SSE-KMS).

This command is untested on buckets with the following, and may produce unexpected results:
* Bucket ACLs
* Versioning enabled
* Objects stored in Glacier or Glacier Deep Archive
* Cross-account access
* Many existing references to the bucket in application code
* Lifecycle rules
* Gateway endpoints
* Cross-Region or Same-Region Replication
* Other miscellaneous settings - S3 website hosting, server access logging, requester pays, etc.

These features are not yet supported, but if one is particularly important to you, please feel free to create an issue or pull request. Some are not possible due to AWS architecture - for example, S3 buckets with customer-managed encryption.

### List all empty buckets in account

`s3-plus list-empty`

This command lists all empty buckets in your account.

### Delete all empty buckets in account

`s3-plus delete-empty`

This command deletes all empty buckets in your account. You will be given a list of empty buckets and asked to confirm the deletion.

### Copy bucket

`s3-plus copy-bucket --from my-old-bucket --to my-new-bucket`

This command creates a new bucket `my-new-bucket` and copies all objects from 'my-old-bucket' over to it.

You can select the region for the bucket copy with the `--new-region` parameter:

`s3-plus copy-bucket --from my-old-bucket --to my-new-bucket --new-region eu-west-1`

The `--new-region` parameter also works with the `rename-bucket` command.

Otherwise, the region of the source bucket will be used.

Please note:
* The 'to' bucket name must not be taken, and the bucket must not yet exist.
* The 'from' bucket must be a bucket in your account that your credentials permit full read access to.
* This command may take some time for buckets with many or large objects.
* This creates a point-in-time copy; any object changes after this point will not be copied.

#### Limitations

This command has the same limitations as `rename-bucket`, see above.

### Move bucket between regions

`s3-plus move-bucket --bucket bucket-to-move --new-region eu-west-2`

This command moves the bucket `bucket-to-move` to the eu-west-2 (London) region.

**Important note about moving buckets**: this process can take up to several hours, as AWS must free the bucket name globally.

The move-bucket command works like this under the hood:
* First, a new, temporary bucket is created in the target region with a randomised name.
* Data and settings from the origin bucket are synced to the temporary bucket.
* The origin bucket is deleted, freeing its name.
* The target bucket is created **with the same name as the original bucket**, which may take several minutes to several hours due to AWS propagation delay in freeing the original bucket name.
* The data and settings are synced from the temporary bucket to the final, target bucket with the correct name in the new region.
* The temporary bucket is deleted.

**Advice:** this command should only be used when the bucket needs to be moved to a different region but retain its exact name. In all other cases, the following is *much faster*:

`s3-plus rename-bucket --from original-bucket-name --to different-bucket-name --new-region eu-west-2`

#### Limitations

This command has the same limitations as `rename-bucket`, see above.

### Delete bucket, even if not empty

`s3-plus delete-bucket --bucket bucket-to-delete`

This command deletes the bucket `bucket-to-delete`. If it is non-empty, you will be asked to confirm the deletion.

### Bulk delete buckets (coming soon)

`s3-plus delete-buckets --buckets bucket-1 bucket-2 bucket-3`

This command deletes the three buckets listed above. If any are non-empty, you will be asked to confirm the deletion for each non-empty bucket.

## Known issues

This is an unstable work in progress and should not be used outside of experimental settings.

Some known issues are:
* Does not handle errors gracefully, such as non-existent source buckets for rename and copy commands.
* Lacking support for various S3 bucket features such as CRR, versioning, encryption etc.
* Many more...