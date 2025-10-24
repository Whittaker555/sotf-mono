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

module "database" {
  source = "./dynamo"
}

module "storage" {
  source      = "./s3"
  bucket_name = "${var.app_name}-api-lambda"
}

module "api" {
  depends_on     = [module.storage, module.database]
  source         = "./lambda"
  function_name  = "${var.app_name}-api"
  storage_bucket = module.storage.bucket_name
  storage_key    = module.storage.object_key
}

module "api-gateway" {
  depends_on           = [module.api]
  source               = "./gateway"
  gateway_name         = "${var.app_name}-api-gateway"
  lambda_function_name = module.api.lambda_function_name
}
