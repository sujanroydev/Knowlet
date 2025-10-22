import os

# Folder where your HTML files are stored
folder_path = "papers/notes"

# Loop through all files in the folder
for filename in os.listdir(folder_path):
    if filename.endswith(".html"):
        file_path = os.path.join(folder_path, filename)

        # Read the file content
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()

        # Replace the title only if it matches exactly
        new_content = content.replace(
            "<title>Papers – Knowlet</title>",
            "<title>Units – Knowlet</title>"
        )

        # Write back the modified content
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(new_content)

        print(f"Updated title in: {filename}")

print("✅ All matching HTML files updated successfully.")