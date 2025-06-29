FROM nginx:1.29.0-bookworm
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html usr/share/nginx/html/index.html
HEALTHCHECK CMD wget -qO- http://127.0.0.1/healthz || exit 1
