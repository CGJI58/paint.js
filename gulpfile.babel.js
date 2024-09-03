import gulp from "gulp";
import gulpGhPages from "gulp-gh-pages";
import { deleteAsync } from "del";
import ws from "gulp-webserver";
import bro from "gulp-bro";
import babelify from "babelify";

const routes = {
  html: {
    src: "./src/index.html",
    dest: "build",
  },
  css: {
    src: "./src/css/*.css",
    dest: "build/css",
  },
  js: {
    src: "./src/js/app.js",
    dest: "build/js",
  },
};

const html = () => gulp.src(routes.html.src).pipe(gulp.dest(routes.html.dest));

const clean = async () => await deleteAsync(["build/", ".publish"]);

const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

const styles = () => gulp.src(routes.css.src).pipe(gulp.dest(routes.css.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const gh = () => gulp.src("src/**/*").pipe(gulpGhPages());

const assets = gulp.series([html, styles, js]);

export const build = gulp.series([clean, assets]);

export const dev = gulp.series([build, webserver]);

export const deploy = gulp.series([build, gh, clean]);
