cronjob="* * * * * curl http://localhost:3000/monitor/checkStatus >> ~/Desktop/output.txt"
(crontab -l ; echo "$cronjob") | crontab -
