# Étape 1 : build Angular (Angular 22 exige Node >= 24.15)
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx ng build

# Étape 2 : servir les fichiers statiques avec nginx
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/andesetal-frontend/browser /usr/share/nginx/html
EXPOSE 80
