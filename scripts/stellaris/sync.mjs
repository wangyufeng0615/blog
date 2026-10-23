import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const argument=process.argv.indexOf('--source');
if(argument<0||!process.argv[argument+1])throw new Error('Usage: node scripts/stellaris/sync.mjs --source /absolute/path/to/web-library/dist');
const source=path.resolve(process.argv[argument+1]);
const target=path.join(root,'posts/20261023');
const allowed=['index.html','style.css','app.js','i18n.js','preferences.js','worker.js','manifest.json','downloads.json','report.txt','data','downloads','texts','lookup','catalog.json','catalog.html','index.md','schema.md','llms.txt'];
// No index.md at post root: the blog intentionally gives Markdown articles precedence.
const artifactFiles=[];
function walk(dir,prefix=''){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(dir,d.name),prefix+d.name+'/'):[prefix+d.name])}
fs.mkdirSync(target,{recursive:true});
for(const item of allowed){
 const input=path.join(source,item),output=path.join(target,item==='index.md'?'overview.md':item);
 fs.cpSync(input,output,{recursive:true});
 const files=fs.statSync(input).isDirectory()?walk(input).map(f=>[path.join(input,f),(item+'/'+f)]):[[input,item==='index.md'?'overview.md':item]];
 for(const [file,name] of files)artifactFiles.push({path:name,sha256:createHash('sha256').update(fs.readFileSync(file)).digest('hex')});
}
// Blog snapshot uses a non-post Markdown overview; retain the rel=alternate link.
const index=path.join(target,'index.html');fs.writeFileSync(index,fs.readFileSync(index,'utf8').replace('href="index.md"','href="overview.md"'));
for(const file of artifactFiles)if(file.path==='index.html')file.sha256=createHash('sha256').update(fs.readFileSync(index)).digest('hex');
fs.writeFileSync(path.join(target,'meta.json'),JSON.stringify({title:'群星 · 星海文库',date:'2026-10-23T16:00:00+08:00',description:'群星 4.5.2 官方中英文案完整文库：150,415 条文本，单页搜索、语言与系统主题切换，保留原始来源，并提供 AI 可直接读取的 Markdown 与 JSON。',permalink:'/stellaris/',draft:false},null,2)+'\n');
fs.writeFileSync(path.join(target,'release.json'),JSON.stringify({source:'stellaris-text-export/web-library/dist',game_version:'Cygnus v4.5.2 (9776)',extracted_at:'2026-10-12',files:artifactFiles},null,2)+'\n');
console.log(`Copied controlled Stellaris snapshot (${artifactFiles.length} files) to ${target}`);
