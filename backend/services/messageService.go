package services

import (
	"backend/models"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type MessageService interface {
	CreateMessage(*models.Message) error
	GetAll() ([]*models.Message, error)
	UpVote(int) error
	DownVote(int) error
}

type MessageServiceImplementation struct {
	ctx               context.Context
	messageCollection *mongo.Collection
}

func NewMessageService(ctx context.Context, messageCollection *mongo.Collection) MessageService {
	return &MessageServiceImplementation{
		ctx:               ctx,
		messageCollection: messageCollection,
	}
}

func (m *MessageServiceImplementation) CreateMessage(message *models.Message) error {
	_, err := m.messageCollection.InsertOne(m.ctx, message)
	return err
}

func (m *MessageServiceImplementation) GetAll() ([]*models.Message, error) {
	var messages []*models.Message
	cursor, err := m.messageCollection.Find(m.ctx, bson.D{{}})
	if err != nil {
		return nil, err
	}
	for cursor.Next(m.ctx) {
		var message models.Message
		err := cursor.Decode(&message)
		if err != nil {
			return nil, err
		}
		messages = append(messages, &message)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	cursor.Close(m.ctx)

	if len(messages) == 0 {
		return []*models.Message{}, nil
	}

	return messages, nil
}

func (m *MessageServiceImplementation) UpVote(msg_id int) error {
	filter := bson.D{{Key: "id", Value: msg_id}}
	update := bson.D{{Key: "$inc", Value: bson.D{{Key: "upvote", Value: 1}}}}
	_ = m.messageCollection.FindOneAndUpdate(m.ctx, filter, update)
	return nil
}

func (m *MessageServiceImplementation) DownVote(msg_id int) error {
	filter := bson.D{{Key: "id", Value: msg_id}}
	update := bson.D{{Key: "$inc", Value: bson.D{{Key: "downvote", Value: 1}}}}
	_ = m.messageCollection.FindOneAndUpdate(m.ctx, filter, update)
	return nil
}
