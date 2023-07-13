package api

import (
	"moneyme/database"
	"time"

	"github.com/sirupsen/logrus"
)

type LoanInput struct {
	AmountRequired float64
	Term           uint
	Title          string
	FirstName      string
	LastName       string
	DateOfBirth    string
	Mobile         string
	Email          string
}

type GetLoan struct {
	AmountRequired float64
	Term           uint
	Title          string
	FirstName      string
	LastName       string
	DateOfBirth    string
	Mobile         string
	Email          string
	RepaymentFrom  float64
	Token          string
}

type UpdateLoanInput struct {
	AmountRequired float64
	Term           uint
	Title          string
	FirstName      string
	LastName       string
	DateOfBirth    time.Time
	Mobile         string
	Email          string
}

func (cpi *LoanInput) ToModel() database.Loan {
	dob, err := time.Parse(time.DateOnly, cpi.DateOfBirth)
	if err != nil {
		logrus.Error(err)
	}
	return database.Loan{
		AmountRequired: cpi.AmountRequired,
		Term:           cpi.Term,
		Title:          cpi.Title,
		FirstName:      cpi.FirstName,
		LastName:       cpi.LastName,
		DateOfBirth:    dob,
		Mobile:         cpi.Mobile,
		Email:          cpi.Email,
	}
}

func LoanModelToGetLoan(dbLoan database.Loan) *GetLoan {
	return &GetLoan{
		AmountRequired: dbLoan.AmountRequired,
		Term:           dbLoan.Term,
		Title:          dbLoan.Title,
		FirstName:      dbLoan.FirstName,
		LastName:       dbLoan.LastName,
		DateOfBirth:    dbLoan.DateOfBirth.Format(time.DateOnly),
		Mobile:         dbLoan.Mobile,
		Email:          dbLoan.Email,
		RepaymentFrom:  dbLoan.RepaymentFrom,
		Token:          dbLoan.Token,
	}
}
