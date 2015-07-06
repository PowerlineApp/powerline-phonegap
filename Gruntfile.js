'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        src: 'src',
        dist: 'www',
        temp: '.tmp',
        cordovaCommon: 'cordova',
        iosPath: 'platforms/ios',
        iosAssets: 'platforms/ios/www',
        androidPath: 'platforms/android',
        androidAssets: 'platforms/android/assets/www',
        androidResources: 'platforms/android/res',
        iosResources: 'platforms/ios/Civix/Resources'
    };

    // Path for check by jshint
    var jshintPaths = [
        '<%= yeoman.src %>/js/app/**/*.js',
        'tests/unit/**/*.js',
        'tests/e2e/**/*.js'
    ];

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            src: {
                files: [
                    '<%= yeoman.src %>/{,*/}*.html',
                    '{.tmp,<%= yeoman.src %>}/less/**/{,*/}*.less',
                    '{.tmp,<%= yeoman.src %>}/js/{,*/}*.js',
                    '<%= yeoman.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['less:debug']
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                middleware: function (connect) {
                    return [
                        lrSnippet,
                        mountFolder(connect, '.tmp'),
                        mountFolder(connect, yeomanConfig.src)
                    ];
                }
            },
            livereload: {},
            test_unit: {
                options: {
                    port: 9001
                }
            },
            test_unit_min: {
                options: {
                    port: 9002
                }
            }
        },
        clean: {
            options: {
                force: true
            },
            ci: ['build'],
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp',
            ios: ['<%= yeoman.iosAssets %>/*'],
            android: ['<%= yeoman.androidAssets %>/*'],
            temp: ['<%= yeoman.temp %>'],
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            dist: jshintPaths,
            ci: {
                options: {
                    reporter: 'checkstyle',
                    reporterOutput: 'build/jshint.xml'
                },
                src: jshintPaths
            }
        },
        karma: {
            unit: {
                configFile: 'tests/unit.conf.js',
                singleRun: true
            },
            unit_dist: {
                configFile: 'tests/unit-dist.conf.js',
                singleRun: true
            }
        },
        concat: {},
        useminPrepare: {
            html: '<%= yeoman.temp %>/index.html',
            options: {dest: '<%= yeoman.temp %>'}
        },
        usemin: {
            html: ['<%= yeoman.temp %>/{,*/}*.html'],
            options: {dirs: ['<%= yeoman.temp %>']}
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    removeCommentsFromCDATA: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.temp %>',
                        src: ['*.html', 'templates/**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.temp %>/js/app/',
                        src: '**/*.js',
                        dest: '<%= yeoman.temp %>/js/app/'
                    }
                ]
            }
        },
        uglify: {},
        copy: {
            temp: {
                files: [{expand: true, cwd: '<%= yeoman.src %>', dest: '<%= yeoman.temp %>', src: ['**']}]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.temp %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            'images/**/*.{png,jpg,jpeg,gif}',
                            'fonts/{,*/}*',
                            'js/app-min.js',
                            'js/vendor/jquery/dist/jquery.min.js',
                            'js/vendor/angular/angular.min.js',
                            'js/vendor/angular-route/angular-route.min.js',
                            'js/vendor/angular-touch/angular-touch.min.js',
                            'js/vendor/angular-resource/angular-resource.min.js',
                            'js/vendor/angular-sanitize/angular-sanitize.min.js',
                            'js/vendor/angular-animate/angular-animate.min.js',
                            'js/vendor/angular-google-maps/dist/angular-google-maps.min.js',
                            'js/vendor/bluebird/js/browser/bluebird.js',
                            'js/vendor/Autolinker.js/dist/Autolinker.min.js',
                            'js/vendor/angular-bindonce/bindonce.min.js',
                            'js/vendor/underscore/underscore-min.js',
                            'js/vendor/iscroll/build/iscroll-lite.js',
                            'js/vendor/momentjs/min/moment.min.js',
                            'js/vendor/ionic/js/ionic.min.js',
                            'js/vendor/js-collection/angular-js-collection.js',
                            'js/vendor/textarea-caret-position/index.js'
                        ]
                    }
                ]
            },
            config_prod: {
                files: [
                    {src: '<%= yeoman.src %>/config/prod.js', dest: '<%= yeoman.temp %>/js/app/config.js'}
                ]
            },
            config_dev: {
                files: [
                    {src: '<%= yeoman.src %>/config/dev.js', dest: '<%= yeoman.temp %>/js/app/config.js'}
                ]
            },
            config_staging: {
                files: [
                    {src: '<%= yeoman.src %>/config/staging.js', dest: '<%= yeoman.temp %>/js/app/config.js'}
                ]
            },
            config_test: {
                files: [
                    {src: '<%= yeoman.src %>/config/dev.js', dest: '<%= yeoman.src %>/js/app/config.js'}
                ]
            },
            config_empty: {},
            android: {
                files: [
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['**'], dest: '<%= yeoman.androidAssets %>/'},
                    {expand: true, cwd: '<%= yeoman.cordovaCommon %>/android', src: ['**'], dest: '<%= yeoman.androidAssets %>/'}
                ]
            },
            ios: {
                files: [
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['**'], dest: '<%= yeoman.iosAssets %>/'},
                    {expand: true, cwd: '<%= yeoman.cordovaCommon %>/ios', src: ['**'], dest: '<%= yeoman.iosAssets %>/'}
                ]
            }
        },
        targethtml: {
            options: {curlyTags: {env: '<%= grunt.option("env") %>'}},
            ios: { files: { '<%= yeoman.dist %>/index.html': '<%= yeoman.temp %>/index.html' } },
            android: { files: { '<%= yeoman.dist %>/index.html': '<%= yeoman.temp %>/index.html' } }
        },
        less: {
            options: {compress: true, paths: ['<%= yeoman.src %>/less']},
            ios: { files: { '<%= yeoman.dist %>/css/main.css': '<%= yeoman.src %>/less/ios.less' } },
            android: { files: { '<%= yeoman.dist %>/css/main.css': '<%= yeoman.src %>/less/android.less' } },
            debug: { files: { '<%= yeoman.src %>/css/main.css': '<%= yeoman.src %>/less/app.less' }}
        },
        shell: {
            options: {
                failOnError: true,
                stdout: true,
                stderr: true,
                maxBuffer: 10000 * 1024
            },
            emulate_ios: { command: '<%= yeoman.iosPath %>/cordova/run' },
            emulate_android: { command: '<%= yeoman.androidPath %>/cordova/clean && <%= yeoman.androidPath %>/cordova/run' },
            build_ios: { command: '<%= yeoman.iosPath %>/cordova/clean && <%= yeoman.iosPath %>/cordova/build' },
            build_android: { command: '<%= yeoman.androidPath %>/cordova/clean && <%= yeoman.androidPath %>/cordova/build' },
            release_ios: { command: '<%= yeoman.iosPath %>/cordova/clean && <%= yeoman.iosPath %>/cordova/release' },
            release_android: { command: '<%= yeoman.androidPath %>/cordova/clean && <%= yeoman.androidPath %>/cordova/build --release' },
            prepare_android: { command: 'cordova prepare android' },
            prepare_ios: { command: 'cordova prepare ios' }
        },
        preprocess: {
            options: {}
        },
        autoprefixer: {
            android: {
                options: {browsers: 'android >=2.1'},
                files: {'<%= yeoman.dist %>/css/main.css': '<%= yeoman.dist %>/css/main.css'}
            },
            ios: {
                options: {browsers: 'ios >=6'},
                files: {'<%= yeoman.dist %>/css/main.css': '<%= yeoman.dist %>/css/main.css'}
            }
        },
        cssmin: {
            all: {
                files: {'<%= yeoman.dist %>/css/main.css': '<%= yeoman.dist %>/css/main.css'}
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', [
        'clean:server',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('test:unit', [
        'clean:server',
        'connect:test_unit',
        'karma:unit'
    ]);

    grunt.registerTask('test:min', [
        'clean:server',
        'connect:test_unit_min',
        'karma:unit_dist'
    ]);

    grunt.registerTask('test:prepare_dist', [
        'clean:server',
        'clean:dist',
        'copy:temp',
        'targethtml:android',
        'useminPrepare',
        'usemin',
        'ngmin',
        'concat',
        'uglify',
        'htmlmin',
        'copy:dist',
        'clean:temp'

    ]);

    grunt.registerTask('test', [
        'jshint:dist',
        'test:prepare_dist',
        'test:unit',
        'test:min'
    ]);

    grunt.registerTask('compile', function (platform, env) {
        grunt.option('env', env ? env : 'dev');

        if (platform) {
            grunt.task.run([
                'clean:dist',
                'copy:temp',
                'copy:config_' + (env || 'empty'),
                'targethtml:' + platform,
                'useminPrepare',
                'usemin',
                'ngmin',
                'concat',
                'uglify',
                'htmlmin',
                'copy:dist',
                'less:' + platform,
                'autoprefixer:' + platform,
                'cssmin',
                'shell:prepare_' + platform,
                //'clean:' + platform,
                //'copy:' + platform,
                'clean:temp'
            ]);

            return true;
        }

        return false;
    });

    grunt.registerTask('emulate', function (platform, env) {
        if (!platform) {
            grunt.log.writeln('Set platform for emulate task');

            return false;
        }

        grunt.task.run([
            'compile:' + platform + (undefined !== env ? ':' + env : ''),
            'shell:emulate_' + platform
        ]);
    });

    grunt.registerTask('build', function (platform, env) {
        if (platform) {
            grunt.task.run([
                'compile:' + platform + (undefined !== env ? ':' + env : ''),
                'shell:build_' + platform
            ]);

            return true;
        }

        grunt.task.run(['build:android', 'build:ios']);
    });

    grunt.registerTask('release', function (platform, env) {
        if (platform) {
            grunt.task.run([
                'compile:' + platform + (undefined !== env ? ':' + env : ''),
                'shell:release_' + platform
            ]);

            return true;
        }

        grunt.task.run(['release:android', 'release:ios']);
    });

    grunt.registerTask('ci:tests', [
        'clean:ci',
        'jshint:ci',
        'copy:config_test',
        'test:prepare_dist',
        'test:unit',
        'test:min'
//        'test:e2e'
//        'test:cucumber'
    ]);

    grunt.registerTask('ci_build', function (platform, env) {
        if (platform) {
            grunt.task.run([
                'build:' + platform + (undefined !== env ? ':' + env : '')
            ]);
        }
    });

    grunt.registerTask('default', ['test']);
};
