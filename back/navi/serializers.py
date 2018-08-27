from rest_framework import routers, serializers, viewsets
from navi.models import History
from navi.models import Subject


class SubjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Subject
        fields = ('url', 'id', 'name', 'subject_code', 'lon', 'lat', 'icon', 'extra')


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer


class HistorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = History
        fields = ('url', 'id', 'subject', 'subject_code', 'lon', 'lat', 'subject_id', 'subject_icon', 'extra')


class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer

