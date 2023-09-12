export interface CreatedBy {
  id:    string;
  name:  string;
  email: string;
}

export interface PostsType {
  id:                   string;
  body:                 string;
  created_by:           CreatedBy;
  created_at_formatted: string;
  likes_count?:          number;
}