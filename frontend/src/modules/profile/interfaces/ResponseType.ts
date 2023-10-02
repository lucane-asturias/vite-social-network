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

export interface Post {
    id:                   string;
    body:                 string;
    likes_count:          number;
    comments_count:       number;
    created_by:           User;
    created_at_formatted: string;
    attachments?:         Attachment[];
}

export interface ResponseType {
  users: User[];
  posts: Post[];
  can_send_friendship_request: boolean;
}