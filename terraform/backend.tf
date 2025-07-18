terraform {
  backend "s3" {
    bucket = "my-expense-tracker-artifacts"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
} 