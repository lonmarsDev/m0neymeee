# Moneyme

Holds the loans process exam

## Running via docker

## command to run all service

```bash
docker compose up
```

## 
```bash
curl --location --request POST 'http://localhost:8100/loan' \
--header 'Content-Type: application/json' \
--data-raw '{
  "AmountRequired": 7000,
  "Term": 2,
  "Title": "Mrs.",
  "FirstName": "Test",
  "LastName": "TestLastName",
  "DateOfBirth": "1992-02-22",
  "Mobile": "+7721312",
  "Email": "test@gmail.com"
}'
```
Then copy the URL response via the api, then Past it on the browser


## Troubleshoot
if api server is not running on the first time, after hitting docker compose.
- Solution: restart docker container for the api only

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)