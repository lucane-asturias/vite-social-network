export interface User {
  id:    string
  name:  string
  email: string
}

export interface Post {
  id:                   string
  body:                 string
  created_by:           User
  created_at_formatted: string
}

export interface ResponseType {
  users: User[]
  posts: Post[]
}