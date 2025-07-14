output "load_balancer_dns" {
  value = aws_lb.app.dns_name
} 