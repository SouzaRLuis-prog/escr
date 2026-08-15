FROM chatwoot/chatwoot:v3.14.0

CMD ["sh", "-c", "bin/rails db:chatwoot_prepare && bin/rails s -p 3000 -b 0.0.0.0"]