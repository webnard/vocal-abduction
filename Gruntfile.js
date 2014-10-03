module.exports = function(grunt) {
  var ASSET_DIR = 'app/assets/';
  var BUILD_DIR = 'build/';
  var SPRITE_DIR = ASSET_DIR + 'sprites/';
  var SPRITE_PDF = ASSET_DIR + 'sprites/sprites.pdf'
  var DEFAULT_SPRITE_SCALE = 90; // DPI defaults to 90 in Inkscape

  var pdfmap = [ // map filenames to page numbers in the sprites.pdf file
    'cow-aerial.pdf:1',
    'ship1.pdf:2',
    'ship2.pdf:3',
    'ship3.pdf:4',
    'ship4.pdf:5',
    'profile1.pdf:6',
    'profile2.pdf:7',
    'profile3.pdf:8',
    'profile4.pdf:9',
    'profile4.pdf:9',
    'cow-side.pdf:10',
    'ship-glow1.pdf:11',
    'ship-glow2.pdf:12',
    'ship-glow3.pdf:13',
    'ship-glow4.pdf:14',
    'barn-aerial.pdf:15',
    'barn-side.pdf:16'
  ];

  grunt.initConfig({
    wiredep: {
      target: {
        src: [
          'app/index.html'
        ]
      }
    },
    shell: {
      pdftk: {
        command: 'pdftk ' + SPRITE_PDF + ' cat <%= grunt.task.current.args[1] %> output ' + BUILD_DIR + '<%= grunt.task.current.args[0] %>'
      }
    },
    inkscape: {
      sprites: {
        options: {
          density: "<%= grunt.task.current.args[1] %>"
        },
        files: [{
          expand: true,
          src: [BUILD_DIR + '*.pdf'],
          dest: SPRITE_DIR + '<%= grunt.task.current.args[0] %>/',
          ext: '.png',
          rename: function(dest, matchedSrcPath, options) {
            var newpath = dest + '/' + matchedSrcPath.replace(BUILD_DIR,'');
            return newpath;
          }
        }]
      }
    },
    clean: {
      build: [BUILD_DIR+'/*']
    }
  });
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-inkscape');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('sprites',
    pdfmap.map(function(item){return 'shell:pdftk:'+item})
    .concat([
        'inkscape:sprites:small:45',
        'inkscape:sprites:medium:90',
        'inkscape:sprites:large:180',
        'clean:build'
    ])
  );
  grunt.registerTask('default', 'wiredep')
};
