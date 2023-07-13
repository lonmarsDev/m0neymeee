package main

import (
	"moneyme/api"
	"os"

	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
)

func main() {
	var (
		dbName     string
		dbUsername string
		dbPassword string
		dbAddr     string
		serverPort string
	)
	app := &cli.App{
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:        "db-addr",
				Value:       "localhost:5432",
				Usage:       "database hostname",
				Destination: &dbAddr,
				EnvVars:     []string{"DB_HOSTNAME"},
			},
			&cli.StringFlag{
				Name:        "db-name",
				Value:       "postgres",
				Usage:       "database name",
				Destination: &dbName,
				EnvVars:     []string{"DB_NAME"},
			},
			&cli.StringFlag{
				Name:        "db-username",
				Value:       "postgres",
				Usage:       "database username",
				Destination: &dbUsername,
				EnvVars:     []string{"DB_USERNAME"},
			},
			&cli.StringFlag{
				Name:        "db-password",
				Value:       "root",
				Usage:       "database password",
				Destination: &dbPassword,
				EnvVars:     []string{"DB_PASSWORD"},
			},
			&cli.StringFlag{
				Name:        "server-port",
				Value:       "8100",
				Usage:       "server port",
				EnvVars:     []string{"SERVER_PORT"},
				Destination: &serverPort,
			},
		},
		Action: func(c *cli.Context) error {
			srv := api.NewServer(dbName,
				dbUsername,
				dbPassword,
				dbAddr,
			)
			return srv.Run(serverPort)

		},
	}

	if err := app.Run(os.Args); err != nil {
		logrus.Fatal(err)
	}

}
