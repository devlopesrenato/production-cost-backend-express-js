# Main Libraries Used
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Express](https://img.shields.io/badge/express-%23323330.svg?style=for-the-badge&logo=express&logoColor=%23F7DF1E)
![KNEX](https://img.shields.io/badge/knexjs-orange?style=for-the-badge&logo=knex.js&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![bcryptjs](https://img.shields.io/badge/bcrypt-blue?style=for-the-badge&logo=bcrypt&logoColor=white)
![jsonwebtoken](https://img.shields.io/badge/JWT-white?style=for-the-badge&logo=jwt.js&logoColor=black)

# Installation/Usage

1. Clone the repository
2. Run the ***npm run install*** command to install dependencies
3. Create a .env file in the project root and add the following environment variables:

```properties
NODE_ENV=development
APP_PORT=3333
SALT_ROUNDS=10
SECRET_KEY=MySecretKey

# Dev database
DEV_PG_HOST=127.0.0.1
DEV_PG_PORT=5432
DEV_PG_USER=postgres
DEV_PG_DATABASE=costprd
DEV_PG_PASSWORD=password

# Test database
TEST_PG_HOST=HOST_TEST
TEST_PG_PORT=5432
TEST_PG_USER=USER_TEST
TEST_PG_DATABASE=costprd
TEST_PG_PASSWORD=PSD_TEST


# Production database
TEST_PG_HOST=HOST_PRD
TEST_PG_PORT=5432
TEST_PG_USER=USER_PRD
TEST_PG_DATABASE=costprd
TEST_PG_PASSWORD=PSW_PRD

```

4. Run the ***npx knex migrate:latest*** command to apply the migrations to the database
5. Run the ***npm run start:dev*** command to start the app in development mode

# Custo de Produção
Este projeto foi inicialmente desenvolvido em Julho de 2022 e está sendo publicado no repositório hoje, [16/02/2024]. Durante o desenvolvimento inicial, foram implementados os principais recursos e funcionalidades do projeto. Como o objetivo era maximizar a eficiência e minimizar o uso de recursos, optei por utilizar apenas bibliotecas essenciais. No entanto, desde então, adquiri novos conhecimentos e experiências que me permitirá melhorar significativamente o código e a arquitetura do projeto.

# Refatoração dos Endpoints
Como parte da atualização deste projeto, planejo refatorar os endpoints para aplicar todo o conhecimento adquirido desde sua criação. Esta refatoração incluirá melhorias na estrutura do código, na segurança, na eficiência e na manutenibilidade dos endpoints. Estou empolgado em aproveitar o que aprendi.

<br>

# Production cost
This project was initially developed in July 2022 and is being published in the repository today, [2/16/2024]. During initial development, the project's main features and functionalities were implemented. As the goal was to maximize efficiency and minimize resource usage, I chose to use only essential libraries. However, since then, I have gained new knowledge and experience that will allow me to significantly improve the project's code and architecture.

# Endpoint Refactoring
As part of updating this project, I plan to refactor the endpoints to apply all the knowledge gained since its creation. This refactoring will include improvements to the code structure, security, efficiency and maintainability of endpoints. I'm excited to take advantage of what I've learned.

# License

This project is licensed under the terms of the ISC License.

---

Copyright © 2024 Renato Lopes

Author: Renato Lopes (devLopesRenato)

