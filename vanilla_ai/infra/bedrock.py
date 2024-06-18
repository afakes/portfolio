#!/usr/bin/env python3
from bedrock_controller import BedrockController
        

def handler(event, context):
    
    body = event.get("body")

    try:
        # base64 decode 
        import base64
        body = base64.b64decode(body).decode("utf-8")
    except Exception as e:
        pass

    print(f"body = !!!{body}!!!")
    
    controller = BedrockController()
    result = controller.prompt_one(body)
    
    print(f"result = !!!{result}!!!")

    return result


if __name__ == "__main__":

    # get command line argument
    import sys
    if len(sys.argv) < 2:
        print("Usage: python bedrock.py <prompt filename>")
        sys.exit(1)
    
    fp = open(sys.argv[1], "r")
    content = fp.read()
    fp.close()

    # convert from json and get body of the request
    import json
    try:
        event = json.loads(content)
    except json.JSONDecodeError as e:
        print(f"{e}")
        sys.exit(1)
    
    handler(event, None)
    
    