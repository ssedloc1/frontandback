import requests

# This changes I think every time ngrok gets rerun. During testing start an ngrok session and leave it open in a separate terminal
url = 'https://0493-2600-1017-b009-8e7f-ef60-b1b5-7f09-f536.ngrok.io'

x = requests.get(url)
print(x.json)

