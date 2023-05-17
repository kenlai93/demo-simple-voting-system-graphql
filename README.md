# Simple Voting System

## Running the app

1. edit host mapping
    ```bash
    sudo code /etc/hosts
    ```
2. add line
    ```
    127.0.0.1       mongo1
    127.0.0.1       mongo2
    127.0.0.1       mongo3
    ```
3. start mongodb
    ```bash
    docker-compose -f docker-compose-mongo.yml up -d
    ```
4. start redis
    ```bash
    docker-compose -f docker-compose-redis.yml up -d
    ```
5. init the replica set
    ```bash
    docker exec -it mongo1 sh -c "mongo --port 27021 < ./scripts/init-rs.js"
    ```
6. wait 10 seconds, to init data
    ```bash
    docker exec -it mongo1 sh -c "mongo --port 27021 <./scripts/init-data.js"
    ```
7. start backend
    1. in docker
        ```bash
        docker-compose -f docker-compose-backend.yml up -d
        ```
    2. or in Local
        ```bash
        npm install
        npm run prisma:generate
        npm run start:dev
        ```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
