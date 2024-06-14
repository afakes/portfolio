#!/usr/bin/python3

# create text version of resume.
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

    content = f"""\n"""
    content += f"""{data.upper()}\n"""
    content += f"""{double_line()}\n"""
    content += f"""\n"""
    
    return content

def heading(data = None, section_type = None):
    if data is  None: return ""

    content  = f"""{data.upper()}\n"""
    content += f"""{line()}\n"""
    
    return content


def subheading(data = None, section_type = None):
    if data is  None: return ""
    content = f"""{data}\n"""
    return content


def summary(data = None, section_type = None):
    if data is  None: return ""
    content = f"""{data.upper()}\n"""
    return content


def key_value(data = None, section_type = None):
    if data is  None: return ""

    content = ""
    for key_value in data:

        key = key_value.get("key")
        value = key_value.get("value")


        if section_type == "skills":
            key = f"{key} years"
            content += f"""{key : >12} {value}\n"""
        else:
            
            content += f""" - {key: <12} {value}\n"""
        

    content += f"""\n"""
    
    return content

def points(data = None, section_type = None):
    if data is  None: return ""

    import textwrap

    content = ""
    for point in data:

        formatted_points = textwrap.wrap(point, width=page_width() * 0.9)
        for [i, sub_point] in enumerate(formatted_points):
            if i == 0:
                content += f""" * {sub_point}\n"""
            else:
                content += f"""   {sub_point}\n"""

        content += f"""\n"""

    content += f"""\n"""
    
    return content

def date(data = None, section_type = None):
    if data is  None: return ""

    content = f"""- {data.get("from","").upper()} to {data.get("to","").upper()} \n"""
    content += f"""\n"""
    
    return content

def articles(data = None, section_type = None):
    if data is  None: return ""

    content = ""
    for article in data:

        if "heading"    in article: 
            content += "\n"
            content += heading(article.get("heading"))

        if "summary"    in article: 
            content += summary(article.get("summary"))

        
        if "subheading" in article: 
            content += subheading(article.get("subheading"))
        
        if "date"       in article: 
            content += date(article.get("date"))

        if "key_value"  in article: 
            content += key_value(article.get("key_value"), section_type)
        
        if "points"     in article: 
            content += points(article.get("points"))

    content += f"""\n"""
    
    return content

def prepend_spaces(raw_content, spaces = 4):
    # prepend each lines in the section with 4 spaces
    raw_content = "\n".join([(" " * spaces) + line for line in raw_content.split("\n")])
    return raw_content

def section(data = None):
    if data is  None: return ""

    section_type = data.get("type")

    raw_content = ""
    
    if "heading"    in data: raw_content += heading(data.get("heading"), section_type)
    if "subheading" in data: raw_content += subheading(data.get("subheading"), section_type)
    if "summary"    in data: raw_content += summary(data.get("summary"), section_type)
    if "articles"   in data: raw_content += articles(data.get("articles"), section_type)


    content = ""
    if "title" in data: content += title(data.get("title"), section_type)
    content += prepend_spaces(raw_content, 2)

    return content


def create_text_resume():
    print("Creating text version of resume...")

    # read the content of url
    import urllib.request
    import json

    sections = []
    with urllib.request.urlopen(url) as response:
        data = response.read()
        sections = json.loads(data)

    result = ""
    for section_data in sections:

        raw_section = section(section_data)

        result += raw_section

    return result

def main():
    text_content = create_text_resume()

    with open("resume.txt", "w") as f:
        f.write(text_content)
    
    print("Text version of resume created successfully.")


if __name__ == '__main__':
    main()