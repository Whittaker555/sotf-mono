data "aws_s3_bucket" "storage_bucket" {
  bucket = var.storage_bucket
}

resource "aws_lambda_function" "playlist_api_lambda_func" {
  function_name = var.function_name
  s3_bucket     = data.aws_s3_bucket.storage_bucket.id
  s3_key        = var.storage_key

  runtime = "nodejs18.x"
  handler       = "api/index.handler"

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "playlist_api_lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.playlist_api_lambda_func.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "sotf_api_lambda"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Sid       = "",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

data "aws_dynamodb_table" "users_database" {
  name = "sotf_users"
}
data "aws_dynamodb_table" "playlist_database" {
  name = "sotf_playlists"
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "sotf_lambda_api_policy"
  description = "Allow the lambda to run a scan and write on the db and read the secrets"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        Resource = [
          data.aws_dynamodb_table.users_database.arn,
          data.aws_dynamodb_table.playlist_database.arn
        ]
      }
    ]
  })
}

# Attach the custom policy to the lambda_exec role
resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# Attach the AWS-managed basic execution role policy to the same IAM role
resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
