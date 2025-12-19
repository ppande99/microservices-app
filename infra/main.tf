terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Networking, ECS, RDS, S3, and CloudFront resources will live here.
# This baseline keeps the repo ready for Terraform without making
# assumptions about your target VPC or networking strategy.
