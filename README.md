# Deployed version
Link: https://connecting-people-nc.onrender.com
To see all endpoints: https://connecting-people-nc.onrender.com/api

# Description
This API mimics the building of a real-world backend service (such as Reddit). The API provides this information to the front end architecture. The database is PostgreSQL, interaction is via node-Postgres testing done via Jest Supertest.

# To clone and work on this repo locally:
Minimum Node Version: v21.7.2
--> git clone https://github.com/nicolgh1/nc-news-api.git
--> npm install
--> npm setup-dbs
--> npm seed / seed-prod
--> npm start

The following files are required to be added to create the environment variables:
    - .env.test
    - .env.development 
    - .env.production
In each of the files add the databases names as follows (see .env-example).
    - PGDATABASE = <database-name>
Make sure to add the files to the .gitignore file before pushing.

# Northcoders News API

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)