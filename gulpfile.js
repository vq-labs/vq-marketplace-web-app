const gulp = require('gulp');
const replace = require('gulp-replace-task');
const spawn = require('child_process').spawn;
const args = require('yargs').argv;
const concat = require('gulp-concat');

gulp.task('prepare', cb => {
    const env = args.env || 'local';
    const API_URL = process.env.API_URL || 'http://localhost:8080/api';
    const LANG = process.env.LANG || 'en';
    const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || '';

    const style = require(`./config/app/style.json`);

    const prepareForBuild = gulp
    .src([ 'code-templates/**.js' ], { base: './code-templates' })
        .pipe(replace({
            patterns: [
                {
                    match: 'API_URL',
                    replacement: API_URL
                },
                {
                    match: 'LANG',
                    replacement: LANG
                },
                {
                    match: 'GOOGLE_ANALYTICS_ID',
                    replacement: GOOGLE_ANALYTICS_ID
                }
            ]
        }))
        .pipe(gulp.dest('src/generated'));

        cb();
});

gulp.task('build', [ "prepare" ], cb => {
    const npm = spawn('npm', [ 'run', 'build' ], { cwd: './'  });

    npm.stdout.on('data', data => {
        console.log(`${data}`);
    });

    npm.stderr.on('data', err => {
        console.log(`stderr: ${err}`);
    });

    npm.on('close', code => {
        cb(code !== 0 ? 'error in build' : null);
    });
});

gulp.task('deploy', [ 'build' ], cb => {
    const args = [
        './**',
        '--region',
        process.env.REGION || 'eu-central-1',
        '--bucket',
        process.env.BUCKET_NAME
    ];

    const npm = spawn("s3-deploy", args, { cwd: './build' });

    npm.stdout.on('data', data => {
        console.log(`stdout: ${data}`);
    });

    npm.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });

    npm.on('close', code => {
        cb(code !== 0 ? 'error in build' : null);
    });
});
