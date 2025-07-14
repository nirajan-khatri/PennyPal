variable "aws_region" {
  description = "AWS region to deploy to"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "key_name" {
  description = "Name of the AWS key pair to use for SSH"
  default     = "expense-tracker-key"
}

variable "instance_count" {
  description = "Number of EC2 instances to launch"
  default     = 2
} 