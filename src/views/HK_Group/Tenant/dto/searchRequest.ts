export interface SearchRequest extends PagedAndSortedResultRequestDto {
    Keyword?: string;
    Descending?: boolean;
}

export interface PagedAndSortedResultRequestDto {
    MaxResultCount: number;
    SkipCount: number;
}