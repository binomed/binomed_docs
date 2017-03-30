module.exports = function (grunt) {

  // Configuration du build
  grunt.initConfig({

    // Paramétrage

    
    src : {
        html: {
          index:    'index.html',
          all :     '*.html'
        },
        js:   'js/**/*.js',
        markdown:   'assets/**/*.md',
        css: {
          all :'css/**/*.css',
          dir: 'css',
          theme: 'css/theme',
          app: 'css/style.css'
        },
        sass: {
          all :'scss/**/*.scss',
          dir: 'scss',
          theme:  {
            dir : 'scss/theme',
            js : 'scss/**/*.js'
          }
        },
        assets: {
          font:     'assets/font',
          images:   'assets/images'
        }
    },
   
    clean: {
        css:   '<%= src.css.dir %>'
    },

    copy: {
        theme:{
            files: [
                {expand: true, cwd: '<%= src.sass.theme.dir %>', src: ['**'], dest: '<%= src.css.theme %>'}
                
            ]
        }
             
    },

    
    // Configuration du watch
    watch: {
        /*html: {            
            files: ['<%= src.html.all %>'],
            options: {
              livereload: true
            }
        },
        css: {
            files: ['<%= src.css.all %>'],
            options: {
              livereload: true
            }
        },*/
        sass: {
            files: ['<%= src.sass.all %>'],
            tasks: ['compass']
        },
        /*js: {
            files: ['<%= src.js %>',],
            options: {
              livereload: true
            }
        },*/
        js_theme: {
            files: ['<%= src.sass.theme.js %>',],
            tasks: ['copy']/*,
            options: {
              livereload: true
            }*/
        }/*,
        markdown: {
            files: ['<%= src.markdown %>'],
            options: {
              livereload: true
            }
        }*/
    },

    browserSync: {
        bsFiles: {
            src : ['<%= src.css.all %>',
                  '<%= src.html.all %>',
                  '<%= src.js %>',
                  '<%= src.sass.theme.js %>',
                  '<%= src.markdown %>']
        },
        options: {
            server: {
                baseDir: "./"
            },
            watchTask: true 
        }
    },
    
      
    // Sass configuration
      
    compass:{
        style:{
            options:{
                sassDir: 'scss/prez',
                sourcemap:true,
                cssDir : 'css'
            }
        },
        theme:{
            options:{
                sassDir: 'scss/theme',
                sourcemap:true,
                cssDir : 'css/theme'
            }
        }
        
        
    }

  });

  // Chargement des clients
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-compass');
  
  // Déclaration des taches
  grunt.registerTask('prod',    ['clean', 'copy', 'compass']);
  grunt.registerTask('serve',    ['copy', 'compass', 'browserSync', 'watch']);
  grunt.registerTask('default', ['prod']);

};
