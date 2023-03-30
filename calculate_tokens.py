import json

import tiktoken

json_file = open("./workfiles/raw_info.json")

json_data = json.load(json_file)


def num_tokens_from_string(string: str, encoding_name: str) -> int:
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens


calculations = {
    "min_tokens": float("inf"),
    "max_tokens": 0,
    "avg_tokens": 0,
    "total_tokens": 0,
    "num_of_blobs": 0,
    "calculated_cost_embedding(US dollar)": 0,
}

for blob in json_data["informationBlobs"]:
    tokens = num_tokens_from_string(blob["content"], "cl100k_base")
    calculations["num_of_blobs"] += 1
    calculations["min_tokens"] = min(calculations["min_tokens"], tokens)
    calculations["max_tokens"] = max(calculations["max_tokens"], tokens)
    calculations["total_tokens"] += tokens

calculations["avg_tokens"] = (
    calculations["total_tokens"] / calculations["num_of_blobs"]
)

calculations["calculated_cost_embedding(US dollar)"] = (
    calculations["total_tokens"] / 1000
) * 0.0004

print(calculations)
