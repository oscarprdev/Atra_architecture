import { _Object } from '@aws-sdk/client-s3';
import { File } from '../../generated';

export const mapBucketImageToApp = (bucketImage: _Object | undefined): File => {
	if (bucketImage && bucketImage.Key && bucketImage.ETag && bucketImage.Size && bucketImage.StorageClass && bucketImage.LastModified) {
		return {
			Key: bucketImage.Key,
			ETag: bucketImage.ETag,
			Size: bucketImage.Size,
			StorageClass: bucketImage.StorageClass,
			LastModified: bucketImage.LastModified.toString(),
			Type: '',
		};
	} else {
		throw new Error(JSON.stringify({ status: 500, message: 'Bucket Image file is undefined' }));
	}
};
