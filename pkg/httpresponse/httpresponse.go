package httpresponse

import (
	"encoding/json"
	"net/http"

	"github.com/sirupsen/logrus"
)

func ResponseError(w http.ResponseWriter, statusCode int, errorMsg error) {
	w.WriteHeader(statusCode)
	if _, err := w.Write([]byte(errorMsg.Error())); err != nil {
		logrus.Error(err)
	}
}

func ResponseSuccess(w http.ResponseWriter, respBody interface{}) {
	b, err := json.Marshal(respBody)
	if err != nil {
		logrus.Errorf("marshal struct error %v", err)
		ResponseError(w, http.StatusInternalServerError, err)
		return
	}
	if _, err := w.Write(b); err != nil {
		logrus.Errorf("write byte error %v", err)
		ResponseError(w, http.StatusInternalServerError, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
}
