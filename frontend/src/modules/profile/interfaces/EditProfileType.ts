export interface EditProfileType {
    message: string;
    user:    User;
}

export interface User {
    id:            string;
    name:          string;
    email:         string;
    friends_count: number;
    posts_count:   number;
    get_avatar:    string;
}