package database

import (
	"github.com/go-pg/migrations/v8"
	"github.com/go-pg/pg/v10"
	"github.com/sirupsen/logrus"
)

type Database struct {
	db *pg.DB
}

func NewDb(
	dbName string,
	dbUsername string,
	dbPassword string,
	dbAddr string,
) Database {
	opts := &pg.Options{
		//depends on the db service from docker compose
		Addr:     dbAddr,
		User:     dbUsername,
		Password: dbPassword,
		Database: dbName,
	}

	db := pg.Connect(opts)
	//run migrations
	collection := migrations.NewCollection()
	err := collection.DiscoverSQLMigrations("migrations")
	if err != nil {
		logrus.Fatalf("database run migration error: %v", err)
	}

	//start the migrations
	_, _, err = collection.Run(db, "init")
	if err != nil {
		logrus.Fatalf("database start migration error: %v", err)
	}
	oldVersion, newVersion, err := collection.Run(db, "up")
	if err != nil {
		logrus.Fatalf("database up error: %v", err)
	}
	if newVersion != oldVersion {
		logrus.Infof("migrated from version %d to %d", oldVersion, newVersion)
	} else {
		logrus.Infof("version is %d", oldVersion)
	}
	//return the db connection
	return Database{db}
}

func (pgdb *Database) SaveLoan(input *Loan) error {
	_, err := pgdb.db.Model(input).Insert()
	if err != nil {
		logrus.Errorf("Db error %v", err.Error())
	}
	return err
}

func (pgdb *Database) UpdateLoan(token string, input *Loan) error {
	_, err := pgdb.db.Exec("Update loans SET amount_required = ?, repayment_from= ?, term = ?, title = ?, first_name = ?, last_name = ?, mobile = ?, date_of_birth = ?, email = ? WHERE token = ?", input.AmountRequired, input.RepaymentFrom, input.Term, input.Title, input.FirstName, input.LastName, input.Mobile, input.DateOfBirth, input.Email, token)
	if err != nil {
		logrus.Errorf("db: update loan error %v", err.Error())
	}
	return err
}

func (pgdb *Database) GetLoan(token string) (*Loan, error) {
	loan := &Loan{
		Token: token,
	}
	err := pgdb.db.Model(loan).Where("token = ?", token).Select()
	if err != nil && err.Error() == "no rows in result set" {
		logrus.Errorf("Db error get loan %v", err.Error())
		return nil, err
	}
	return loan, nil
}
