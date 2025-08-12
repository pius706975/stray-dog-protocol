#!/bin/bash
pm2 stop shiphire
pm2 start /home/ubuntu/shiphire/dist/server.js --name "shiphire"