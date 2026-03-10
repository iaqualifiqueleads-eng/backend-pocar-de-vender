## Como executar
 * 1 criar container
  `docker-compose up --build -d`

* 2 criar banco de dados
* 2.1 crie todos os bancos de dados referente a variaver DATABASE_SYSTEM_IDS do arquivo .env

## Typeorm
* Para criar a primeira migração, execute o comando 
`npm run migration:create db/migrations/primeiraMigracao`

* Para gerar a migration, execute o comando 
`npm run migration:generate db/migrations/NomeDaMigration`

* Para executar a migration, execute o comando 
`npm run migration:run`

* Para reverter a migration, execute o comando 
`npm run migration:revert`