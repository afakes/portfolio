#!/usr/bin/env python3

# deploy files as an AWS Lambda function
import boto3
import os
import json
from zipfile import ZipFile


class deploy():

    def __init__(self):
        self.application_name = self.get_application_name
        self.role_arn = None
        self.remote_code_path = None


    @property
    def code_bucket_name(self):
        return "code.adamfakes.com"


    @property
    def region(self):
        return "us-east-1"

    @property
    def app_shortname(self):
        return "bedrock"

    # method unique string for the name of tha application
    @property
    def get_application_name(self):
        # create a random suffix string
        import random
        import string
        suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        return f"{self.app_shortname}_{suffix}"


    def main(self):
        self.role()
        self.package_zip()
        self.upload_zip()
        
        self.lambda_function()

    @property
    def source_filenames(self):
        return [
            f"{self.app_shortname}_controller.py",
            f"{self.app_shortname}.py",
        ]

    @property
    def destination_filename(self):
        return f"{self.app_shortname}.zip"


    def package_zip(self):
        # Create a zip file with the source files

        print(f"Package Zip: start")
        
        if os.path.exists(self.destination_filename):
            os.remove(self.destination_filename)

        zip_object = ZipFile(self.destination_filename, 'w')  # Create a ZipFile Object

        # Get the list of files in the current working directory
        for file in self.source_filenames:
            print(f"add to zip file: {file}")
            zip_object.write(file)

        dist_packages_folder = "/usr/local/lib/python3.10/dist-packages"

        packages = []

        # get a list of packages from requirements.txt
        with open("requirements.txt", "r") as fp:
            for line in fp:
                line = line.strip()
                # if starts with # or is empty, skip
                if not line.startswith("#") and not line == "":
                    packages.append(line)


        for package_name in packages:

            print(f"add package to zip file: {package_name}")
        
            folder = f"{dist_packages_folder}/{package_name}"    
            # add entire folder to zip file
            for root, dirs, files in os.walk(folder):
                for file in files:
                    arcname = os.path.relpath(os.path.join(root, file), os.path.join(dist_packages_folder, '..')).replace("dist-packages","")
                    zip_object.write(os.path.join(root, file), arcname)

        zip_object.close()

        if not os.path.exists(self.destination_filename):
            print(f"failed to create zip file")
            return None
        
        print(f"Package Zip: {self.destination_filename} created successfully.")

        return self.destination_filename


    def upload_zip(self):
        # Upload the zip file to an S3 bucket

        print(f"Upload Zip: start")

        # Create an S3 client
        s3 = boto3.client("s3", region_name=self.region)

        # Upload the zip file to an S3 bucket
        self.remote_code_path = f"code/{self.app_shortname}.zip"
        s3.upload_file(self.destination_filename, self.code_bucket_name, self.remote_code_path)

        print(f"Upload Zip: {self.destination_filename} uploaded successfully.")
        print(f"Upload Zip: end")

        return True


    def role(self):
        # Create an IAM role for the Lambda function

        print(f"Role: start")

        # Create an IAM client
        iam = boto3.client("iam", region_name=self.region)

        role_name = f"{self.application_name}-lambda-role"
        role_description = f"IAM for {self.application_name}"


        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "lambda.amazonaws.com",
                    },
                    "Action": "sts:AssumeRole",
                },
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "s3.amazonaws.com",
                    },
                    "Action": "sts:AssumeRole",
                },
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "apigateway.amazonaws.com",
                    },
                    "Action": "sts:AssumeRole",
                }
            ]
        }

        response = iam.create_role(
            RoleName    = role_name,
            Description = role_description,
            AssumeRolePolicyDocument = json.dumps(assume_role_policy_document)
        )


        print(f"create_role response: {response}")

        role_arn = response["Role"]["Arn"]

        print(f"role_arn: {role_arn}")

        print(f"Role: {role_name} created successfully.")

        # Attach a policy to the role
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "bedrock:*",
                        "s3:*",
                        "lambda:*",
                        "logs:CreateLogGroup",
                        "logs:CreateLogStream",
                        "logs:DescribeLogStreams",
                        "logs:GetLogEvents",
                        "logs:PutLogEvents",
                        "logs:PutRetentionPolicy",
                        "apigateway:*",
                        "iam:*",
                    ],
                    "Resource": "*"
                }
                
            ]
        }

        # TODO: update  Resource to be more specific

        policy_name = f"{self.application_name}-lambda-policy"

        response = iam.create_policy(
            PolicyName     = policy_name,
            PolicyDocument = json.dumps(policy_document),
            Description    = role_description,
        )

        print(f"create_policy response: {response}")


        print(f"Role: {policy_name} created successfully.")

        policy_arn = response["Policy"]["Arn"]

        response = iam.attach_role_policy(
            RoleName  = role_name,
            PolicyArn = policy_arn,
        )

        print(f"attach_role_policy response: {response}")

        print(f"Role: {policy_name} attached to role {role_name} successfully.")
        

        self.role_arn = role_arn

        print(f"Role: end role_arn = {self.role_arn}")

        # wait 10 seconds
        print(f"Role: waiting 10 seconds")
        import time
        time.sleep(10)

        return True


    def lambda_function(self):
        
        print(f"Lambda Function: start")

        # Create an AWS Lambda client
        client = boto3.client("lambda", region_name=self.region)

        response = client.create_function(
            FunctionName = f"{self.application_name}-lambda",
            Runtime      = "python3.10",
            Role         = self.role_arn,
            Handler      = f"{self.app_shortname}.handler",
            Code         = { "S3Bucket": self.code_bucket_name, "S3Key": self.remote_code_path },
            Timeout      = 60 * 10, # 10 minutes
            MemorySize   = 256
        )

        print(response)

        print(f"Lambda Function: {self.application_name}-lambda created successfully.")


        # add create_function_url_config
        response = client.create_function_url_config(
            FunctionName = f"{self.application_name}-lambda",
            AuthType     = "NONE",
            Cors={
                'AllowCredentials': False,
                'AllowMethods': [ 'GET', 'POST' ],
                'AllowOrigins': [ '*' ],
                'AllowHeaders': [ '*' ],
                'MaxAge': 0
            }
        )
        
        function_url = response["FunctionUrl"]

        print(f"Lambda Function: {self.application_name}-lambda url: {function_url}")

        # add permission
        response = client.add_permission(
            FunctionName = f"{self.application_name}-lambda",
            StatementId = f"{self.application_name}-lambda-permission",
            Action = "lambda:InvokeFunctionUrl",
            Principal = "*",
            FunctionUrlAuthType = 'NONE'
        )

        print(f"Lambda Function: add_permission response: {response}")


        # we need to re-write ../bedrock_api.js
        # with the new function_url
        with open("../bedrock_api.js", "w") as fp:
            fp.write(f"""bedrock_endpoint = "{function_url}";\n""")

        print(f"Lambda Function: end")

if __name__ == "__main__":
    controller = deploy()
    controller.main()
    
