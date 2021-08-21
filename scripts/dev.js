const liveServer = require('live-server')
const { spawn } = require('child_process')

spawn('npm', ['run', 'watch'], { stdio: 'inherit' })

liveServer.start({
  watch: ['dist/*.js', 'index.html']
})
