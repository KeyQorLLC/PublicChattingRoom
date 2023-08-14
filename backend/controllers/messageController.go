package controllers

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
)

type SafeCounter struct {
	mu sync.Mutex
	c  int
}

var counter = SafeCounter{c: 0}

type MessageController struct {
	MessageService services.MessageService
}

func NewMessageController(messageService services.MessageService) MessageController {
	return MessageController{
		MessageService: messageService,
	}
}

func (mC *MessageController) CreateMessage(ctx *gin.Context) {
	var message models.Message
	if err := ctx.ShouldBindJSON(&message); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	counter.mu.Lock()
	messages, err := mC.MessageService.GetAll()
	if err != nil {
		message.ID = 0
		counter.c = 1
	} else {
		message.ID = len(messages)
		counter.c++
	}
	counter.mu.Unlock()

	err = mC.MessageService.CreateMessage(&message)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Success",
	})
}

func (mC *MessageController) GetAll(ctx *gin.Context) {
	messages, err := mC.MessageService.GetAll()
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{
			"message": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, messages)
}

func (mC *MessageController) UpVote(ctx *gin.Context) {
	msg_id, _ := strconv.Atoi(ctx.Param("id"))
	err := mC.MessageService.UpVote(msg_id)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{
			"message": err,
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Success",
	})
}

func (mC *MessageController) DownVote(ctx *gin.Context) {
	msg_id, _ := strconv.Atoi(ctx.Param("id"))
	err := mC.MessageService.DownVote(msg_id)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{
			"message": err,
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Success",
	})
}

func (mC *MessageController) RegisterMessageRotues(rG *gin.RouterGroup) {
	rG.POST("/send", mC.CreateMessage)
	rG.GET("/getall", mC.GetAll)
	rG.PUT("/upvote/:id", mC.UpVote)
	rG.PUT("/downvote/:id", mC.DownVote)
}
