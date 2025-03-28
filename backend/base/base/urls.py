from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from blog.views import CommentViewSet

urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),  # Генерация OpenAPI схемы
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),  # Swagger UI
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),  # ReDoc UI (если нужно)
    path('admin/', admin.site.urls),
    path("api/", include("users.urls")),
    path("api/blog/", include("blog.urls")),
    path("api/", include("search.urls")),
    path(
        'api/blog/comments/<uuid:pk>/like/',
        CommentViewSet.as_view({'post': 'like'}),
        name='comment-like',
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
