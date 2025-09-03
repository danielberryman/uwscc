import qrcode

url = "https://venmo.com/u/Grace-Berryman"
img = qrcode.make(url)
img.save("qrcode.png")

print("QR code saved to qrcode.png")
