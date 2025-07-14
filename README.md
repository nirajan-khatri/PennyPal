# Scalable Expense Tracker Web App (Node.js + React + Terraform on AWS)

## Overview
This project is a simple, scalable Expense Tracker web application. It demonstrates rapid elasticity and infrastructure as code using AWS, Terraform, Node.js, and React.

- **Frontend:** React app for managing expenses (add, list, delete, show total)
- **Backend:** Node.js (Express) API for CRUD operations (in-memory storage)
- **Deployment:**
  - Node.js server (serves both API and static React build) runs on N EC2 instances (scalable)
  - Application Load Balancer distributes traffic
  - All infrastructure managed with Terraform
- **(Bonus):** Boto3 script for automation

## Project Structure
```
cloud/
├── backend/                # Node.js Express API (serves React build too)
│   └── index.js
├── frontend/               # React Expense Tracker app
│   ├── public/
│   └── src/
├── terraform/              # Terraform IaC files
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── boto3/                  # (Bonus) Python scripts for AWS automation
│   └── list_instances.py
└── README.md               # Instructions and explanations
```

## How to Deploy
1. **Build the React frontend:**
   - `cd frontend`
   - `npm install && npm run build`
2. **Build the backend Docker image (optional for local testing):**
   - `cd backend`
   - `npm install`
   - `node index.js`
3. **Provision AWS infrastructure with Terraform:**
   - `cd terraform`
   - Edit `variables.tf` to set the desired number of EC2 instances
   - `terraform init && terraform apply`
4. **Access the app:**
   - The public DNS of the load balancer will be output by Terraform

## How to Scale
- Change the `instance_count` variable in `terraform/variables.tf` to scale the number of backend servers.
- Run `terraform apply` again to update the infrastructure.

## Cleanup
- Run `terraform destroy` in the `terraform` directory to remove all AWS resources.

## Notes
- The backend uses in-memory storage for simplicity. For production, use a database (e.g., DynamoDB, RDS).
- The React app is served as static files by the Node.js backend.
- Make sure your AWS credentials are configured (e.g., via AWS CLI or environment variables).

## Bonus
- Use the Boto3 script in `boto3/list_instances.py` to list, start, or stop EC2 instances. 