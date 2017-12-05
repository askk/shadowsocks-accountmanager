const path = require('path');
const config = appRequire('services/config').all();

const shadowsocks = () => {
  appRequire('services/shadowsocks');
  appRequire('services/server');
};

shadowsocks();
