module.exports = function (grunt) {

  // Configuration du build
  grunt.initConfig({

    // Paramétrage

    
    src : {
        css: {
          all :'css/*.css',
          dir: 'css',
          script: 'css/js'
        },
        sass: {
          all :'scss/*.scss',
          dir: 'scss',
          script : 'scss/js'
        }
    },
   
    clean: {
        css:   '<%= src.css.dir %>'
    },

    copy: {
        theme:{
            files: [
                {expand: true, cwd: '<%= src.sass.script %>', src: ['**'], dest: '<%= src.css.script %>'}
                
            ]
        }
             
    },

    
    // Configuration du watch
    watch: {
        css: {
            files: ['<%= src.css.all %>'],
            options: {
              livereload: true
            }
        },
        sass: {
            files: ['<%= src.sass.all %>'],
            tasks: ['compass']
        },
        theme_js: {
            files: ['<%= src.sass.dir %>/**/*.js'],
            tasks: ['copy'],
            options: {
              livereload: true
            }
        }
    },
    
      
    // Sass configuration
      
    compass:{
      bootstrap:{
        options:{
            sassDir: 'scss',
            sourcemap: true,
            cssDir : '<%= src.css.dir %>'
        }
      }
        
        
    }

  });

  // Chargement des clients
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  
  // Déclaration des taches
  grunt.registerTask('prod',    ['clean', 'copy', 'compass']);
  grunt.registerTask('default', ['prod']);

};
