# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY app.js .
RUN npm add esbuild
RUN npx esbuild app.js \
    --bundle \
    --format=esm \
    --minify \
    --loader:.js=jsx \
    --external:http* \
    --outfile=app.bundle.js

# ---------- runtime stage ----------
FROM nginx:1.29.0-bookworm
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html  /usr/share/nginx/html/
COPY styles.css  /usr/share/nginx/html/
COPY --from=build /app/app.bundle.js /usr/share/nginx/html/app.js

CMD ["nginx","-g","daemon off;"]