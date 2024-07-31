export enum Sorting {
    DATE = "date",
    NAME = "name",
    AUTHOR_NAME = "author",
}

export enum Filtering {
    // The name need to be the same as in dirModelSlice
    STATUS = "status",
    FAVORITE = "favorite"
}

export enum Status {
    IN_PROGRESS = "IN_PROGRESS",
    PUBLISHED = "PUBLISHED",
    UNPUBLISHED = "UNPUBLISHED",
}

export const DisplayStatus = Object.freeze({
    IN_PROGRESS: "in Arbeit",
    PUBLISHED: "veröffentlich",
    UNPUBLISHED: "unveröffentlich"
})
