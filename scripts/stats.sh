cronjob="*/30 * * * * curl http://localhost:3000/monitor/checkStatus >> ~/Desktop/output.txt"
(crontab -l ; echo "$cronjob") | crontab -

cronjob2="3/30 * * * * curl http://localhost:3000/notification/sendNotifications >> ~/Desktop/output.txt"
(crontab -l ; echo "$cronjob") | crontab -
