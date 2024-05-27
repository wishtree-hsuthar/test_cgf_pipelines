#!/usr/bin/env bash
cd /home/cgfhrdd/gitProjects/PR74-CGF-HRDD-Web-Front
npm i
npm run start:staging
chown -R cgfhrdd:cgfhrdd /home/cgfhrdd/
sudo systemctl start nginx
