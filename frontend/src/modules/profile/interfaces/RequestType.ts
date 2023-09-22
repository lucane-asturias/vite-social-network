export interface RequestType {
    user:     User;
    friends?:  User[];
    requests?: Request[];
}

export interface User {
    id:             string;
    name:           string;
    email:          string;
    friends_count:  number;
    get_avatar:     string;
}

export interface Request {
    id:         string;
    created_by: User;
}