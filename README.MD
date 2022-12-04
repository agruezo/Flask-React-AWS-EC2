

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

- When deploying on Fargate, must indicate "--platform=linux/amd64" in your Dockerfile:
   - example:

      ```
      FROM --platform=linux/amd64 public.ecr.aws/docker/library/node:18-alpine as builder

<h3>Issues Hot Loading with React-Script 5.x.x</h3>

- If browser is trying to open a websocket back to the node server to ws://localhost:3000 add the following as an environment variable:

   `WDS_SOCKET_PORT=0`