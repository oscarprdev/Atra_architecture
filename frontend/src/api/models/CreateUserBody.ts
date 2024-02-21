/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateUserBody = {
	/**
	 * Email.
	 */
	email: string;
	/**
	 * Password.
	 */
	password: string;
	/**
	 * User name.
	 */
	name: string;
	/**
	 * Direction.
	 */
	direction: string;
	/**
	 * Description.
	 */
	description: string;
	/**
	 * Phone number.
	 */
	phone: number;
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
};
