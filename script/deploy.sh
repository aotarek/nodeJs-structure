#!/bin/sh

docker exec -it ceb9894bd77c bash
cd /home/node/node_restaurant_backend/
git pull origin develop
npm install
pm2 restart all
exit