export interface ConversationsType {
  id:                    string
  users:                 User[]
  modified_at_formatted: string
}

export interface User {
  id:            string
  name:          string
  email:         string
  friends_count: number
}

export interface MessagesType {
  id:                    string
  users:                 string[]
  modified_at_formatted: string
  messages?:              MessageSentType[]
}

export interface MessageSentType {
  id:                   string
  body:                 string
  sent_to:              User
  created_by:           User
  created_at_formatted: string
}
