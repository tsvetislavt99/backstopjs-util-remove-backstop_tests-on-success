const fs = require("fs/promises");
const path = require("path");

const BITMAP_TESTS = path.join(__dirname, "../bitmaps_test");

/**
 * @description This function reads the config.js file in the html_report folder and parses the JSON object after backstop has finished running.
 * If all tests have passed, it will delete the bitmaps_test folder.
 * If some tests have failed, it will delete the test images that have passed and the report.json files from each bitmaptest_directory. Failed test and diff images will be kept.
 */
function removeBitmapTestsOnSuccess() {
  setTimeout(async () => {
    const configJsFile = await fs.readFile(
      path.join(__dirname, "../html_report/config.js"),
      "utf8"
    );

    const results = JSON.parse(
      configJsFile.replace("report(", "").replace(");", "")
    );
    const testObjects = results.tests.map((testObject) => ({status:testObject.status, test:testObject.pair.test, filename: testObject.pair.fileName, diff:testObject.pair?.diffImage}) );

    const isSuccess = testObjects.every((testObject) => testObject.status === "pass");

    if (isSuccess) {
      try {
        await fs.rm(BITMAP_TESTS, { recursive: true }, (err) => {
          if (err) {
            console.log(`❌: ${err}`);
          }
        });
      } catch (err) {
        console.log(`❌: ${err}`);
      }
    }else{
      try{
        const bitmapTests = await fs.readdir(BITMAP_TESTS);

        bitmapTests.forEach(async (bitmapTest) => {
          const currDir = path.join(BITMAP_TESTS, bitmapTest);
          const currDirFiles = await fs.readdir(currDir);

          currDirFiles.forEach(async (file) => {
            testObjects.forEach(async (testObject) => {
              // Handles deleting the test image on tests that succeeded and the report.json file
              if((testObject.filename.includes(file) && testObject.status === 'pass') || file === 'report.json'){
                await fs.rm(path.join(currDir, file));
              }
            });

          });
          if(!currDirFiles.length){
            await fs.rmdir(currDir);
          }
        });


      }catch(err){
        console.log(`❌: ${err}`);
      }

    }
  }, 1000);
}

removeBitmapTestsOnSuccess();
