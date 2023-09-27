import type { User } from './PostsType'

export interface Comment {
    id:                   string;
    body:                 string;
    created_by:           User;
    created_at_formatted: string;
}