const mix = require('laravel-mix');

mix.js('js/levus-touch-gallery.js', 'dist').inProduction();

mix.postCss('css/levus-touch-gallery.css', 'dist', [
    require('postcss-import'),
]).inProduction();