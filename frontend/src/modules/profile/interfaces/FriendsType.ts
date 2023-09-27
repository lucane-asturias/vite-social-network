export interface User {
    id:            string;
    name:          string;
    email:         string;
    friends_count: number;
    posts_count:   number;
    get_avatar:    string;
}

export interface FriendRequest {
    id:         string;
    created_by: User;
}

export interface RequestType {
    user:     User;
    friends?:  User[];
    requests?: FriendRequest[];
}
