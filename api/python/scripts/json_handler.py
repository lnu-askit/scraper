import json


def write_to_json(data, file_name):
    json_data = json.dumps(data, indent=4)

    with open(file_name, "w", encoding="utf-8") as output:
        output.write(json_data)
    print("Wrote to file: " + file_name)
