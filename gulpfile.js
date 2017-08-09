const gulp = require('gulp');
const replace = require('gulp-replace-task');
const spawn = require('child_process').spawn;
const args = require('yargs').argv;
const concat = require('gulp-concat');

gulp.task('prepare', cb => {
    const env = args.env || 'production';
    const settings = require(`./config/setups/${env}.json`);
    const translationsDE = require(`./config/app/i18n/de.json`);
    const translationsEN = require(`./config/app/i18n/en.json`);
    const style = require(`./config/app/style.json`);

    console.log(settings);

    const prepareForBuild = gulp
    .src([ 'code-templates/**.js' ], { base: './code-templates' })
        .pipe(replace({
            patterns: [
                {
                    match: 'STYLE',
                    replacement: style
                },
                {
                    match: 'API_URL',
                    replacement: settings.API_URL
                },
                {
                    match: 'GOOGLE_ANALYTICS_ID',
                    replacement: settings.GOOGLE_ANALYTICS_ID
                },
                {
                    match: 'TRANSLATIONS_DE',
                    replacement: translationsDE
                },
                {
                    match: 'TRANSLATIONS_EN',
                    replacement: translationsEN
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
    const args = [ './**', '--region', 'eu-central-1', '--bucket', process.env.BUCKET_NAME ];
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
