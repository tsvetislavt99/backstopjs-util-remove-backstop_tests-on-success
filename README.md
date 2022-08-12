# backstopjs-remove-backstop_tests-on-success

This is a utility function to remove the files from bitmap_tests when tests pass successfully.

 - If all tests succeed the script will delete the whole `bitmap_tests` folder

 - If there is a failed test, it will only leave the relevant files for it, deleting generated files for the successful tests.

## Usage

In `package.json` where your script to run backstopjs tests add:

```json
"ui-test": "_your_script_to_run_tests_ ; node ./backstop/utils/remove-bitmap-tests-on-success.js"
```

Important: Make sure to use the `;` so the script is executed once the tests are over. 

## Example file structure

```
project
│
└───backstop
│   │
│   └───bitmaps_reference
│   │       test_reference_nav.png
│   │       test_reference_nav_mobile.png
│   │       ...
│   └───html_report
│   │       config.js
│   │       ...
│   │       
│   └───utils
            remove-bitmap-tests-on-success.js
            ...   
 
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)