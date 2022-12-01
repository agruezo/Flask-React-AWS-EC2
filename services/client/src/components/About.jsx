import React from "react";

const About = () => (
  <div>
    <h1 className="title is-1">About</h1>
    <hr />
    <br />
    <h4 className="title is-4">
      Deploying a Flask and React Microservice to AWS EC2
    </h4>
    <h5 className="title is-5">Objectives</h5>
    <h6 className="title is-6">Part 1</h6>
    <ul className="content">
      <li>Create a production Dockerfile that uses multistage Docker builds</li>
      <li>
        Utilize Amazon Elastic Container Registry (ECR) to store built images
      </li>
      <li>Configure CodeBuild to run when code is checked in to GitHub</li>
      <li>
        Run unit and integrations tests and check code for quality and
        formatting issues on CodeBuild
      </li>
    </ul>
    <h6 className="title is-6">Part 2</h6>
    <ul className="content">
      <li>Configure RDS for data persistence</li>
      <li>
        Configure an Application Load Balancer (ALB) along with ECS to run a set
        of microservices
      </li>
      <li>Send container logs to CloudWatch</li>
      <li>
        Update a running container via a zero-downtime deployment strategy to
        not disrupt the current users or application
      </li>
      <li>Use AWS Fargate with ECS to deploy a microservice</li>
      <li>Spin up AWS infrastructure via Terraform</li>
    </ul>
  </div>
);

export default About;
