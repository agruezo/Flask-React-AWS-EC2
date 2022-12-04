# Core

variable "region" {
    type        = string
    description = "The region in which to create/manage resources"
    default     = "us-east-1"
}

# networking

variable "public_subnet_1_cidr" {
    description = "CIDR Block for Public Subnet 1"
    default     = "10.0.1.0/24"
}
variable "public_subnet_2_cidr" {
    description = "CIDR Block for Public Subnet 2"
    default     = "10.0.2.0/24"
}
variable "private_subnet_1_cidr" {
    description = "CIDR Block for Private Subnet 1"
    default     = "10.0.3.0/24"
}
variable "private_subnet_2_cidr" {
    description = "CIDR Block for Private Subnet 2"
    default     = "10.0.4.0/24"
}
variable "availability_zones" {
    description = "Availability zones"
    type        = list(string)
    default     = ["us-east-1a", "us-east-1b"]
}

# load balancer

variable "health_check_path_client" {
    description = "Health check path for the default target group"
    default     = "/"
}
variable "health_check_path_users" {
    description = "Health check path for the default target group"
    default     = "/ping"
}

# ecs

variable "ecs_cluster_name" {
    description = "Name of the ECS cluster"
    default     = "flask-react-fargate"
}
variable "docker_image_url_client" {
    description = "Docker client image to run in the ECS cluster"
    default     = "AWS_DOCKER_IMAGE_URL_CLIENT"
}
variable "docker_image_url_users" {
    description = "Docker users image to run in the ECS cluster"
    default     = "AWS_DOCKER_IMAGE_URL_USERS"
}
variable "app_count" {
    description = "Number of Docker containers to run"
    default     = 1
}
variable "secret_key" {
    description = "Flask Secret Key"
    default     = "SECRET_KEY"
}

# logs

variable "log_retention_in_days" {
    default = 30
}

# key pair
variable "ssh_pubkey" {
    description = "Path to an SSH public key"
    default     = "SSH_PUB_KEY"
}

# rds

variable "rds_db_name" {
    description = "RDS database name"
    default     = "api_prod"
}
variable "rds_username" {
    description = "RDS database username"
    default     = "webapp"
}
variable "rds_password" {
    description = "RDS database password"
}
variable "rds_instance_class" {
    description = "RDS instance type"
    default     = "db.t2.micro"
}