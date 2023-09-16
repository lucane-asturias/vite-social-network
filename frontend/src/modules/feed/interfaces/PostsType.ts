export interface PostsType {
    id:                   string;
    body:                 string;
    likes_count?:          number;
    comments_count?:       number;
    created_by:           CreatedBy;
    created_at_formatted: string;
    comments?:             Comment[];
}

export interface Comment {
    id:                   string;
    body:                 string;
    created_by:           CreatedBy;
    created_at_formatted: string;
}

export interface CreatedBy {
    id:            string;
    name:          string;
    email:         string;
    friends_count: number;
}