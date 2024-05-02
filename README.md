# Backend task

## DEPLOY: https://backendnodejs-production.up.railway.app

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/VladimirM89/Backend_Nodejs.git
```

Change directory:

```
cd Backend_Nodejs
```

## Enter to developing branch

```
git checkout develop
```

## Installing NPM modules

```
npm install
```

## Rename .env.example

```
Rename file .env.example to .env
```

## Database

1. Install PostgresQL database (https://www.postgresql.org/)
2. Create database user. Login: **postgres**, password: **123456**
3. Create database with name **backend_task**
4. To create tables in db run:

```
npm run migrate -- 'init'  (where init - name of migration. Could be anyone)
```

## Running application

To run server enter:

```
npm run start
```

Server will start on 4000 (port from .env file).

To make request to server - **localhost:4000**
