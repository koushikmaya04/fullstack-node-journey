require('dotenv').config();

const port = Number.parseInt(process.env.PORT || '3000', 10);
const appName = process.env.APP_NAME || 'week-07-node-app';
const environment = process.env.NODE_ENV || 'development';

function getConfig() {
  return {
    appName,
    environment,
    port,
  };
}

if (require.main === module) {
  console.log('Application configuration:');
  console.log(JSON.stringify(getConfig(), null, 2));
}

module.exports = { getConfig };
