package api

import (
	"fmt"
	"moneyme/database"
	"net/http"

	logger "github.com/chi-middleware/logrus-logger"
	"github.com/go-chi/chi/v5"
	"github.com/rs/cors"
	"github.com/sirupsen/logrus"
)

type Server struct {
	handler HttpHandler
	db      database.Database
}

func NewServer(
	dbName string,
	dbUsername string,
	dbPassword string,
	dbAddr string,
) Server {
	db := database.NewDb(
		dbName,
		dbUsername,
		dbPassword,
		dbAddr,
	)
	return Server{
		handler: NewHandler(db),
		db:      db,
	}
}

func (srv *Server) Run(serverPort string) error {
	log := logrus.New()
	r := chi.NewRouter()
	cors := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		AllowOriginRequestFunc: func(r *http.Request, origin string) bool {
			return true
		},
		AllowedMethods:       []string{"GET", "PUT", "POST", "DELETE", "HEAD", "PATCH", "OPTIONS"},
		AllowedHeaders:       []string{"X-Requested-With", "Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:       []string{},
		MaxAge:               0,
		AllowCredentials:     true,
		AllowPrivateNetwork:  false,
		OptionsPassthrough:   false,
		OptionsSuccessStatus: 0,
		Debug:                false,
	})
	r.Use(cors.Handler)
	r.Use(logger.Logger("router", log))

	//Set Routes
	srv.SetRoutes(r)
	err := http.ListenAndServe(fmt.Sprintf(":%s", serverPort), r)
	if err != nil {
		return err
	}
	return nil
}

func (srv *Server) SetRoutes(r *chi.Mux) {
	r.Post(endpointLoan, srv.handler.CreateLoanHandler)
	r.Get(endpointGetLoan, srv.handler.GetLoanHandler)
	r.Post(endpointCalculatePayment, srv.handler.CalculateHandler)
	r.Patch(endpointGetLoan, srv.handler.UpdateLoanHandler)
}
