# S3 bucket for frontend static website hosting
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_ownership_controls" "frontend_bucket" {
  bucket = aws_s3_bucket.frontend_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "frontend_bucket_acl" {
  bucket     = aws_s3_bucket.frontend_bucket.id
  depends_on = [aws_s3_bucket_ownership_controls.frontend_bucket]
  acl        = "private"
}

# Configuration for static website hosting (if needed)
# Uncomment and configure as needed:
# resource "aws_s3_bucket_website_configuration" "frontend_bucket" {
#   bucket = aws_s3_bucket.frontend_bucket.id
#
#   index_document {
#     suffix = "index.html"
#   }
#
#   error_document {
#     key = "error.html"
#   }
# }