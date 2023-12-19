file_id="1GyytQ7GO8dPx3vgSeAswI"

figma_api_url="https://api.figma.com/v1/files/$file_id/images?format=png"

# figma_api_token="figd__ESW_128ynlqc_L6BVG5iH_olr7NGJVpldws4VMX"
figma_api_token="$FIGMA_API_TOKEN"

#get root of repo dir

root_dir=$(git rev-parse --show-toplevel)

png_dir="$root_dir/images/pngs"
webp_dir="$root_dir/images/webps"

rm -rf "$root_dir/images" 

mkdir -p $png_dir
mkdir -p $webp_dir

response=$(curl -H "X-FIGMA-TOKEN: $figma_api_token" "$figma_api_url")
#check response.meta.images else return
if [[ $(echo "$response" | jq -r '.meta.images') == "null" ]]; then
    echo "Error: $response"
    exit 1
fi

image_urls=($(echo "$response" | jq -r '.meta.images | to_entries | .[].value'))

index=0
for image_url in "${image_urls[@]}"; do
    image_name="image$index"
    curl -L "$image_url" -o "$root_dir/image.png"
    cp "$root_dir/image.png" "$png_dir/$image_name.png"
    # convert to webp and then save
    cwebp -q 80 "$root_dir/image.png" -o "$webp_dir/$image_name.webp"
    ((index++))
done

rm -f "image.png"
