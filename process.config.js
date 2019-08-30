module.exports = {
  apps: [
    {
      script: './server/lib',
      name: 'Back end joginho',
      instances: 1,
      exec_mode  : 'cluster', // eslint-disable-line
      watch: true,
      env: {
        'NODE_ENV': 'production'
      }
    },
    {
      script: 'npm',
      args : 'run dev',
      name: 'Front end joguinho',
      instances: 1,
      exec_mode  : 'cluster', // eslint-disable-line
      watch: true,
      env: {
        'NODE_ENV': 'production'
      }
    }
  ]
}