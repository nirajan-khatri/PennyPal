output "load_balancer_dns" {
  value = aws_lb.app.dns_name
}

output "artifact_bucket_name" {
  value = aws_s3_bucket.artifact_bucket.bucket
} 