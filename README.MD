

<h1 align="center" >Deploying a Flask and React Microservice to AWS EC2</h1>

<h2>Objectives</h2>

<h3>Part 1</h3>

- Create a production Dockerfile that uses multistage Docker builds
- Utilize Amazon Elastic Container Registry (ECR) to store built images
- Configure CodeBuild to run when code is checked in to GitHub
- Run unit and integrations tests and check code for quality and formatting issues on CodeBuild

<h3>Part 2</h3>

- Configure RDS for data persistence
- Configure an Application Load Balancer (ALB) along with ECS to run a set of microservices
- Send container logs to CloudWatch
- Update a running container via a zero-downtime deployment strategy to not disrupt the current users your application
- Use AWS Fargate with ECS to deploy a microservice
- Spin up AWS infrastructure via Terraform

---

<h3>ISSUES WITH MAC M1:</h3>

- Requirements.txt file:
   - can't include `psycopg2-binary == 2.9.3` due to libpq version 10 issue
   - instead include this as part of your dependencies in your Dockerfile:

      ```
      RUN apt update -y \
      && apt install -y build-essential libpq-dev

      RUN pip3 install psycopg2-binary --no-binary psycopg2-binary

- When building Dockerfile.prod to test on Heroku locally:
   - run the following in the command line:

      ```
      docker build -f Dockerfile.prod  --platform linux/amd64 -t registry.heroku.com/APP_NAME/web .

<h3>ALTERNATIVE WAYS TO DEPLOY WITH GITHUB ACTIONS USING A RELEASE.SH FILE:</h3>

- Add the following to a release.sh file in the root directory of your repo:
   - `HEROKU_REGISTRY_IMAGE`, `APP_NAME`, and `HEROKU_API_KEY` are environment variables

      ```
      #!/bin/sh

      set -e

      IMAGE_ID=$(docker inspect ${HEROKU_REGISTRY_IMAGE} --format={{.Id}})
      PAYLOAD='{"updates": [{"type": "web", "docker_image": "'"$IMAGE_ID"'"}]}'

      curl -n -X PATCH https://api.heroku.com/apps/$APP_NAME/formation \
         -d "${PAYLOAD}" \
         -H "Content-Type: application/json" \
         -H "Accept: application/vnd.heroku+json; version=3.docker-releases" \
         -H "Authorization: Bearer ${HEROKU_API_KEY}"

- Add the following to your yml file:

   ```
   run: | 
      chmod +x ./release.sh
      docker build -f ./Dockerfile.prod -t $HEROKU_REGISTRY_IMAGE .
      docker login -u _ -p $HEROKU_API_KEY registry.heroku.com
      docker push $HEROKU_REGISTRY_IMAGE
      ./release.sh

<h3>Issues Hot Loading with React-Script 5.x.x</h3>

- If browser is trying to open a websocket back to the node server to ws://localhost:3000 add the following as an environment variable:

   `WDS_SOCKET_PORT=0`