# City Watch
***DEMO*** 👉  [https://www.youtube.com/watch?v=DUOeRZn2NwY](https://www.youtube.com/watch?v=DUOeRZn2NwY)
***DATA*** 👉  [https://drive.google.com/drive/folders/1GgEdNyW0vKlIvTop6SwelT2xKuUEfD73?usp=sharing](https://drive.google.com/drive/folders/1GgEdNyW0vKlIvTop6SwelT2xKuUEfD73?usp=sharing)

## Setup
Get the code by cloning this repository using git
```
git clone https://github.com/harshakoneru98/city_watch.git
```

### Front-End Setup
Once downloaded, open terminal in the project directory, go to app folder and install dependencies with:
```
npm install
```
Create **.env** file in app folder with the following attribute names:
```
REACT_APP_GOOGLE_API_KEY = <your_google_api_key>
REACT_APP_SERVER_URL= <your_server_url>  Ex: 'http://localhost:8080/api/'
```

### Back-End Setup
Open another terminal in the project directory, go to server folder and install dependencies with:
```
npm install
```
Create **.env** file in server folder with the following attribute names:
```
PORT = <your_server_port> Ex: 8080
CITY_WATCH_AWS_ACCESS_KEY =  <your_aws_access_key>
CITY_WATCH_AWS_SECRET_KEY = <your_aws_secret_key>
CITY_WATCH_AWS_REGION = <your_aws_region>
CITY_WATCH_DATABASE_NAME = <your_dynamodb_database_name> Ex: 'city_watch_data'
EMAIL_INDEX = <your_dynamodb_database_email_index_name> Ex: 'email-index'
PRIMARY_CITY_INDEX = <your_dynamodb_database_city_index_name> Ex: 'primary_city-index'
AUTH_KEY = <your_authentication_key> Ex: 'secretkey'
```

### Database Setup
Create a Table in AWS DynamoDB. Download the Data mentioned above into server folder and Run the Create APIs. Make sure to change the Data paths accordingly.

## Run the Application
First open the terminal at app folder in project directory. Run the following command to run the front-end application.
``` bash
npm run start
```
Next open the terminal at server folder in project directory. Run the following command to run the back-end server.
``` bash
npm run start
```
The app should now be up and running at [http://localhost:3000](http://localhost:3000/)  🚀
