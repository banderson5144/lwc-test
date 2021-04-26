var jsforce = require('jsforce');
const sfApi = require('./sfLogin');
const obApi = require('./obApi');
var stringSimilarity = require("string-similarity");

var sfObjCountMap = {};
var obBkupObjCountMap = {};
var compare = [];

var conn;

async function start()
{
    console.log('Logging into SF');
    
    const loginRes = await sfApi.loginToSf();

    conn = new jsforce.Connection({
        version:'50.0',
        instanceUrl: loginRes.instance_url,
        accessToken: loginRes.access_token
    });

    console.log('Perform global describe from SF');

    const desRes = await conn.describeGlobal();

    console.log('Filter out all sObjects that have the queryable() attribute set to true');

    for(const sObj of desRes.sobjects)
    {
        if(sObj.queryable)
        {
            let queryRes = '';

            try
            {
                queryRes = await conn.query('Select Id From '+sObj.name);
            }catch(e)
            {
                //console.log(e);
            }

            const recCount = queryRes.totalSize;

            sfObjCountMap[sObj.name] = recCount;
        }
    }

    await obApi.loginOb();

    let obRes = await obApi.getBkupObjs();

    for(const res of obRes)
    {
        obBkupObjCountMap[res.name] = res.num_items;
    }

    let srchArry = Object.keys(obBkupObjCountMap)

    for(const i in sfObjCountMap)
    {
        let matches = stringSimilarity.findBestMatch(i, srchArry);
        let obName = matches.bestMatch.target;
        let deltaCnt = sfObjCountMap[i]-obBkupObjCountMap[obName]

        compare.push({
            sfObj:i,
            obObj:obName,
            delta:(deltaCnt),
            cellCss: deltaCnt > 1 ? 'slds-theme_error' : ''
        });
    }

    //Logout of OwnBackup API
    await obApi.logoutOb();

    //console.table(compare);
    //console.log(JSON.stringify(compare,null,2));
    return compare;
}

//start();

module.exports.start = start;