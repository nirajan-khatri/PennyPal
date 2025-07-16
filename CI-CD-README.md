# CI/CD Pipeline Documentation

This document describes the comprehensive CI/CD pipeline setup for the cloud infrastructure project.

## 🚀 Overview

The CI/CD pipeline is built using **GitHub Actions** and provides:

- **Continuous Integration**: Automated testing, building, and validation
- **Continuous Deployment**: Automated deployment to staging and production
- **Infrastructure as Code**: Terraform-based infrastructure deployment
- **Security Scanning**: Automated vulnerability scanning
- **Monitoring**: Health checks and post-deployment testing

## 📋 Pipeline Components

### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

#### Triggers
- **Push** to `main` or `develop` branches
- **Pull Requests** to `main` branch

#### Jobs

##### Frontend CI
- **Node.js Setup**: Uses Node.js 18
- **Dependency Installation**: Installs npm dependencies with caching
- **Linting**: Runs ESLint for code quality
- **Building**: Creates production build
- **Artifact Upload**: Saves build artifacts for deployment

##### Backend CI
- **Node.js Setup**: Uses Node.js 18
- **Dependency Installation**: Installs npm dependencies
- **Testing**: Runs backend tests (if available)
- **Artifact Upload**: Saves backend files for deployment

##### Infrastructure Validation
- **Terraform Setup**: Installs Terraform 1.5.0
- **Format Check**: Validates Terraform code formatting
- **Initialization**: Runs `terraform init`
- **Validation**: Validates Terraform configuration
- **Planning**: Creates deployment plan

##### Python Scripts Validation
- **Python Setup**: Uses Python 3.11
- **Dependency Installation**: Installs boto3
- **Syntax Check**: Validates Python syntax
- **Linting**: Runs flake8 for code quality

##### Security Scan
- **Trivy Scanner**: Scans for vulnerabilities
- **SARIF Upload**: Uploads results to GitHub Security tab

##### Deployment Jobs
- **Staging Deployment**: Deploys to staging environment (develop branch)
- **Production Deployment**: Deploys to production environment (main branch)
- **Post-deployment Tests**: Health checks after deployment

### 2. Scheduled Maintenance (`.github/workflows/scheduled-tests.yml`)

#### Triggers
- **Daily Schedule**: Runs at 2 AM UTC
- **Manual Trigger**: Can be triggered manually

#### Jobs

##### Infrastructure Health Check
- **AWS Credentials**: Configures AWS access
- **Instance Check**: Lists EC2 instances using boto3
- **Infrastructure Status**: Checks Terraform plan

##### Dependency Updates
- **Frontend Dependencies**: Checks for outdated packages
- **Backend Dependencies**: Checks for outdated packages

##### Security Audit
- **Frontend Audit**: Runs npm audit
- **Backend Audit**: Runs npm audit

## 🐳 Containerization

### Docker Configuration

#### Backend Dockerfile
- **Multi-stage Build**: Optimized for production
- **Security**: Non-root user execution
- **Health Checks**: Built-in health monitoring
- **Port Exposure**: Exposes port 8080

#### Frontend Development Dockerfile
- **Development Environment**: Hot reloading support
- **Port Exposure**: Exposes port 3000
- **Volume Mounting**: For development file changes

#### Docker Compose
- **Local Development**: Complete development environment
- **Service Orchestration**: Backend, frontend, and DynamoDB local
- **Health Checks**: Service health monitoring

## 🔧 Setup Instructions

### 1. GitHub Repository Setup

#### Required Secrets
Add these secrets to your GitHub repository:

```bash
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

#### Environment Protection
Set up environment protection rules for:
- `staging` environment
- `production` environment

### 2. AWS Configuration

#### IAM User Permissions
Create an IAM user with these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:*",
        "vpc:*",
        "autoscaling:*",
        "elasticloadbalancing:*",
        "dynamodb:*",
        "iam:*"
      ],
      "Resource": "*"
    }
  ]
}
```

#### AWS CLI Configuration
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (us-east-1)
```

### 3. Local Development

#### Prerequisites
```bash
# Install Docker and Docker Compose
# Install Node.js 18
# Install Python 3.11
```

#### Running Locally
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔄 Deployment Process

### Staging Deployment (develop branch)
1. **Code Push**: Push to `develop` branch
2. **CI Pipeline**: Runs all validation jobs
3. **Infrastructure Deployment**: Deploys with 1 instance
4. **Application Deployment**: Deploys application code
5. **Health Check**: Verifies deployment success

### Production Deployment (main branch)
1. **Code Merge**: Merge to `main` branch
2. **CI Pipeline**: Runs all validation jobs
3. **Infrastructure Deployment**: Deploys with 3 instances
4. **Application Deployment**: Deploys application code
5. **Health Check**: Verifies deployment success
6. **Post-deployment Tests**: Runs additional tests

## 📊 Monitoring and Alerts

### Health Checks
- **Application Health**: HTTP health check endpoints
- **Infrastructure Health**: Terraform plan validation
- **Security Health**: Vulnerability scanning

### Logging
- **GitHub Actions**: Pipeline execution logs
- **AWS CloudWatch**: Application and infrastructure logs
- **Docker Logs**: Container logs for debugging

### Alerts
- **Pipeline Failures**: GitHub Actions notifications
- **Security Vulnerabilities**: Trivy scan results
- **Infrastructure Changes**: Terraform plan notifications

## 🛠️ Troubleshooting

### Common Issues

#### 1. AWS Credentials Error
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify GitHub secrets are set correctly
```

#### 2. Terraform State Issues
```bash
# Reinitialize Terraform
cd terraform
terraform init -reconfigure
```

#### 3. Docker Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### 4. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :8080

# Kill conflicting processes
sudo kill -9 <PID>
```

### Debugging Commands

#### Check Pipeline Status
```bash
# View GitHub Actions logs
# Go to Actions tab in GitHub repository
```

#### Check Infrastructure Status
```bash
cd terraform
terraform plan
terraform show
```

#### Check Application Health
```bash
# Test backend health
curl http://localhost:8080/health

# Test frontend
curl http://localhost:3000
```

## 🔒 Security Considerations

### Secrets Management
- **GitHub Secrets**: Store sensitive data securely
- **AWS IAM**: Use least privilege principle
- **Environment Variables**: Never commit secrets to code

### Security Scanning
- **Trivy**: Container and dependency vulnerability scanning
- **npm audit**: Node.js dependency security
- **CodeQL**: GitHub's code security analysis

### Infrastructure Security
- **Security Groups**: Restrict network access
- **IAM Roles**: Use role-based access control
- **VPC**: Isolate resources in private subnets

## 📈 Scaling and Performance

### Auto Scaling
- **EC2 Auto Scaling**: Automatic instance management
- **Load Balancer**: Traffic distribution
- **Health Checks**: Automatic instance replacement

### Performance Monitoring
- **CloudWatch Metrics**: AWS resource monitoring
- **Application Metrics**: Custom application metrics
- **Log Analysis**: Centralized logging

## 🎯 Best Practices

### Code Quality
- **Linting**: Enforce code standards
- **Testing**: Automated test execution
- **Code Review**: Peer review process

### Infrastructure
- **Version Control**: Track infrastructure changes
- **Backup Strategy**: Regular state backups
- **Disaster Recovery**: Multi-region deployment

### Deployment
- **Blue-Green Deployment**: Zero-downtime deployments
- **Rollback Strategy**: Quick rollback procedures
- **Monitoring**: Real-time deployment monitoring

## 📝 Maintenance

### Regular Tasks
- **Dependency Updates**: Monthly dependency reviews
- **Security Patches**: Weekly security scans
- **Infrastructure Updates**: Quarterly infrastructure reviews

### Backup Strategy
- **Terraform State**: Regular state backups
- **Application Data**: Database backups
- **Configuration**: Configuration backups

---

**Note**: This CI/CD pipeline is designed for academic demonstration and can be enhanced for production use with additional security measures, monitoring, and automation features. 