package database

import "time"

type Loan struct {
	Id             int64
	AmountRequired float64
	RepaymentFrom  float64
	Term           uint
	Title          string
	FirstName      string
	LastName       string
	DateOfBirth    time.Time
	Mobile         string
	Email          string
	Token          string
	CreatedAt      time.Time
	DeletedAt      time.Time
	UpdatedAt      time.Time
}
