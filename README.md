# Cloud Infrastructure as Code Project

This project demonstrates Infrastructure as Code (IaC) principles using multiple tools and cloud providers to create a scalable cloud infrastructure. The project showcases rapid elasticity (NIST requirement) and extends beyond basic lab exercises with additional cloud services.

## 🏗️ Project Overview

This project provisions a complete cloud infrastructure for a scalable web application using:

- **Terraform** for AWS infrastructure provisioning
- **Boto3** for AWS resource management and automation
- **AWS Services**: EC2, VPC, Auto Scaling, Load Balancer, DynamoDB

## 📁 Project Structure

```
cloud/
├── terraform/           # Terraform IaC configuration
│   ├── main.tf         # Main infrastructure definition
│   ├── variables.tf    # Variable definitions
│   ├── outputs.tf      # Output values
│   └── user_data.sh.tmpl # Instance bootstrap script
├── boto3/              # Python AWS automation scripts
│   └── list_instances.py # List EC2 instances
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

1. **AWS CLI** installed and configured with credentials
2. **Terraform** installed (version >= 1.0)
3. **Python** with boto3 library
4. **AWS Account** with appropriate permissions

### Installation

```bash
# Install boto3 for Python AWS automation
pip install boto3

# Install Terraform (if not already installed)
# Download from: https://www.terraform.io/downloads.html
```

### Running the Infrastructure

#### 1. Deploy with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Apply the infrastructure
terraform apply

# To destroy resources when done
terraform destroy
```

#### 2. Use Boto3 Scripts

```bash
cd boto3

# List all EC2 instances
python list_instances.py
```

## 📈 Scalability (NIST Rapid Elasticity)

### How to Scale the Infrastructure

The infrastructure is designed for easy scaling. Here's how to modify the number of instances:

#### Option 1: Modify Terraform Variables

Edit `terraform/variables.tf` and change the `instance_count` variable:

```hcl
variable "instance_count" {
  description = "Number of EC2 instances to launch"
  type        = number
  default     = 1  # Change this to 3, 5, 7, etc. for scaling
}
```

Then run:
```bash
terraform apply
```

#### Option 2: Use Terraform Command Line

```bash
terraform apply -var="instance_count=5"
```

#### Option 3: Create a Terraform Workspace

```bash
terraform workspace new production
terraform apply -var="instance_count=10"
```

### Auto Scaling Configuration

The infrastructure includes an Auto Scaling Group that can automatically scale based on demand:

- **Current Setup**: Manual scaling via `instance_count` variable
- **Future Enhancement**: Can be modified to use CloudWatch alarms for automatic scaling

## 🛠️ Infrastructure Components

### 1. Networking (VPC)
- **VPC**: Custom Virtual Private Cloud with CIDR `10.0.0.0/16`
- **Subnets**: Two public subnets across different availability zones
- **Internet Gateway**: Provides internet access
- **Route Tables**: Configured for public internet access

### 2. Compute (EC2)
- **Launch Template**: Defines instance specifications
- **Auto Scaling Group**: Manages EC2 instances with scaling capabilities
- **Security Groups**: Controls inbound/outbound traffic
- **User Data**: Bootstraps instances with application setup

### 3. Load Balancing
- **Application Load Balancer**: Distributes traffic across instances
- **Target Group**: Health checks and traffic routing
- **Listener**: HTTP traffic on port 80

### 4. Database (DynamoDB)
- **Transactions Table**: Stores application transaction data
- **Users Table**: Stores user information
- **Pay-per-request**: Cost-effective for variable workloads

### 5. Security
- **Security Groups**: Allow HTTP (8080), SSH (22), and all outbound traffic
- **Key Pairs**: SSH access to instances (configure via variables)

## 🔧 Tools and Services Used

### 1. Infrastructure as Code Tools
- **Terraform**: Primary IaC tool for AWS resource provisioning
- **Boto3**: Python SDK for AWS automation and resource management

### 2. AWS Services (Beyond Basic Lab Exercises)
- **EC2 Auto Scaling**: Automatic instance management
- **Application Load Balancer**: Traffic distribution and health checks
- **DynamoDB**: NoSQL database for application data
- **VPC**: Custom networking with multiple subnets
- **Security Groups**: Network security configuration

### 3. Additional Features
- **Multi-AZ Deployment**: High availability across availability zones
- **Health Checks**: Automatic instance health monitoring
- **User Data Scripts**: Automated instance configuration
- **Variable-based Configuration**: Easy customization and scaling

## 📊 Monitoring and Management

### List Instances
```bash
cd boto3
python list_instances.py
```

Output example:
```
Instance ID: i-1234567890abcdef0, State: running, Public IP: 52.23.45.67
Instance ID: i-0987654321fedcba0, State: running, Public IP: 52.23.45.68
```

### Terraform Outputs
```bash
cd terraform
terraform output
```

## 🔄 Scaling Examples

### Scale to 3 Instances
```bash
terraform apply -var="instance_count=3"
```

### Scale to 5 Instances
```bash
terraform apply -var="instance_count=5"
```

### Scale to 10 Instances
```bash
terraform apply -var="instance_count=10"
```

## 🎯 How This Extends Lab Ideas

### 1. Beyond Basic EC2 Management
- **Lab Focus**: Basic EC2 instance creation and management
- **This Project**: Complete infrastructure with networking, load balancing, and database

### 2. Advanced AWS Services
- **Lab Focus**: Simple EC2 and S3 usage
- **This Project**: Auto Scaling, Load Balancer, DynamoDB, VPC configuration

### 3. Scalability Implementation
- **Lab Focus**: Manual instance management
- **This Project**: Variable-based scaling with Auto Scaling Groups

### 4. Multiple Tools Integration
- **Lab Focus**: Single tool usage
- **This Project**: Terraform + Boto3 for comprehensive automation

## 🚨 Important Notes

### AWS Credentials
Ensure your AWS credentials are configured:
```bash
aws configure
```

### Cost Considerations
- DynamoDB uses pay-per-request billing
- EC2 instances incur charges while running
- Load Balancer has hourly charges
- Remember to destroy resources when done: `terraform destroy`

### Security
- Security groups allow broad access (0.0.0.0/0) for demonstration
- In production, restrict to specific IP ranges
- SSH key pairs should be properly configured

## 📝 Troubleshooting

### Common Issues

1. **Terraform Init Fails**
   ```bash
   # Ensure you're in the terraform directory
   cd terraform
   terraform init
   ```

2. **Boto3 Import Error**
   ```bash
   pip install boto3
   ```

3. **AWS Credentials Not Found**
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret Access Key, Region
   ```

4. **Instance Launch Fails**
   - Check if the specified key pair exists in AWS
   - Verify the AMI is available in your region
   - Check security group configurations

## 🎓 Academic Requirements Met

### ✅ Infrastructure as Code
- Terraform configuration for complete AWS infrastructure
- Boto3 scripts for AWS resource management
- Version-controlled infrastructure definitions

### ✅ Scalability (NIST Rapid Elasticity)
- Variable-based instance count configuration
- Auto Scaling Group for automatic instance management
- Easy scaling from 1 to N instances

### ✅ Multiple Tools and Providers
- **Terraform**: Infrastructure provisioning
- **Boto3**: AWS automation and management
- **AWS**: Cloud provider with multiple services

### ✅ Additional Services Beyond Labs
- Application Load Balancer
- DynamoDB NoSQL database
- Auto Scaling Groups
- VPC with custom networking
- Multi-AZ deployment

## 📦 Submission

To prepare your submission:

1. **Create a ZIP file** containing:
   - `terraform/` directory (all .tf files)
   - `boto3/` directory (Python scripts)
   - `README.md` (this file)

2. **Exclude**:
   - Frontend/backend application code (unless required)
   - `.terraform/` directories
   - Any sensitive information

3. **Verify**:
   - All scripts are functional
   - README explains scaling procedures
   - Documentation covers all tools and services used

---

**Note**: This project demonstrates advanced cloud infrastructure concepts while maintaining simplicity for academic evaluation. The infrastructure can be easily scaled and modified to meet different requirements. 