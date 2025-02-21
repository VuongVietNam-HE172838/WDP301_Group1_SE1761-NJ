#1, Chạy Docker trên VPS
```cd /path/to/backend
```docker-compose up -d

#2, Kiểm tra API đang chạy
curl http://<VPS:ip>:9999/api/health

#3, Cấu hình Nginx trên VPS để Xử lý Request
  ##3.1, Cài Nginx trên VPS (Nếu chưa có)
    ```sudo apt update
    ```sudo apt install nginx -y
  ##3.2, Tạo cấu hình cho backend
    ###3.2.1, Mở file cấu hình Nginx
      ```sudo nano /etc/nginx/sites-available/foodtrip-backend
    ###3.2.2, Dán nội dung này (thay thế 9999 bằng cổng backend của bạn nếu khác):
      ```server {
          listen 80;
          server_name api.foodtripvn.site;
          location / {
              proxy_pass http://localhost:9999;
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_set_header X-Forwarded-Proto $scheme;
          }
      }
    ###3.3.3, Lưu lại (CTRL + X, nhấn Y, rồi Enter).
    ###3.3.4, Bật cấu hình mới:
      ```sudo ln -s /etc/nginx/sites-available/foodtrip-backend /etc/nginx/sites-enabled/
    ###3.3.5, Kiểm tra & reload Nginx
      ```sudo nginx -t
      ```sudo systemctl restart nginx

#4, Cấu hình HTTPS (SSL) cho backend
  ##4.1, Để backend hỗ trợ HTTPS (https://api.foodtripvn.site), bạn có thể dùng Certbot để cài chứng chỉ SSL miễn phí.
    ```sudo apt install certbot python3-certbot-nginx -y
    ```sudo certbot --nginx -d api.foodtripvn.site
  ##4.2, Chứng chỉ này tự động gia hạn, nhưng bạn có thể kiểm tra bằng:
    sudo certbot renew --dry-run




