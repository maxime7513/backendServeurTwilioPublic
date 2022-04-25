module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'woozood',
      host : 'ssh.cluster030.hosting.ovh.net',
      ref  : 'origin/master',
      repo : 'git@github.com:maxime7513/backendServeurTwilio.git',
      path : '/home/woozood/www/twilio',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
