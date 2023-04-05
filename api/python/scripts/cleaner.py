import re


def clean_content(content):
    cleaned_content = re.sub(
        "^(Se maskin\\u00f6vers\\u00e4ttning).+(Senast uppdaterad)\s+\d+.\w+\.?(\s\d+|\.\s\d+)?\s?(verified)?",
        "",
        content,
    )
    cleaned_content = re.sub("(visibility)\d+(Visningar).+", "", cleaned_content)
    cleaned_content = re.sub("(emailSkicka).+", "", cleaned_content)
    cleaned_content = cleaned_content.replace("\n", " ")
    return cleaned_content.strip()
