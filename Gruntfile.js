module.exports = function(grunt) {
  var ASSET_DIR = 'app/assets/';
  var SPRITE_DIR = ASSET_DIR + 'sprites/';

  grunt.initConfig({
    wiredep: {
      target: {
        src: [
          'app/index.html'
        ]
      }
    },
    /**
     * To make this work:
     * - pdftk sprites.pdf cat $pagenum output sprite$pagenum.pdf
     * either:
     *  - inkscape -f sprite$pagenum.pdf -e $spritename.png -d $(90*$scale) # see http://tavmjong.free.fr/INKSCAPE/MANUAL/html/CommandLine-Export.html
     *  OR
     *  # export a plain svg
     *  - inkscape -l $spritename.svg sprite$pagenum.pdf # has trouble with shadow??
     */
    inkscape: {
      all: {
        options: {},
        files: [{
          expand: true,
          src: [SPRITE_DIR + '*.pdf'],
          dest: SPRITE_DIR + 'small/',
          ext: '.png',
          rename: function(dest, matchedSrcPath, options) {
            var newpath = dest + '/' + matchedSrcPath.replace(SPRITE_DIR,'');
            console.log(newpath);
            return newpath;
          }
        }]
      }
    }
  });
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-inkscape');
  grunt.loadNpmTasks('grunt-shell');
  grunt.registerTask('default', ['wiredep'])
};
