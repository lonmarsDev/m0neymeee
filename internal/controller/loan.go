package controller

import (
	"fmt"
	"math"
	"moneyme/database"
	"time"

	"github.com/google/uuid"
)

const (
	// Interest rate 8%
	interestRate float64 = 0.08
	// Monthly repayment frequency is monthly:
	// =PMT(8%/12, 3*12, 5000
	rePaymentFrequency    = 12
	minimumAgeRequirement = 18
)

type LoanController struct {
	ILoanController
}

type Token string

type ILoanController interface {
	Create(database.Loan) (Token, error)
	Get(string) (*database.Loan, error)
	Update(string, database.Loan) error
	Calculate(database.Loan) (*database.Loan, error)
}

func NewLoanController(db database.Database) LoanController {
	return LoanController{
		&LoanControllerImp{
			db: db,
		},
	}
}

type LoanControllerImp struct {
	db database.Database
}

func (pi *LoanControllerImp) Create(payment database.Loan) (Token, error) {
	token := uuid.New().String()
	payment.Token = token
	payment.CreatedAt = time.Now()
	if err := pi.db.SaveLoan(&payment); err != nil {
		return "", err
	}
	return Token(token), nil
}

func (pi *LoanControllerImp) Get(token string) (*database.Loan, error) {
	return pi.db.GetLoan(token)
}

func (pi *LoanControllerImp) Update(token string, loan database.Loan) error {
	if age(loan.DateOfBirth, time.Now()) < minimumAgeRequirement {
		return fmt.Errorf("error: age should be %d and above", minimumAgeRequirement)
	}
	return pi.db.UpdateLoan(token, &loan)
}

func (pi *LoanControllerImp) Calculate(loan database.Loan) (*database.Loan, error) {
	loan.RepaymentFrom = PMT(interestRate/rePaymentFrequency, float64(loan.Term), loan.AmountRequired, 0, 0)
	return &loan, nil
}

func PMT(rate, nper, pv, fv, loanType float64) float64 {
	var pmt float64
	pvMinusFV := pv - fv

	if rate == 0.00 {
		pmt = pvMinusFV / nper
	} else {
		raterPerAnnum := rate
		rateToNPER := math.Pow((raterPerAnnum + 1), nper)
		pmt = (pvMinusFV * (raterPerAnnum * rateToNPER)) / (rateToNPER - 1)

		fvRate := fv * raterPerAnnum
		pmt = (pmt + fvRate)

		// loan type is when the payment is being paid
		// 0 == end of month (default), 1 == start of month
		// so one less months worth of rate is being paid if 1
		if loanType == 1 {
			pmt = pmt / (1 + raterPerAnnum)
		}
	}
	return math.Round(pmt*100) / 100
}

func age(birthdate, today time.Time) int {
	today = today.In(birthdate.Location())
	ty, tm, td := today.Date()
	today = time.Date(ty, tm, td, 0, 0, 0, 0, time.UTC)
	by, bm, bd := birthdate.Date()
	birthdate = time.Date(by, bm, bd, 0, 0, 0, 0, time.UTC)
	if today.Before(birthdate) {
		return 0
	}
	age := ty - by
	anniversary := birthdate.AddDate(age, 0, 0)
	if anniversary.After(today) {
		age--
	}
	return age
}
