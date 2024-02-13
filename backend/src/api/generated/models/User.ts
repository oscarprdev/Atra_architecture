/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type User = {
    /**
     * The unique identifier for the user.
     */
    id: string;
    /**
     * The user's email.
     */
    email: string;
    /**
     * The user's complete name.
     */
    name: string;
    /**
     * The user's phone number.
     */
    phone: number;
    /**
     * The user's direction.
     */
    direction: string;
    image: {
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
        /**
         * Image name
         */
        name?: string;
    };
    /**
     * The timestamp when the user was created.
     */
    createdAt: string;
};

