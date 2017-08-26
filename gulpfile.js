const gulp = require('gulp');
const replace = require('gulp-replace-task');
const spawn = require('child_process').spawn;
const args = require('yargs').argv;
const concat = require('gulp-concat');

gulp.task('prepare', cb => {
    var VQ_API_URL = process.env.VQ_API_URL || 'http://localhost:8080/api';

    if (VQ_API_URL.indexOf('http://') === -1 && VQ_API_URL.indexOf('https://') === -1) {
        VQ_API_URL = `http://${VQ_API_URL}`;
    }

    const VQ_LANG = process.env.VQ_LANG || 'en';
    const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || '';

    console.log(`VQ_API_URL: ${VQ_API_URL}`);
    console.log(`VQ_LANG: ${VQ_LANG}`);
    console.log(`GOOGLE_ANALYTICS_ID: ${GOOGLE_ANALYTICS_ID}`);

    const prepareForBuild = gulp
    .src([ 'code-templates/**.js' ], { base: './code-templates' })
        .pipe(replace({
            patterns: [
                {
                    match: 'VQ_API_URL',
                    replacement: VQ_API_URL
                },
                {
                    match: 'VQ_LANG',
                    replacement: VQ_LANG
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
    const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const AWS_REGION = process.env.AWS_REGION || 'eu-central-1';

    if (!AWS_BUCKET_NAME) {
        throw new Error('AWS_BUCKET_NAME is required');
    }

    console.log(`AWS_BUCKET_NAME: ${AWS_BUCKET_NAME}`);
    console.log(`AWS_REGION: ${AWS_REGION}`);

    const args = [
        './**',
        '--region',
        AWS_REGION,
        '--bucket',
        AWS_BUCKET_NAME
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
