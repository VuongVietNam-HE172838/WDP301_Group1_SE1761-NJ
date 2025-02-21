# Sử dụng Node.js 18 làm base image
FROM node:18

# Đặt thư mục làm thư mục làm việc chính trong container
WORKDIR /app

# Copy package.json và package-lock.json để cài đặt dependencies trước
COPY package*.json ./

# Cài đặt dependencies với --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copy toàn bộ mã nguồn vào container
COPY . .

# Expose cổng mà backend sẽ chạy (lấy từ .env)
EXPOSE ${PORT}

# Khởi chạy server
CMD ["npm", "start"]
