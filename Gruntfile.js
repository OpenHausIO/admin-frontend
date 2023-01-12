const pkg = require("./package.json");
const cp = require("child_process");

module.exports = (grunt) => {

    // Project configuration.
    grunt.initConfig({
        pkg,
        env: {
            options: {
                //Shared Options Hash
            },
            prod: {
                NODE_ENV: "production",
            }
        },
        compress: {
            main: {
                options: {
                    archive: `frontend-v${pkg.version}.tgz`
                },
                files: [{
                    expand: true,
                    src: "**/*",
                    cwd: "dist/"
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-env");

    grunt.registerTask("release", () => {
        [
            "npm run build",
            "npm run build:docker",
            `docker save openhaus/admin-frontend:latest | gzip > ./admin-frontend-v${pkg.version}-docker.tgz`,
            "grunt compress"
        ].forEach((cmd) => {
            cp.execSync(cmd);
        });
    });

};