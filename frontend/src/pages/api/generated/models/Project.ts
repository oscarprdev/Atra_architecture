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
	/**
	 * The main image url.
	 */
	mainImage: string;
	images: Array<string>;
};
