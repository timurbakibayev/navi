from django.shortcuts import render


def update(request, code):
    text = "updated for code "+str(code) + " lat: " + request.GET.get("lat","0.0")
    if not (request.GET.get("lat","0") == "0" or request.GET.get("lon", "0") == "0"):
        return render(request, 'ok.html', context={"text": "Lattitude (lat) or Longitude (lon) is missing :("})
    
    return render(request, 'ok.html', context={"text": text})
