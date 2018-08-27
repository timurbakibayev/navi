from django.shortcuts import render
from navi.models import Subject
from navi.models import History

def update(request, code):
    text = "updated for code "+str(code) + " lat: " + request.GET.get("lat","0.0")
    lat = float(request.GET.get("lat",0))
    lon = float(request.GET.get("lon",0))
    if lat == 0 or lon == 0:
        return render(request, 'ok.html', context={"text": "Lattitude (lat) or Longitude (lon) is missing :("})

    try:
        t = Subject.objects.filter(subject_code=code)
        if len(t) == 0:
            if request.GET.get("name","") == "":
                return render(request, 'ok.html', context={"text": "Please, specify a name for a new object"})
            s = Subject()
            s.subject_code = code
            s.lat = lat
            s.lon = lon
            s.icon = int(request.GET.get("icon",0))
            s.name = request.GET.get("name", "")
            s.extra = request.GET.get("extra", "")
            s.save()
            h = History()
            h.subject = s
            h.lat = lat
            h.lon = lon
            h.extra = request.GET.get("extra", "")
            h.save()
            return render(request, 'ok.html', context={"text": "A new object with code " + code + " is created"})
        else:
            s = t[0]
            s.lat = lat
            s.lon = lon
            s.icon = int(request.GET.get("icon",s.icon))
            s.name = request.GET.get("name", s.name)
            s.extra = request.GET.get("extra", "")
            s.save()
            h = History()
            h.subject = s
            h.lat = lat
            h.lon = lon
            h.extra = request.GET.get("extra", "")
            h.save()
            return render(request, 'ok.html', context={"text": "An object with code " + code + " is updated"})
    except Exception as e:
        return render(request, 'ok.html', context={"text": str(e)})
