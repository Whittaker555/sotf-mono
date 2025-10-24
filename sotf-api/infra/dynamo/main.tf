resource "aws_dynamodb_table" "users_table" {
  name         = "sotf_users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key = "playlistId"
  attribute {
    name = "userId"
    type = "S"
  }
  attribute {
    name = "playlistId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "playlist_table" {
  name         = "sotf_playlists"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "playlistId"
  attribute {
    name = "playlistId"
    type = "S"
  }
}
