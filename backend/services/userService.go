package services

import (
	"backend/models"
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	CreateUser(*models.User) error
	GetUser(*string) (*models.User, error)
	GetAll() ([]*models.User, error)
	UpdateUser(*models.User) error
	DeleteUser(*string) error
	LoginUser(*models.User) error
}

type UserServiceImplementaion struct {
	ctx            context.Context
	userCollection *mongo.Collection
}

func NewUserService(ctx context.Context, userCollection *mongo.Collection) UserService {
	return &UserServiceImplementaion{
		ctx:            ctx,
		userCollection: userCollection,
	}
}

func (u *UserServiceImplementaion) CreateUser(user *models.User) error {
	password := user.Password
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return errors.New("not able to hash password")
	}
	hashedpassword := string(bytes)
	user.Password = hashedpassword
	_, err = u.userCollection.InsertOne(u.ctx, user)
	return err
}

func (u *UserServiceImplementaion) GetUser(username *string) (*models.User, error) {
	var user *models.User
	filter := bson.D{bson.E{
		Key:   "username",
		Value: username,
	}}
	err := u.userCollection.FindOne(u.ctx, filter).Decode(&user)
	return user, err
}

func (u *UserServiceImplementaion) GetAll() ([]*models.User, error) {
	var users []*models.User
	cursor, err := u.userCollection.Find(u.ctx, bson.D{{}})
	if err != nil {
		return nil, err
	}
	for cursor.Next(u.ctx) {
		var user models.User
		err := cursor.Decode(&user)
		if err != nil {
			return nil, err
		}
		users = append(users, &user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	cursor.Close(u.ctx)

	if len(users) == 0 {
		return nil, errors.New("users not found")
	}

	return users, nil
}

func (u *UserServiceImplementaion) UpdateUser(user *models.User) error {
	password := user.Password
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return errors.New("not able to hash password")
	}
	hashedpassword := string(bytes)
	user.Password = hashedpassword
	filter := bson.D{bson.E{
		Key:   "username",
		Value: user.Username,
	}}
	update := bson.D{bson.E{
		Key: "$set",
		Value: bson.D{
			bson.E{
				Key:   "username",
				Value: user.Username,
			},
			bson.E{
				Key:   "password",
				Value: user.Password,
			},
		},
	}}
	_ = u.userCollection.FindOneAndUpdate(u.ctx, filter, update)
	return nil
}

func (u *UserServiceImplementaion) DeleteUser(username *string) error {
	filter := bson.D{bson.E{
		Key:   "username",
		Value: username,
	}}
	result, _ := u.userCollection.DeleteOne(u.ctx, filter)
	if result.DeletedCount != 1 {
		return errors.New("no user found")
	}
	return nil
}

func (u *UserServiceImplementaion) LoginUser(user *models.User) error {
	var queryUser *models.User
	filter := bson.D{bson.E{
		Key:   "username",
		Value: user.Username,
	}}
	err := u.userCollection.FindOne(u.ctx, filter).Decode(&queryUser)
	if err != nil {
		return errors.New("username Password not matched")
	}
	err = bcrypt.CompareHashAndPassword([]byte(queryUser.Password), []byte(user.Password))
	return err
}
