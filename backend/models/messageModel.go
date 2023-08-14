package models

type Message struct {
	ID       int    `json:"id" bson:"id"`
	Message  string `json:"text" bson:"text"`
	Username string `json:"username" bson:"username"`
	Upvote   int    `json:"upvote" bson:"upvote"`
	Downvote int    `json:"downvote" bson:"downvote"`
}
