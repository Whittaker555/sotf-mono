output "bucket_name" {
  description = "Name of bucket created."
  value = aws_s3_bucket.lambda_bucket.bucket
}
output "object_key" {
  description = "Object created in the bucket."
  value = aws_s3_object.playlist-api-lambda.key
}