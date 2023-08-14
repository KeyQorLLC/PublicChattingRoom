package main

import (
	"backend/bootstrap"
	"backend/controllers"
	"backend/services"
	"context"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	var ctx = context.TODO()

	client := bootstrap.ConnectDB()
	defer client.Disconnect(ctx)

	router := gin.Default()
	router.Use(cors.Default())

	userRouter := router.Group("/user")
	userService := services.NewUserService(ctx, client.Database("chatDB").Collection("users"))
	userController := controllers.NewUserController(userService)
	userController.RegisterUserRoutes(userRouter)

	messageRouter := router.Group("/message")
	messageService := services.NewMessageService(ctx, client.Database("chatDB").Collection("messages"))
	messageController := controllers.NewMessageController(messageService)
	messageController.RegisterMessageRotues(messageRouter)

	router.Run(os.Getenv("SERVER_ADDRESS"))
}
