# Backend Testing
##### Note: 
Backend testing done through POSTMan, which allows us to send API requests via HTTP methods (GET, POST, DELETE) with various headers and receive formatted outputs. Before starting testing, start the backend server with `nodemon server` in the server directory. By default, the server runs on PORT 4000, but this is changeable in *server/config.env*.  
Below are the test cases we have performed for the backend. We first describe the use case, which API endpoints are being tested, the inputs, outputs, and success/failure scenarios.  

### Users:

When a user logs in to the frontend, they will either create a new user or log in as an existing user.  
For an existing user, they will use the verify endpoint. Because each user is notified via text message, we can use their phone number as a primary key to index the user.  
**Input:**  
GET request to route http://localhost:4000/users/verify/11234567890/12345678
where *11234567890* is the user's phone number and *12345678* is the user's password.
**Output:**  
Success:
Status: `200 OK`
Response:
This call returns the user object on success, letting the frontend load the user's information directly.
`{
    "_id": "619da6ebb5369e3c94a18179",
    "name": "frontend",
    "email": "123@123.com",
    "phone": "11234567890",
    "apartments": [
        "1234",
        "1212"
    ],
    "password": "12345678"
}`
Failure:
Status: `404 Not Found`
Response:
`Error: user does not exist.`

For a new user, they will use the create endpoint. The frontend login page has the user's information, which they pass to the backend via a POST method call.  
**Input:**  
POST request to route http://localhost:4000/users/create
Header:
`Content-Type: application/json`
Body:
`{
        "name": "test name",
        "email": "test@test.com",
    "phone": "5103162398",
    "apartments": [],
    "password": "test"
}`    
**Output:**  
Success:
Status: `200 OK`
Response: 
As part of the response, we get the user ObjectID, however, we also have the ability to query users by phone number as well.
`{
    "acknowledged": true,
    "insertedId": "6192ff6abab0402fee0ced87"
}`
Failure:
If the user is missing a field (name, phone, etc):
Status: `400 Bad Request`
Response:
`Error: user needs all fields.`
If the user already exists:
Status: `500 Internal Server Error`
Response:
`E11000 duplicate key error collection: ParkingAppDB.Users index: name_1_email_1_phone_1 dup key: { name: "frontend", email: "123@123.com", phone: "11234567890" }`
  
Users can also update their information via POST requests.  
**Input:**  
POST request to route http://localhost:4000/users/update/11234567890 where *11234567890* is the user's current phone number.  
Alternatively, a POST request to http://localhost:5000/users/6193499f781df6203b0fd607 where the parameter is the user's ObjectID is also valid with the same behavior.
Header:
`Content-Type: application/json`
Body:
`{
        "name": "test name",
        "email": "test@test.com",
    "phone": "19876543211",
    "apartments": [],
    "password": "newpassword"
}`  
**Output:**  
Success:  
Status: `200 OK`
Response: 
`{
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}`
Failure:  
If the user is missing a field (name, phone, etc):
Status: `400 Bad Request`
Response:
`Error: updated user needs name, email, and phone number.`
If user not found:
Status: `404 Not Found`
Response:
`Error: user does not exist.`
Any other errors should return with a status `500 Internal Server Error` and the appropriate error message in the response.


When a user joins an apartment, the frontend will send a request to update the user object with the apartment number, so the program can remember which apartments that user is in.  
**Input:**  
POST request to route http://localhost:4000/users/updateApt/11234567890 where *11234567890* is the user's phone number.
Header:
`Content-Type: application/json`
Body:
`{
    "apartments": [1234],
}`    
**Output:**  
Success:
Status: `200 OK`
Response:
We can check the `matchedCount` and `modifiedCount` to see if the apartments array was found and actually modified.
`{
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}`  
Failure:  
If the user is missing updated apartments array:
Status: `400 Bad Request`
Response:
`Error: No apartments array attached.`
If user not found:
Status: `404 Not Found`
Response:
`Error: user does not exist.`
Any other errors should return with a status `500 Internal Server Error` and the appropriate error message in the response.  
  
  
Finally, a user can delete themselves from the database.  
**Input:**  
DELETE request to route http://localhost:4000/users/11234567890 where *11234567890* is the user's phone number.  
**Output:**  
Success:
Status: `200 OK`
Response:
Note that the `deletedCount` is 1, indicating the record was successfully deleted.
`{
    "acknowledged": true,
    "deletedCount": 1
}`  
Failure:  
If the record was not found, `deletedCount` would be 0, a soft failure. Any critical failures will be indicated with status `500 Internal Server Error` and an accompanying error message in the response body.

### Apartments:

When a user creates a new apartment, the frontend stores the apartment's information and passes it in the POST body.
**Input:**  
POST request to route http://localhost:4000/apts/create
Header:
`Content-Type: application/json`
Body:
`{
"join_code": 1234,
"num_lanes": 1,
"num_spots": 3,
"residents": ["619c1e9add6689284956cb2e"]
}`
**Output:**  
Success:
Status: `200 OK`
Response: 
As part of the response, we get the apartment ObjectID, however, we also have the ability to query apartments by join code as well.
`{
    "acknowledged": true,
    "insertedId": "619c512ddcd5baaf87a5010b"
}`
Failure:
If the apartment is missing a field (joincode, lanes, etc.):
Status: `400 Bad Request`
Response:
`Error: apartment needs all fields.`
If the user already exists:
Status: `500 Internal Server Error`
Response:
`E11000 duplicate key error`

MORE STUFF ON JOINING APARTMENT AND NOTIFS HERE
 
Lastly, an apartment can be removed from the database.  
**Input:**  
DELETE request to route http://localhost:4000/apts/1234 where *1234* is the apartment join code.  
**Output:**  
Success:
Status: `200 OK`
Response:
Note that the `deletedCount` is 1, indicating the record was successfully deleted.
`{
    "acknowledged": true,
    "deletedCount": 1
}`  
Failure:  
If the record was not found, `deletedCount` would be 0, a soft failure. Any critical failures will be indicated with status `500 Internal Server Error` and an accompanying error message in the response body.
