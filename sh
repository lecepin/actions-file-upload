#!/bin/bash

packsDir="./app/build/outputs/apk/debug"
dmgFile=""
fileExtension="apk"  

# 获取当前时间戳
currentTime=$(date +"%Y%m%d%H%M%S")

# 查找并重命名第一个指定扩展名的文件
if [[ -d "$packsDir" ]]; then
  for file in "$packsDir"/*; do
    if [[ "${file##*.}" == "$fileExtension" ]]; then
      baseName="${file%.*}"
      newFileName="${baseName}-${currentTime}.${fileExtension}"
      mv "$file" "$newFileName"
      dmgFile="$newFileName"
      break
    fi
  done
else
  echo "Error: packs directory not found"
  exit 1
fi

if [[ -z "$dmgFile" ]]; then
  echo "No .$fileExtension file found in packs directory."
  exit 1
fi

# 上传文件
upload_url="http://u.leping.fun/upload"

response=$(curl -s -w "%{http_code}" -o /dev/null -F "fileToUpload=@$dmgFile" "$upload_url")

if [[ "$response" == "200" ]]; then
  echo "File uploaded successfully"
else
  echo "Error uploading file, HTTP status: $response"
fi
