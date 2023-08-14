package bootstrap

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() *mongo.Client {
	godotenv.Load(".env")
	// Get uri from .env file
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("No MONGODB_URI found")
	}
	fmt.Printf("%v\n", uri)

	// Connect to Atlas Cluster
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(
		uri,
	))

	if err != nil {
		panic(err)
	}

	// Verify the connection
	err = client.Ping(ctx, nil)

	// Error connect to Atlas Cluster
	// Check username and password
	// Make sure ip is in access list
	if err != nil {
		fmt.Println("Error connecting to Database")
		panic(err)
	}

	fmt.Println("Connected to Database")

	return client
}

func CloseDB(client *mongo.Client) {
	if client == nil {
		return
	}

	err := client.Disconnect(context.TODO())
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connection to Database closed")
}
