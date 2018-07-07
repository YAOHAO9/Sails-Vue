
#!/bin/sh
if [ "$(uname)" = "Darwin" ]
then
    sed -i '' 's#(global.Blob && obj instanceof Blob) ||#(global.Blob \&\& obj instanceof Blob)#g' node_modules/has-binary/index.js
    sed -i '' 's#(global.File && obj instanceof File)##g' node_modules/has-binary/index.js
elif [ "$(expr substr $(uname -s) 1 5)" = "Linux" ]
then
    sed -i 's#(global.Blob && obj instanceof Blob) ||#(global.Blob \&\& obj instanceof Blob)#g' node_modules/has-binary/index.js
    sed -i 's#(global.File && obj instanceof File)##g' node_modules/has-binary/index.js
else
    sed -i 's#(global.Blob && obj instanceof Blob) ||#(global.Blob \&\& obj instanceof Blob)#g' node_modules/has-binary/index.js
    sed -i 's#(global.File && obj instanceof File)##g' node_modules/has-binary/index.js 
fi
