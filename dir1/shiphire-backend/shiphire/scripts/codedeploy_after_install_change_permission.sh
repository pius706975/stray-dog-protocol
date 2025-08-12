#!/bin/bash
chown -R ubuntu:ubuntu /home/ubuntu/shiphire
find /home/ubuntu/shiphire -type d -exec chmod 755 {} \;
find /home/ubuntu/shiphire -type f -exec chmod 644 {} \;