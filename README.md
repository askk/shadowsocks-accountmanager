[![NPM version][npm-image]][npm-url]
[![npm license][license-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/shadowsocks-manager.svg?style=flat-square
[npm-url]: https://npmjs.org/package/shadowsocks-manager
[download-url]: https://npmjs.org/package/shadowsocks-manager
[license-image]: https://img.shields.io/npm/l/shadowsocks-manager.svg

# shadowsocks-manager

A shadowsocks manager tool for multi user and traffic control.  
Base on Node.js and SQLite.

For more details, you can see [the wiki page](https://github.com/shadowsocks/shadowsocks-manager/wiki).

## Dependencies

Node.js 6.*

## Install

### From source:

```
git clone https://github.com/shadowsocks/shadowsocks-manager.git
cd shadowsocks-manager
npm i
```
use `node server.js` to run this program.  

### From npm:
```
npm i -g shadowsocks-manager
```
use `ssmgr` to run this program.

### From docker:
```
docker run --name ssmgr -idt -v ~/.ssmgr:/root/.ssmgr --net=host gyteng/ssmgr [ssmgr params...]
```

### Build docker image:

here is the `Dockerfile`

```
FROM ubuntu:16.04
MAINTAINER gyteng <igyteng@gmail.com>
RUN apt-get update && \
    apt-get install tzdata net-tools curl git sudo software-properties-common python-pip -y && \
    pip install git+https://github.com/shadowsocks/shadowsocks.git@master && \
    add-apt-repository ppa:max-c-lv/shadowsocks-libev -y && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -y nodejs shadowsocks-libev && \
    npm i -g shadowsocks-manager && \
    echo "Asia/Shanghai" > /etc/timezone && \
    rm /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata
ENTRYPOINT ["/usr/bin/ssmgr"]
```

### Usage
1. Start shadowsocks with [manager API](https://github.com/shadowsocks/shadowsocks/wiki/Manage-Multiple-Users), it supports `shadowsocks-python` and `shadowsocks-libev`.
For example, you can run this command:  
`ss-manager -m aes-256-cfb -u --manager-address 127.0.0.1:6001`
2. run ssmgr with type s:

  config file:  
  ```
  type: s

  shadowsocks:
    address: 127.0.0.1:6001
  manager:
    address: 0.0.0.0:4001
    password: '123456'
  db: 'ss.sqlite'
  ```

  If you want to use MySQL, the `db` must like this:

  ```
  db:
    host: '1.1.1.1'
    user: 'root'
    password: 'abcdefg'
    database: 'ssmgr'
  ```

  And you have to close `only_full_group_by` when the version of MySQL is greater than 5.7

  command:  
  `ssmgr -c /your/config/file/path.yml`

3. If you have several servers, you have to run step 1 and step 2 in every server.  
The listening address in `--manager-address` of step 1 and in `shadowsocks -> address` of step 2's config file must be same. For security reseon, we recommend you to use `127.0.0.1` instead of `0.0.0.0`.
4. Now you can use the plugins to manage them. You can read the details in plugins readme page.

```
+-------------+    +-------------+       +------+
| Shadowsocks |    | Shadowsocks |  ...  |      |
| manager API |    | manager API |       |      |
+-------------+    +-------------+       +------+
       |                 |                  |
       |                 |                  |
+-------------+    +-------------+       +------+
| ssmgr       |    | ssmgr       |  ...  |      |
| with type s |    | with type s |       |      |
+-------------+    +-------------+       +------+
       |                 |                  |
       +------------+----+--------  ...  ---+
                    |
                    |
             +---------------+
             | ssmgr plugins |
             |  with type m  |
             +---------------+
```

### Plugins
[cli](https://github.com/shadowsocks/shadowsocks-manager/blob/master/plugins/cli/README.md)  
[telegram](https://github.com/shadowsocks/shadowsocks-manager/blob/master/plugins/telegram/README.md)  
[freeAccount](https://github.com/shadowsocks/shadowsocks-manager/blob/master/plugins/freeAccount/README.md)  
[webgui](https://github.com/shadowsocks/shadowsocks-manager/blob/master/plugins/webgui/README.md)  

### Parameter

`ssmgr --help` will show startup parameters info.

```
Usage: ssmgr [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -c, --config [file]          config file, default: ~/.ssmgr/default.yml
    -d, --db [file]              sqlite3 file, sample: ~/.ssmgr/db.sqlite
    -t, --type [type]            type, s for server side, m for manager side
    -s, --shadowsocks [address]  ss-manager address, sample: 127.0.0.1:6001
    -m, --manager [address]      manager address, sample: 0.0.0.0:6002
    -p, --password [password]    manager password, both server side and manager side must be equals
    -r, --run [type]             run shadowsocks from child_process, sample: libev / libev:aes-256-cfb / python / python:aes-256-cfb
    --debug                      show debug message
```

First, ssmgr will read the config file in `--config`, and other parameters(`-detsmp`) will replace the config file values.