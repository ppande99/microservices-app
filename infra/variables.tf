variable "aws_region" {
  type        = string
  description = "AWS region for ECS/RDS/S3/CloudFront resources."
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Prefix for AWS resources."
  default     = "microservices-app"
}

variable "vpc_id" {
  type        = string
  description = "Existing VPC ID."
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "Existing public subnet IDs for ALB."
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "Existing private subnet IDs for ECS tasks and Aurora."
}

variable "db_name" {
  type        = string
  description = "Aurora MySQL database name."
  default     = "app"
}

variable "db_username" {
  type        = string
  description = "Aurora MySQL master username."
  default     = "app"
}

variable "db_password" {
  type        = string
  description = "Aurora MySQL master password."
  sensitive   = true
}

variable "db_instance_class" {
  type        = string
  description = "Aurora MySQL instance class."
  default     = "db.t4g.micro"
}

variable "domain_name" {
  type        = string
  description = "Custom domain name for CloudFront (e.g. app.example.com)."
}

variable "route53_zone_id" {
  type        = string
  description = "Route53 hosted zone ID for the custom domain."
}

variable "api_domain_name" {
  type        = string
  description = "Custom domain name for ALB (e.g. api.example.com)."
}
