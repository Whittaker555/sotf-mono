# Survival of the Fittest - Monorepo

This monorepo contains all components of the Survival of the Fittest application.

## 📁 Project Structure

```
├── .github/          # GitHub Actions workflows (monorepo-wide)
├── sotf/            # Frontend Next.js application
│   ├── app/         # Next.js application code
│   └── infra/       # Frontend infrastructure (S3, CloudFront)
├── sotf-api/        # Backend API
│   ├── app/         # Express/Lambda API code
│   └── infra/       # API infrastructure (Lambda, API Gateway, DynamoDB)
└── sotf-poller/     # Background polling service
    ├── app/         # Polling service code
    └── infra/       # Poller infrastructure (empty - to be added)
```

## 🚀 Deployment

### API Deployment
The API is automatically deployed via GitHub Actions when changes are pushed to the `main` branch in the `sotf-api/` directory.

### Frontend Deployment
Frontend deployment configuration is in `sotf/infra/`.

### Infrastructure Deployment
Each component has its own infrastructure in the respective `infra/` directories:

```bash
# Deploy API infrastructure
cd sotf-api/infra && terraform init && terraform apply

# Deploy frontend infrastructure  
cd sotf/infra && terraform init && terraform apply

# Deploy poller infrastructure (when ready)
cd sotf-poller/infra && terraform init && terraform apply
```

## 🛠️ Development

### Frontend
```bash
cd sotf/app
npm install
npm run dev
```

### API
```bash
cd sotf-api/app
yarn install
yarn dev
```

### Poller
```bash
cd sotf-poller/app
npm install
npm start
```

## 📋 Environment Variables

Each component requires its own environment variables. See the README files in each component for specific requirements:

- `sotf/app/README.md` - Frontend environment variables
- `sotf-api/app/` - API environment variables  
- `sotf-poller/app/` - Poller environment variables