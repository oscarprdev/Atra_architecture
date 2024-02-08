/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Project = {
    /**
     * The unique identifier for the project.
     */
    id: string;
    /**
     * The project's title.
     */
    title: string;
    /**
     * The project's description.
     */
    description: string;
    /**
     * The project's year.
     */
    year: number;
    /**
     * Flag of project top.
     */
    isTop: boolean;
    /**
     * The timestamp when the project was created.
     */
    createdAt: string;
    /**
     * The timestamp when the project was updated.
     */
    updatedAt: string;
    mainImage: {
        /**
         * Image key
         */
        Key: string;
        /**
         * The timestamp when the iamge was modified.
         */
        LastModified: string;
        /**
         * Image etag
         */
        ETag: string;
        /**
         * Image size
         */
        Size: number;
        /**
         * Image storage class
         */
        StorageClass: string;
        /**
         * Image type
         */
        Type?: string;
    };
    images: Array<{
        /**
         * Image key
         */
        Key: string;
        /**
         * The timestamp when the iamge was modified.
         */
        LastModified: string;
        /**
         * Image etag
         */
        ETag: string;
        /**
         * Image size
         */
        Size: number;
        /**
         * Image storage class
         */
        StorageClass: string;
        /**
         * Image type
         */
        Type?: string;
    }>;
};

