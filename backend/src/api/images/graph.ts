import { DefaultImagesUsecases } from './application/images.usecases';
import { DefaultBucketInfra } from './infra/bucket_infra';
import { ImageBucketAdapter } from './repository/image.bucket_adapter';

const bucketInfra = new DefaultBucketInfra();
const imagesBucketAdapter = new ImageBucketAdapter(bucketInfra);

export const imagesUsecases = new DefaultImagesUsecases(imagesBucketAdapter);
