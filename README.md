# Microservices App (ECS + RDS + CDN)

This repo scaffolds a basic microservices architecture:

- **Frontend**: React app intended for S3 + CloudFront (AWS CDN).
- **Backend services**: Python/FastAPI microservices packaged for ECS Fargate.
- **Database**: MySQL (local via Docker, production via RDS).
- **Infra**: Terraform skeleton for AWS resources.

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

## ECS readiness

Each service has a dedicated Dockerfile and can be built for ECS/Fargate:

```bash
docker build -t users-service ./services/users
```

## Next steps

- Flesh out Terraform in `infra/` to provision VPC, ECS, RDS, S3, and CloudFront.
- Wire services to MySQL (RDS) with SQLAlchemy models and migrations.
