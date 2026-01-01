output "alb_dns_name" {
  value       = aws_lb.main.dns_name
  description = "DNS name for the public ALB."
}

output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.frontend.domain_name
  description = "CloudFront distribution domain name."
}

output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.frontend.id
  description = "CloudFront distribution ID."
}

output "ecr_repository_urls" {
  value = {
    users   = aws_ecr_repository.users.repository_url
    orders  = aws_ecr_repository.orders.repository_url
    catalog = aws_ecr_repository.catalog.repository_url
  }
  description = "ECR repository URLs for service images."
}

output "frontend_bucket_name" {
  value       = aws_s3_bucket.frontend.bucket
  description = "S3 bucket for frontend assets."
}
