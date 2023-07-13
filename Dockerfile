# builder image
FROM golang:1.20.6-alpine3.18 as builder
WORKDIR /go/src/app
COPY go.mod go.sum ./
RUN go mod download
COPY migrations /go/bin/moneyme-api/migrations
COPY . .
RUN ls -l
RUN  CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o /go/bin/api  ./cmd/api/main.go


FROM alpine:3.14
COPY --chown=65534:65534 --from=builder /go/bin/api .
COPY --from=builder /go/bin/moneyme-api/migrations ./migrations

USER 65534
ENTRYPOINT [ "./api" ]