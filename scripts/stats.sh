cronjob="*/30 * * * * curl http://localhost:3010/monitor/checkStatus"
(crontab -l ; echo "$cronjob") | crontab -

cronjob2="*/31 * * * * curl http://localhost:3010/notification/sendNotifications"
(crontab -l ; echo "$cronjob2") | crontab -

