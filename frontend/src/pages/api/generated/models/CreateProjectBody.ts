/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateProjectBody = {
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
    mainImage: Blob;
    images: Array<Blob>;
};

