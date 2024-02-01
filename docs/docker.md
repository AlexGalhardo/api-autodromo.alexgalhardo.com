## Docker

### To stop and remove all Docker containers using the Linux command line, you can use the following command:
```bash
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
```

- sudo docker-compose up -d
- sudo docker ps

### MongoDB ReplicaSet for Prisma Seed Transactions
Starting a local single-instance replicaSet is pretty easy and I really don't think you should waste some time or add code complexity to handle a non-replicaSet environment for development purposes.

For instance this docker-compose.yml does the job for me:

version: '3'

services:
  mongo:
    container_name: mongo
    image: mongo:4
    command: --replSet rs0
    ports:
      - '27017:27017'
      - '28017:28017'
    volumes:
      - ./data/mongo:/data/db
You just have to run the following command once:

docker-compose exec mongo mongo --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'localhost:27017'}]});"
And that's it.

Selfishly, I'd rather want jsonSchema support for actual production workloads! (see #8135)!
