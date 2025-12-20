# Microservices App (ECS + RDS + CDN)

This repo scaffolds a basic microservices architecture:

- **Frontend**: React app intended for S3 + CloudFront (AWS CDN).
- **Backend services**: Python/FastAPI microservices packaged for ECS Fargate.
- **Database**: MySQL (local via Docker, production via Aurora MySQL on RDS).
- **Infra**: Terraform configuration for AWS resources.

## Repository layout

- `frontend/`: React app (Vite).
- `services/`: Python microservices (`users`, `orders`, `catalog`).
- `docker/`: Local nginx gateway config.
- `infra/`: Terraform configuration (AWS).

## Local development

```bash
# build and run services + db + gateway
Docker compose up --build
```

Services:
- API gateway: `http://localhost:8080`
- Users service: `http://localhost:8001/users`
- Orders service: `http://localhost:8002/orders`
- Catalog service: `http://localhost:8003/catalog`

Frontend:

```bash
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

## AWS deployment (Terraform)

This stack assumes you already have a VPC with public/private subnets, and you want to
reuse those existing resources.

### Required AWS inputs

You will need the following values from your AWS account:

- **VPC ID** (existing VPC)
- **Public subnet IDs** (for ALB)
- **Private subnet IDs** (for ECS tasks + Aurora)
- **Route53 hosted zone ID** (for DNS validation and alias records)
- **Custom domains**
  - `app.yourdomain.com` for CloudFront
  - `api.yourdomain.com` for ALB
- **Aurora MySQL password** (master password)

### Finding existing VPC and subnet IDs

If you already have networking in place, you can pull the IDs with the AWS CLI:

```bash
aws ec2 describe-vpcs --query "Vpcs[].VpcId" --output text
aws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-xxxxxxxx" --query "Subnets[].{id:SubnetId,az:AvailabilityZone}" --output table
```

Use public subnets for the ALB and private subnets for ECS + Aurora.

### Terraform variables

Copy the example file and update the values:

```bash
cp infra/terraform.tfvars.example infra/terraform.tfvars
```

Then apply:

```bash
cd infra
terraform init
terraform apply
```

### CloudFront + ALB certificates

Terraform creates ACM certificates and Route53 validation records for both:

- Frontend: `domain_name`
- API: `api_domain_name`

Certificates must be in **us-east-1** for CloudFront.

## GitHub Actions (OIDC)

The workflow `.github/workflows/deploy.yml` uses GitHub OIDC to deploy.
Create the following GitHub repository secrets:

- `AWS_ROLE_ARN` (OIDC role ARN)
- `AWS_VPC_ID`
- `AWS_PUBLIC_SUBNET_IDS` (JSON array string, e.g. `["subnet-aaa","subnet-bbb"]`)
- `AWS_PRIVATE_SUBNET_IDS` (JSON array string, e.g. `["subnet-ccc","subnet-ddd"]`)
- `ROUTE53_ZONE_ID`
- `FRONTEND_DOMAIN_NAME` (e.g. `app.example.com`)
- `API_DOMAIN_NAME` (e.g. `api.example.com`)
- `AURORA_DB_PASSWORD`

The workflow will:

1. Create ECR repos (Terraform target step).
2. Build/push Docker images.
3. Apply full Terraform stack (ECS, ALB, Aurora, S3, CloudFront).
4. Build frontend and sync to S3.
5. Invalidate CloudFront cache.

## ECS readiness

Each service has a dedicated Dockerfile and can be built for ECS/Fargate:

```bash
docker build -t users-service ./services/users
```
