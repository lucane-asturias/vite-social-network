import type { Comment } from './CommentsType'

export interface User {
    id:            string;
    name:          string;
    email:         string;
    friends_count: number;
    posts_count:   number;
    get_avatar:    string;
}

export interface Attachment {
    id:        string;
    get_image: string;
}

export interface PostType {
    id:                   string;
    body:                 string;
    likes_count:          number;
    comments_count:       number;
    created_by:           User;
    created_at_formatted: string;
    attachments?:         Attachment[];
    comments?:            Comment[];
}
