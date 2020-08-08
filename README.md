# AngularProject
Mini angular project

# run all (zsh)
`(cd Generate; mongoimport --db AppDB --collection Movies --file ./Movies.json; cd ../angularFront ; ng serve & ; cd ../server ; npm run build-ts && npm run start &)`
use `killall node` to clear shadow process after.


