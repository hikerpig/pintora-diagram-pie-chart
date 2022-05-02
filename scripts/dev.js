const { spawn } = require('child_process')

spawn('npm', ['run', 'watch'], { stdio: 'inherit' })

spawn('npm', ['run', 'dev'], { stdio: 'inherit', cwd: 'demo' })
