import re

file_path = r"e:\Rifqi File\Dokumen\Bang Kesehatan\Ngoding\src\data\articles.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

def replacer(match):
    id_num = int(match.group(1))
    article_id = f"SND-{id_num:03d}"
    return f"id: {id_num},\n    articleId: '{article_id}',"

new_content = re.sub(r"id:\s*(\d+),", replacer, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated articles.js with articleIds")
