'use strict';

const puppeteer = require('puppeteer');


const start=async (city) => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  
   
  const navigationPromise = page.waitForNavigation({waitUntil: 'networkidle2'})


  await page.goto('https://food.grab.com/sg/en/')
  await page.waitForSelector('.ant-input')
  await page.type('.ant-input',city)
  await page.waitForSelector('.ant-btn')
  await page.click('.ant-btn')
  await navigationPromise
  
  
 
  let counter = 10;
  let data=[]
 
  while (counter!=0) {
    await page.waitForSelector('.ant-btn')
    await page.click('.ant-btn')
    const finalResponse = await page.waitForResponse(response => 
      response.url()==='https://portal.grab.com/foodweb/v2/search'
      && (response.request().method() === 'PATCH' 
      || response.request().method() === 'POST'), 11);
     let responseJson = await finalResponse.json();
     
     data.push(...responseJson.searchResult.searchMerchants)
     counter--
     await page.waitForTimeout(1000)
  }  
 
 
  
  
  await browser.close()
  let results=[]
  data.map((ele)=>{
        results.push({Restaurant_Name:ele.address.name,latlad:ele.latlng})
  })
  
  
  
   return results

   
};

module.exports=start