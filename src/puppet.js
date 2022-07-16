'use strict';

const puppeteer = require('puppeteer');


const start=async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  
   
  const navigationPromise = page.waitForNavigation()


  await page.goto('https://food.grab.com/sg/en/')
  await page.waitForSelector('.ant-input')
  await page.type('.ant-input',"mount")
  await page.waitForSelector('.ant-btn')
  await page.click('.ant-btn')
  await navigationPromise
  
  
 
  
  const finalResponse = await page.waitForResponse(response => 
    response.url()==='https://portal.grab.com/foodweb/v2/search'
    && (response.request().method() === 'PATCH' 
    || response.request().method() === 'POST'), 11);
  let responseJson = await finalResponse.json();
  console.log(responseJson.searchResult.searchMerchants)
 
  
  
  
  let results=[]
  responseJson.searchResult.searchMerchants.map((ele)=>{
        results.push(ele.latlng)
  })
  
  
   await browser.close()
   return results

   
};

module.exports=start