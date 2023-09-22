export interface TrendPostType {
    id:                   string;
    body:                 string;
    likes_count:          number;
    comments_count:       number;
    created_by:           CreatedBy;
    created_at_formatted: string;
}

export interface CreatedBy {
    id:            string;
    name:          string;
    email:         string;
    friends_count: number;
    posts_count:   number;
    get_avatar:    string;
}