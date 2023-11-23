# teamwork-app-nodejs

[![Build Status](https://travis-ci.com/highman95/teamwork-app-nodejs.svg?branch=develop)](https://travis-ci.com/highman95/teamwork-app-nodejs)

Teamwork app (built with NodeJS)
<br>
<br>

## Installation
Rename the `.env-dist` to `.env`. Then, set the environment variable with placeholder values. 
The sample complete `.env` file is shown below:

**`Sample Configuration`**
```
JWT_SECRET=mYJwTS3cr3t
JWT_SUBJECT=teamworkapp
JWT_ISSUER=teamworkapp
PORT=3070

DB_USER=postgres
DB_NAME=twapp_nodejs_db
DB_HOST=127.0.0.1
DB_PASSWORD=seCreT!pass
DB_PORT=5432

DATABASE_URL=postgresql://{$DB_USER}:{$DB_PASSWORD}@{$DB_HOST}:{$DB_PORT}/${DB_NAME}?connect_timeout=10
DB_SSL=false

CLOUDINARY_NAME=teamworkapp-cloudinary
CLOUDINARY_API_KEY=teamworkapp-api-key
CLOUDINARY_API_SECRET=teamworkapp-api-secret
```

> Ensure that the database (with name as set in the `.env` file) has been created.

Afterwards, run the following command in order to bootstrap your database tables.
```bash
# development
$ npm run boot && npm run start-dev

# production
$ npm run boot && npm run start
```

> You don't need to specify `npm run boot` after the first run. Simply, run `npm run start`.

<br/>

## DB-Entities (PostgreSQL)

The DB Schema is defined in the `src/bootstrapdb.js` file.
<br>
<br>

## License
This app is [MIT licensed](LICENSE).
