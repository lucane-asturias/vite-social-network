export interface RequestType {
    user:     User;
    friends?:  User[];
    requests?: Request[];
}

export interface User {
    id:            string;
    name:          string;
    email:         string;
    friends_count?: number;
}

export interface Request {
    id:         string;
    created_by: User;
}