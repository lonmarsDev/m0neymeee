package api

import (
	"encoding/json"
	"fmt"
	"moneyme/database"
	"moneyme/internal/controller"

	"moneyme/pkg/httpresponse"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type HttpHandler struct {
	HttpHandlerI
}

type HttpHandlerI interface {
	CreateLoanHandler(w http.ResponseWriter, r *http.Request)
	GetLoanHandler(w http.ResponseWriter, r *http.Request)
	CalculateHandler(w http.ResponseWriter, r *http.Request)
	UpdateLoanHandler(w http.ResponseWriter, r *http.Request)
}

type HttpHandlerImp struct {
	loanCtrl controller.LoanController
}

func NewHandler(db database.Database) HttpHandler {
	return HttpHandler{&HttpHandlerImp{
		loanCtrl: controller.NewLoanController(db),
	}}
}

func (handler *HttpHandlerImp) CreateLoanHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var cpi LoanInput
	if err := decoder.Decode(&cpi); err != nil {
		httpresponse.ResponseError(w, http.StatusBadRequest, err)
		return
	}
	token, err := handler.loanCtrl.Create(cpi.ToModel())
	if err != nil {
		httpresponse.ResponseError(w, http.StatusInternalServerError, err)
	}
	reDirectURL := fmt.Sprintf("http://localhost:3000/calculate?token=%s", token)
	httpresponse.ResponseSuccess(w, struct{ URL string }{URL: reDirectURL})
}

func (handler *HttpHandlerImp) GetLoanHandler(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")
	if token == "" {
		httpresponse.ResponseError(w, http.StatusBadRequest, fmt.Errorf("token is required"))
		return
	}
	loan, err := handler.loanCtrl.Get(token)
	if err != nil {
		httpresponse.ResponseError(w, http.StatusInternalServerError, err)
		return
	}
	httpresponse.ResponseSuccess(w, LoanModelToGetLoan(*loan))
}

func (handler *HttpHandlerImp) CalculateHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var cpi LoanInput
	if err := decoder.Decode(&cpi); err != nil {
		httpresponse.ResponseError(w, http.StatusBadRequest, err)
		return
	}
	loan, err := handler.loanCtrl.Calculate(cpi.ToModel())
	if err != nil {
		httpresponse.ResponseError(w, http.StatusInternalServerError, err)
	}
	httpresponse.ResponseSuccess(w, LoanModelToGetLoan(*loan))
}

func (handler *HttpHandlerImp) UpdateLoanHandler(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")
	if token == "" {
		httpresponse.ResponseError(w, http.StatusBadRequest, fmt.Errorf("token is required"))
		return
	}
	decoder := json.NewDecoder(r.Body)
	var cpi LoanInput
	if err := decoder.Decode(&cpi); err != nil {
		httpresponse.ResponseError(w, http.StatusBadRequest, err)
		return
	}
	err := handler.loanCtrl.Update(token, cpi.ToModel())
	if err != nil {
		httpresponse.ResponseError(w, http.StatusInternalServerError, err)
		return
	}
	httpresponse.ResponseSuccess(w, struct{}{})
}
