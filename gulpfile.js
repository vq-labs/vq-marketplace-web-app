const gulp = require('gulp');
const replace = require('gulp-replace-task');
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
});
