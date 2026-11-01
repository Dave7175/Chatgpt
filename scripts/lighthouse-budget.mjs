import {readFileSync} from 'node:fs';
const paths=process.argv.slice(2);
if(!paths.length)throw new Error('Pass one or more Lighthouse JSON reports.');
let failed=false;
for(const path of paths){
 const report=JSON.parse(readFileSync(path,'utf8'));
 if(report.runtimeError){console.error(path,report.runtimeError.code);failed=true;continue;}
 for(const [name,min] of Object.entries({performance:.9,accessibility:.95,'best-practices':.95,seo:.95})){
  const score=report.categories?.[name]?.score;
  if(typeof score!=='number'||score<min){console.error(`${path}: ${name} ${score} below ${min}`);failed=true;}
 }
 for(const [name,max] of Object.entries({'largest-contentful-paint':2500,'cumulative-layout-shift':.1})){
  const value=report.audits?.[name]?.numericValue;
  if(typeof value!=='number'||value>max){console.error(`${path}: ${name} ${value} above ${max}`);failed=true;}
 }
 console.log(`${path}: ${report.configSettings.formFactor}, LCP=${report.audits['largest-contentful-paint'].displayValue}, CLS=${report.audits['cumulative-layout-shift'].displayValue}`);
}
process.exitCode=failed?1:0;

