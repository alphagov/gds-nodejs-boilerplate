const path = require('path')
const nodeSass = require('node-sass')

module.exports = function (grunt) {
  const sass = {
    dev: {
      options: {
        implementation: nodeSass,
        style: 'expanded',
        sourcemap: true,
        includePaths: [
          'node_modules'
        ],
        outputStyle: 'expanded'
      },
      files: [{
        expand: true,
        cwd: 'common/assets/sass',
        src: ['*.scss', 'custom/*.scss'],
        dest: 'public/stylesheets/',
        ext: '.css'
      }]
    }
  }

  const cssmin = {
    target: {
      files: {
        'public/stylesheets/application.min.css': [
          'public/stylesheets/application.css'
        ]
      }
    }
  }

  const watch = {
    css: {
      files: ['common/assets/sass/**/*.scss'],
      tasks: ['sass', 'cssmin'],
      options: {
        spawn: false,
        livereload: true
      }
    },
    assets: {
      files: ['common/assets/**/*', '!common/assets/sass/**'],
      tasks: ['copy:assets'],
      options: {
        spawn: false
      }
    }
  }

  const browserify = {
    'public/javascripts/browsered.js': ['common/browsered/index.js'],
    options: {
      browserifyOptions: { standalone: 'module' },
      transform: [
        [
          'babelify',
          {
            presets: ['es2015']
          }
        ],
        [
          'nunjucksify',
          {
            extension: '.njk'
          }
        ]
      ]
    }
  }

  const nodemon = {
    dev: {
      script: 'server.js',
      options: {
        ext: 'js',
        ignore: ['node_modules/**', 'common/assets/**', 'public/**'],
        args: ['-i=true']
      }
    }
  }

  const concurrent = {
    target: {
      tasks: ['watch', 'nodemon'],
      options: {
        logConcurrentOutput: true
      }
    }
  }

  const concat = {
    options: {
      separator: ';'
    },
    dist: {
      src: [
        'public/javascripts/browsered.js',
        'common/assets/javascripts/base/*.js',
        'common/assets/javascripts/modules/*.js'
      ],
      dest: 'public/javascripts/application.js'
    }
  }

  const rewrite = {
    'application.min.css': {
      src: 'public/stylesheets/application.min.css',
      editor (contents) {
        const staticify = require('staticify')(path.join(__dirname, 'public'))
        return staticify.replacePaths(contents)
      }
    }
  }

  const compress = {
    main: {
      options: {
        mode: 'gzip'
      },
      files: [
        { expand: true, src: ['public/images/*.jpg'], ext: '.jpg.gz' },
        { expand: true, src: ['public/images/*.gif'], ext: '.gif.gz' },
        { expand: true, src: ['public/images/*.png'], ext: '.png.gz' },
        { expand: true, src: ['public/javascripts/*.js'], ext: '.js.gz' },
        { expand: true, src: ['public/stylesheets/*.css'], ext: '.css.gz' }
      ]
    }
  }

  grunt.initConfig({
    clean: ['public', 'govuk_modules'],
    sass,
    watch,
    browserify,
    nodemon,
    concurrent,
    cssmin,
    concat,
    rewrite,
    compress
  });

  [
    'grunt-contrib-cssmin',
    'grunt-contrib-compress',
    'grunt-contrib-watch',
    'grunt-contrib-clean',
    'grunt-sass',
    'grunt-nodemon',
    'grunt-concurrent',
    'grunt-browserify',
    'grunt-contrib-concat',
    'grunt-rewrite'
  ].forEach(task => {
    grunt.loadNpmTasks(task)
  })

  grunt.registerTask('generate-assets', [
    'clean',
    'sass',
    'browserify',
    'concat',
    'rewrite',
    'compress',
    'cssmin'
  ])

  grunt.registerTask('default', ['generate-assets', 'concurrent:target'])

  /**
   * On watch, copy the asset that was changed, not all of them
   */
  grunt.event.on('watch', (action, filepath, target) => {
    if (target === 'assets') {
      grunt.config(
        'copy.assets.files.0.src',
        filepath.replace('common/assets/', '')
      )
    }
  })
}
