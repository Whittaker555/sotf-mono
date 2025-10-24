
# S3 bucket for API Lambda deployment packages
resource "aws_s3_bucket" "lambda_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_ownership_controls" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket_acl" {
  bucket     = aws_s3_bucket.lambda_bucket.id
  depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket]
  acl        = "private"
}

data "archive_file" "lambda_archive" {
  type        = "zip"
  source_dir  = "${path.module}/../../app/build"
  output_path = "${path.module}/../../app/build/api.zip"
}

resource "aws_s3_object" "playlist-api-lambda" {
  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "api.zip"
  source = data.archive_file.lambda_archive.output_path

  etag = filemd5(data.archive_file.lambda_archive.output_path)
}