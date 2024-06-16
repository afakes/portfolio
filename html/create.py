#!/usr/bin/python3

# create HTML version of resume.
import os

url = "https://raw.githubusercontent.com/afakes/resume/master/resume.json"

def page_width():
    return 100

def line():
    return "-" * page_width()

def double_line():
    return "=" * page_width()

def title(data = None, section_type = None):
    if data is  None: return ""
    return f"""<h1>{data.upper()}</h1>\n"""

def heading(data = None, section_type = None):
    if data is  None: return ""
    return f"""<h2>{data.upper()}</h2>\n"""

def subheading(data = None, section_type = None):
    if data is  None: return ""    
    return f"""<h3>{data}</h3>\n"""

def summary(data = None, section_type = None):
    if data is  None: return ""
    return f"""<h4>{data.upper()}</h4>\n"""


def key_value(data = None, section_type = None):
    if data is  None: return ""

    content = """<ul class="key_value">"""

    for key_value in data:

        key = key_value.get("key")
        value = key_value.get("value")
        
        content += f"""<li><span>{key}</span><span>{value}</span></li>\n"""

    content += f"""</ul>\n"""
    return content

def points(data = None, section_type = None):
    if data is  None: return ""

    content = "<ul>\n"
    for point in data:
        content += f"""<li>{point}</li>\n"""

    content += f"""</ul>\n"""
    
    return content

def date(data = None, section_type = None):
    if data is  None: return ""
    content = f"""<span>{data.get("from","").upper()}</span> to <span>{data.get("to","").upper()}</span>\n"""
    return content

def articles(data = None, section_type = None):
    if data is  None: return ""

    
    content = ""
    for article in data:
        content += "<article>"
        if "heading"    in article:  content += heading(article.get("heading"))
        if "summary"    in article:  content += summary(article.get("summary"))
        if "subheading" in article:  content += subheading(article.get("subheading"))
        if "date"       in article:  content += date(article.get("date"))
        if "key_value"  in article:  content += key_value(article.get("key_value"), section_type)
        if "points"     in article:  content += points(article.get("points"))
        content += f"""</article>\n"""

    return content


def section(data = None):
    if data is  None: return ""

    section_type = data.get("type")

    raw_content = ""
    
    if "heading"    in data: raw_content += heading(data.get("heading"), section_type)
    if "subheading" in data: raw_content += subheading(data.get("subheading"), section_type)
    if "summary"    in data: raw_content += summary(data.get("summary"), section_type)
    if "articles"   in data: raw_content += articles(data.get("articles"), section_type)


    content = f"""<section id="{data.get("type","")}">"""
    
    if "title" in data: content += title(data.get("title"), section_type)
    
    content += raw_content
    
    content += f"""</section>\n"""

    return content


def create_html_resume():
    
    # read the content of url
    import urllib.request
    import json

    sections = []
    with urllib.request.urlopen(url) as response:
        data = response.read()
        sections = json.loads(data)

    result = ""
    for section_data in sections:
        result += section(section_data)

    return result

def main():

    print("Creating HTML version of resume...")
    html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Adam Fakes</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">

            <link rel="stylesheet" type="text/css" href="index.css">
        </head>
        <body >
            <div id="container">
                {create_html_resume()}
            </div>
        </body>
        </html>
    """

    with open("index.html", "w") as f:
        f.write(html_content)

    print("HTML version of resume created successfully.")


if __name__ == '__main__':
    main()