const fs = require("fs/promises");
const path = require("path");

const BITMAP_TESTS = path.join(__dirname, "../bitmaps_test");

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
        const failedTestObjects = testObjects.filter((testObject) => testObject.status !== "pass");
        const bitmapTests = await fs.readdir(BITMAP_TESTS);

        bitmapTests.forEach(async (bitmapTest) => {
          const currDir = path.join(BITMAP_TESTS, bitmapTest);
          const currDirFiles = await fs.readdir(currDir);

          currDirFiles.forEach(async (file) => {

            failedTestObjects.forEach(async failedTest =>{
              if(!failedTest.filename.includes(file) && failedTest.diff && !failedTest.diff.includes(file)){
                await fs.unlink(path.join(currDir, file));
              }
            })
            
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
