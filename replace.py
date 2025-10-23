import os

folder_path = "semesters/subjects/"

for filename in os.listdir(folder_path):
    if filename.endswith(".html"):
        file_path = os.path.join(folder_path, filename)

        # Read the file content
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
            new_content = content

        # Create readable title from filename
        base_name = os.path.splitext(filename)[0]
        parts = base_name.split("_")
        special = {"dsc": "DSC","dsm": "DSM", "sec": "SEC", "idc": "IDC"}
        title_text = " ".join(special.get(word.lower(), word.capitalize()) for word in parts)
        full_title = f"<title>{title_text} – Knowlet</title>"
        h1 = f"<h1>{title_text}</h1>"

        # Check for title/h1 and replace only if found
        if "<title>Papers – Knowlet</title>" in content:
            new_content = new_content.replace("<title>Papers – Knowlet</title>", full_title)
        if "<h1>Papers</h1>" in content:
            new_content = new_content.replace("<h1>Papers</h1>", h1)
        if "<p>Select a unit to view notes and study materials</p>" in content:
        	new_content = new_content.replace("<p>Select a unit to view notes and study materials</p>", "<p>Select a paper to continue</p>")

        # Check for URLs and replace only if found
        '''if "_semester_1" in new_content:
            if "subjects/" in new_content:
            	new_content = new_content.replace("subjects/", "subjects/semester_1_")
            	new_content = new_content.replace("_semester_1", "")'''

        # Write back only if there is a change
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(new_content)
            print(f"{filename} → updated")
        else:
            print(f"{filename} → no changes needed")

print("✅ All matching HTML files processed successfully.")