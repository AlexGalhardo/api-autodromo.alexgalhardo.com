<div align="center">
 <h1 align="center"><a href="https://api-autodromo.alexgalhardo.com" target="_blank">api-autodromo.alexgalhardo.com</a></h1>
</div>

## Introduction

* A tech challenge project to create a full stack web app simulating a real-life racetrack system.

## Tools and Services Used

* [Linux Mint XFCE 21.04](https://linuxmint.com/)
* [Git for control version](https://git-scm.com/)
* [NodeJS v20](https://nodejs.org/en)
* [NestJs](https://nestjs.com/)
* Code Editor: [VSCode](https://code.visualstudio.com/)
* Deploy: <https://render.com/>

## Features

* CRUD
* Authentication & Authorization
* Notifications Events using Publisher/Subscriber Pattern

## FrontEnd Code: <https://github.com/AlexGalhardo/autodromo.alexgalhardo.com>

## Development Setup Local

* Clone repository

<!---->

```
git clone https://github.com/AlexGalhardo/api-autodromo.alexgalhardo.com
```

* Enter repository

<!---->

```
cd api-autodromo.alexgalhardo.com/
```

* Install dependencies

<!---->

```
npm install
```

* Setup your enviroment variables

<!---->

```
cp .env-example .env
```

* Start Docker, PrismaORM, Migrations and Seeds

<!---->

```
sh setup.sh
```

* To Start Prisma Studio:

<!---->

```
npm run prisma:studio
```

* Start local server

<!---->

```
npm run dev
```

* Go to: <http://localhost:4000/>

## Build for deploy

* To created build to deploy run:

<!---->

```
npm run build
```

* To test build production locally run:

<!---->

```
npm run start
```

## Tests

* Verify useCases tests:

<!---->

```
npm run test
```

* Verify End to End tests:

<!---->

```
npm run test:e2e
```

## Documentation

- See and add important documentation about this code repository in the [docs/](./docs/) folder

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2023-present, [Alex Galhardo](https://github.com/AlexGalhardo)
