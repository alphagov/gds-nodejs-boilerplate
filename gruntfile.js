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

  const copy = {
    assets: {
      files: [
        {
          expand: true,
          cwd: 'common/assets/',
          src: ['**/*', '!sass/**', '!javascripts/**'],
          dest: 'public/'
        }
      ]
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
    js: {
      files: [
        'common/browsered/index.js',
        'common/assets/javascripts/**/*.js'
      ],
      tasks: ['browserify', 'babel', 'concat', 'compress'],
      options: {
        spawn: false,
        livereload: true
      }
    },
    templates: {
      files: ['app/**/*.njk', 'common/**/*.njk'],
      options: {
        spawn: false,
        livereload: true
      }
    },
    assets: {
      files: ['common/assets/**/*', '!common/assets/sass/**', '!common/assets/javascripts/**'],
      tasks: ['copy:assets', 'compress'],
      options: {
        spawn: false
      }
    }
  }

  const browserify = {
    'public/javascripts/browsered.js': ['common/browsered/index.js'],
    options: {
      browserifyOptions: {
        standalone: 'module'
      }
    }
  }

  const babel = {
    options: {
      presets: ['@babel/preset-env']
    },
    dist: {
      files: {
        'public/javascripts/browsered.js': 'public/javascripts/browsered.js'
      }
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
        'common/assets/javascripts/**/*.js'
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
    copy,
    sass,
    watch,
    browserify,
    babel,
    nodemon,
    concurrent,
    cssmin,
    concat,
    rewrite,
    compress
  });

  [
    'grunt-contrib-copy',
    'grunt-contrib-cssmin',
    'grunt-contrib-compress',
    'grunt-contrib-watch',
    'grunt-contrib-clean',
    'grunt-sass',
    'grunt-nodemon',
    'grunt-concurrent',
    'grunt-browserify',
    'grunt-contrib-concat',
    'grunt-rewrite',
    'grunt-babel'
  ].forEach(task => {
    grunt.loadNpmTasks(task)
  })

  grunt.registerTask('generate-assets', [
    'clean',
    'copy',
    'sass',
    'browserify',
    'babel',
    'concat',
    'rewrite',
    'compress',
    'cssmin'
  ])

  grunt.registerTask('default', ['generate-assets', 'concurrent:target'])
}
