from django.conf.urls import url
from hardware import views


urlpatterns = [
    url(r'^list/$', views.HardwareListView.as_view(), name='hw_list'),
    url(r'^admin/$', views.HardwareAdminView.as_view(), name='hw_admin'),
    url(r'^lendings/$', views.HardwareLendingsView.as_view(), name='hw_lendings'),
    url(r'^requests/$', views.HardwareAdminRequestsView.as_view(), name='hw_requests')
]
