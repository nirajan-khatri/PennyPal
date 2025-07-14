import boto3

ec2 = boto3.client('ec2')

response = ec2.describe_instances()

for reservation in response['Reservations']:
    for instance in reservation['Instances']:
        instance_id = instance['InstanceId']
        state = instance['State']['Name']
        public_ip = instance.get('PublicIpAddress', 'N/A')
        print(f"Instance ID: {instance_id}, State: {state}, Public IP: {public_ip}") 