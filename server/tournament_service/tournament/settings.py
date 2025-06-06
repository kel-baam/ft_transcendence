# """
# Django settings for tournament project.

# Generated by 'django-admin startproject' using Django 5.1.1.

# For more information on this file, see
# https://docs.djangoproject.com/en/5.1/topics/settings/

# For the full list of settings and their values, see
# https://docs.djangoproject.com/en/5.1/ref/settings/
# """ 

from pathlib import Path
import os
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

USE_L10N = False  # Disable localization to use custom formats
DATE_INPUT_FORMATS = ['%m-%d-%Y'] 

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-9%619p19(yy9qflr0@=w48%3odh%4&#a&(m@4a!k3h)9wkg57&'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECRET_KEY = 'django-insecure-1mpj)ud(wiuuvgy6dpm42h@o27ztef$ag%k!k33#r%97jrtflp'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis-service', 6379)],
        },
    },
}

DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760

CORS_ALLOW_CREDENTIALS = True

# Application definition

INSTALLED_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'channels',
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'online',
    'local',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True

# CSRF_COOKIE_NAME ='csrfToken'
# CSRF_TRUSTED_ORIGINS = [
#     "https://${window.env.IP}:3000",
#     # "http://backend:8000",
#     "https://${window.env.IP}:8002",
#     # "ws://localhost:8000",
# ]

ROOT_URLCONF = 'tournament.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DB_NAME = os.getenv('DB_NAME', '')
DB_PORT = os.getenv('DB_PORT', '')
DB_USER = os.getenv('DB_USER', '')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST= os.getenv('DB_HOST', '')

DATABASE_URL = os.getenv('DATABASE_URL', 'default-database-url')


# WSGI_APPLICATION = 'tournament.wsgi.application'
ASGI_APPLICATION = "tournament.asgi.application" 

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases
DATABASES = {
       'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        'HOST': DB_HOST,  
        'PORT': DB_PORT,
        # 'OPTIONS': {
        #     'sslmode': 'require',  # Use 'disable' if SSL is off
        # },
    }
}


# from pathlib import Path

# BASE_DIR is now a Path object
# BASE_DIR = Path(__file__).resolve().parent.parent

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',  # Creates an SQLite database file
#     }
# }

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
ALLOWED_HOSTS = ['*']


CORS_ALLOW_METHODS = [
    'GET', 'POST', 'DELETE', 'OPTIONS', 'PUT',
]
CORS_ALLOW_HEADERS = ["*"]