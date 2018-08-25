from django.shortcuts import render


def update(request, code):
    text = "updated for code "+str(code) + " lat: " + request.GET.get("lat","0.0")
    return render(request, 'ok.html', context={"text": text})
