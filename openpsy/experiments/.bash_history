mkdir .ssh
chmod 700 .ssh
sudo cp /root/.ssh/authorized_keys /home/william/.ssh/authorized_keys
sudo chown william /home/william/.ssh/authorized_keys
chmod 644 .ssh/authorized_keys
sudo nano /etc/ssh/sshd_config
sudo semanage port -a -t  ssh_port_t -p  tcp 7354
sudo service sshd restart
sudo yum install epel-release
sudo yum install python-pip python-devel postgresql-server postgresql-devel postgresql-contrib gcc nginx
sudo pip install --upgrade pip 
sudo yum install -y openssl-devel
sudo yum install mod_ssl openssl
sudo mkdir /etc/nginx/ssl
cd /etc/nginx/ssl
sudo openssl genrsa -out ca.key 2048
sudo openssl req -new -key ca.key -out ca.csr
sudo cp ca.key ca.key.org
sudo openssl rsa -in ca.key.org -out ca.key
sudo rm ca.key.org
sudo openssl x509 -req -days 365 -in ca.csr -signkey ca.key -out ca.crt
sudo cp ca.crt /etc/pki/tls/certs
sudo cp ca.key /etc/pki/tls/private/ca.key
sudo cp ca.csr /etc/pki/tls/private/ca.csr
sudo nano /etc/nginx/conf.d/ssl.conf
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo nano /var/lib/pgsql/data/pg_hba.conf
sudo systemctl restart postgresql
sudo systemctl enable postgresql
sudo su - postgres
sudo systemctl restart postgresql
cd /usr/src
sudo wget https://www.python.org/ftp/python/3.4.3/Python-3.4.3.tgz
sudo tar xzf Python-3.4.3.tgz
cd Python-3.4.3
./configure --prefix=/usr
sudo make altinstall
2.0.5
[william@openpsy Python-3.4.3]$
2.0.5
[william@openpsy Python-3.4.3]$
sudo pip install virtualenv
mkdir ~/openpsy
cd ~/openpsy
pwd
virtualenv -p /usr/bin/python3.4 openpsy.env
ls
rm -rf openpsy.env
ls
virtualenv -p /usr/bin/python3.4 openpsyenv
ls
source openpsyenv/bin/activate
pip install django gunicorn psycopg2
python
$ djan
django-admin.py startproject openpsy .
ls
nano openpsy/settings.py
ls
pwd
./manage.py makemigrations
./manage.py migrate
./manage.py createsuperuser
./manage.py collectstatic
.manage.py runserver 0.0.0.0:8000
./manage.py runserver 0.0.0.0:8000
cd ~/openpsy
gunicorn --bind 0.0.0.0:8000 openpsy.wsgi:application
deactivate
sudo nano /etc/systemd/system/gunicorn.service
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo nano /etc/nginx/nginx.conf
sudo usermod -a -G william nginx
chmod 710 /home/william
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx
ls
source openpsyenv/bin/activate
./manage.py collectstatic
./manage.py makemigrations
deactivate
sudo systemctl restart gunicorn
whois openpsychology.org
cd openpsy
ls
source openpsyenv/bin/activate
./manage.py check
./manage.py makemigrations
./manage.py migrate
deactivate
sudo systemctl restart gunicorn
sudo nano /etc/nginx/nginx.conf
sudo service sshd restart
sudo systemctl restart nginx
sudo systemctl restart gunicorn
sudo nano /etc/nginx/nginx.conf
sudo systemctl restart nginx
sudo systemctl restart gunicorn
ls
cd openpsy
nano settings.py
sudo systemctl restart gunicorn
sudo nano /etc/nginx/nginx.conf
sudo systemctl restart gunicorn
sudo nano /etc/nginx/nginx.conf
sudo systemctl restart gunicorn
sudo systemctl restart nginx
sudo systemctl restart gunicorn
nginx -s reload
sudo nginx -s reload
sudo systemctl restart gunicorn
sudo nano /etc/nginx/nginx.conf
sudo nginx -s reload
sudo systemctl restart gunicorn
sudo nano /etc/nginx/nginx.conf
sudo systemctl restart gunicorn
sudo nano /etc/nginx/nginx.conf
sudo nginx -s reload
sudo systemctl restart gunicorn
sudo nano /etc/nginx/nginx.conf
sudo nginx -s reload
sudo systemctl restart gunicorn
ls
nano settings.py
sudo systemctl restart gunicorn
cd openpsy
nano Settings
nano settings.py
cd
ls
cd openpsy
ls
cd openpsy
ls
nano settings.py
sudo systemctl restart gunicorn
nano settings.py
sudo systemctl restart gunicorn
nano settings.py
cd
ls
cd openpsy
ls
./manage.py collectstatic
source myprojectenv/bin/activate
ls
source openpsyenv/bin/activate
./manage.py collectstatic
deactivate
sudo systemctl restart gunicorn
cd openpsy
ls
nano settings.py
sudo service sshd restart
sudo systemctl restart nginx
sudo systemctl restart gunicorn
cd openpsy/openpsy
ls
nano settings.py
sudo systemctl restart gunicorn
cd openpsy/openpsy
nano settings
nano settings.py
cd openpsy/openpsy
nano settings
nano settings.py
sudo systemctl restart gunicorn
cd openpsy/openpsy
nano settings.py
sudo systemctl restart gunicorn
cd openpsy/openpsy
settings.py
ls
nano settings.py
sudo systemctl restart gunicorn
python
sudo systemctl restart gunicorn
ls
nano settings.py
sudo systemctl restart gunicorn
ls
cd openpsy
ls
cd openpsy
ls
sudo nano settings.py
sudo systemctl restart gunicorn
psql sudo su postgres
sudo su - postgres
sudo nano /etc/ssh/sshd_config
exit
sudo nano /var/log/secure
ls -la /home/user
ls
sudo -u postgres psql
ls
cd openpsy
ls
cd openpsy
ls
sudo nano settings.py
sudo systemctl restart gunicorn
psql -d openpsydb -u openpsydbuser
psql -d openpsydb openpsydbuser
psql -d openpsydb
psql -d openpsydb -u openpsydbuser
psql -d openpsydb
psql -d openpsydb -u openpsydbuser -w
psql --help
psql -d openpsydb -U openpsydbuser
psql -d openpsydb -U postgresql
psql user_name -h 127.0.0.1 -d openpsycdb
ls
cd /etc/
ls
cd postgresql
psql
sudo -u postgres -i
cd
ls
cd openpsy
ls
cd openpsy
ls
sudo nano settings.py
psql
psql -d openpsydb -U openpsydbuser
psql -d openpsydb -U william
psql -d openpsydb -U openpsydbuser -w
psql -d openpsydb -U postgres
psql -U postgres -h localhost
psql -U openpsydbuser -h localhost
psql -d openpsydb -U openpsydbuser
cd ~
cd /etc
ls
cd /postgresql
psql openpsydb openpsydbuser
sudo nano /var/lib/pgsql/data/pg_hba.conf
sudo su - postgres
sudo systemctl restart postgresql
psql -d openpsydb
psql -d openpsydb -U openpsydbuser
sudo su - postgres
cd ~
cd openpsy/openpsy
sudo nano settings.py
sudo systemctl restart gunicorn
quit
exit
sudo systemctl restart gunicorn
exit
sudo systemctl restart gunicorn
cd openpsy/openpsy
sudo nano settings.py
sudo systemctl restart gunicorn
sudo nano settings.py
sudo systemctl restart gunicorn
sudo nano settings.py
sudo systemctl restart gunicorn
sudo nano settings.py
exit
sudo systemctl restart gunicorn
exit
sudo systemctl restart gunicorn
quit
exit
sudo systemctl restart gunicorn
