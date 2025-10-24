output "lambda_function_name"{
    description = "Name of the lambda function."
    value = aws_lambda_function.playlist_api_lambda_func.function_name
}