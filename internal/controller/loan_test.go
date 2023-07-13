package controller

import (
	"fmt"
	"testing"
)

func TestPMT(t *testing.T) {
	v := PMT(interestRate/rePaymentFrequency, 3*52, 5000, 0, 0)
	fmt.Println(v)
}
