terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "eu-west-2"
  profile = "default"
}

# Frontend infrastructure will go here
# This could include S3 bucket for static site hosting, CloudFront distribution, etc.
# For now, keeping it minimal - add resources as needed

module "frontend_storage" {
  source      = "./s3"
  bucket_name = "${var.app_name}-frontend"
}