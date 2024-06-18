import os
import json
import boto3
from botocore.exceptions import ClientError

class BedrockController():

    def __init__(self):
        pass

    @property
    def region(self):
        return "us-east-1"

    @property
    def error_string(self):
        return "Sorry Dev, I'm afriad I can't do that."

    def prompt_one(self, textPrompt = None):
        if textPrompt is None or len(textPrompt) == 0: return self.error_string
        return self.remote(textPrompt)

    def remote(self, textPrompt = None):
        if textPrompt is None or len(textPrompt) == 0: return self.error_string
        
        # Create a Bedrock Runtime client.
        try:
            client = boto3.client("bedrock-runtime", region_name=self.region)
        except (ClientError, Exception) as e:
            print(f"ERROR: Can't create Bedrock Runtime client. Reason: {e}")
            return self.error_string


        model_id = "amazon.titan-text-express-v1"

        # Start a conversation with the user message.
        user_message = textPrompt
        user_message = user_message.strip().replace("\n", " ").replace("\r", " ").replace("\t", " ")
        
        max_len = 4096
        if len(user_message) > max_len: user_message = user_message[:max_len]

        conversation = [
            {
                "role": "user",
                "content": [{"text": user_message}],
            }
        ]

        try:
            # Send the message to the model, using a basic inference configuration.
            response = client.converse(
                modelId  = model_id,
                messages = conversation,
                inferenceConfig = {"maxTokens": 1024, "temperature": 0.5, "topP": 0.9},
            )

            # Extract and print the response text.
            response_text = response["output"]["message"]["content"][0]["text"]
            
            return response_text

        except (ClientError, Exception) as e:
            print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
            return self.error_string

