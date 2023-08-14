package controllers

import (
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	UserService services.UserService
}

func NewUserController(userService services.UserService) UserController {
	return UserController{
		UserService: userService,
	}
}

func (uC *UserController) CreateUser(ctx *gin.Context) {
	var user models.User
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	username := user.Username
	_, err := uC.UserService.GetUser(&username)
	if err == nil {
		ctx.JSON(http.StatusBadGateway, gin.H{
			"message": "Already exist",
		})
		return
	}

	err = uC.UserService.CreateUser(&user)
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

func (uC *UserController) GetUser(ctx *gin.Context) {
	username := ctx.Param("username")

	user, err := uC.UserService.GetUser(&username)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (uC *UserController) GetAll(ctx *gin.Context) {
	users, err := uC.UserService.GetAll()
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{
			"message": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, users)
}

func (uC *UserController) UpdateUser(ctx *gin.Context) {

	var user models.User
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	err := uC.UserService.UpdateUser(&user)
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

func (uC *UserController) DeleteUser(ctx *gin.Context) {
	username := ctx.Param("username")
	err := uC.UserService.DeleteUser(&username)
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

func (uC *UserController) LoginUser(ctx *gin.Context) {
	var user models.User
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	err := uC.UserService.LoginUser(&user)
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

func (uC *UserController) RegisterUserRoutes(rG *gin.RouterGroup) {
	rG.POST("/register", uC.CreateUser)
	rG.GET("/get/:username", uC.GetUser)
	rG.GET("/getall", uC.GetAll)
	rG.PUT("/update", uC.UpdateUser)
	rG.DELETE("/delete/:username", uC.DeleteUser)
	rG.POST("/login", uC.LoginUser)
}
