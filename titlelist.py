import os
import re

folder_path = "semesters/subjects/papers/notes"

for filename in os.listdir(folder_path):
    if filename.endswith(".html"):
        file_path = os.path.join(folder_path, filename)

        # Read the file content
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
            new_content = content
            
            pattern = r'\<title>(.*?)\</title>'
            
            
            matches = re.findall(pattern, text)

# re.findall returns all matches as a list
matches = re.findall(pattern, text)

print(matches)