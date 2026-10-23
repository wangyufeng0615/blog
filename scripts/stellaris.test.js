import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {gunzipSync} from 'node:zlib';
const root='posts/20261023';
const load=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));

test('Stellaris plain exports preserve every record and exact lookup namespace',()=>{
 const manifest=load('manifest.json'),catalog=load('catalog.json');
 const reference=manifest.texts.files.flatMap(file=>JSON.parse(gunzipSync(fs.readFileSync(path.join(root,file)))));
 const actual=new Map();
 for(const source of catalog.sources){
  const exported=load(source.json);assert.equal(exported.count,source.count);
  for(const row of exported.entries){const {id,...data}=row;assert(!actual.has(id));actual.set(id,data)}
 }
 assert.equal(actual.size,150415);assert.equal(catalog.total_entries,reference.length);
 reference.forEach((r,i)=>assert.deepEqual(actual.get('texts:'+i),r));
 for(const key of ['gameplay:crisis.2010.desc','gameplay:DIALOG_AGREE','legacy_launcher:DIALOG_AGREE']){
  const textKey=key.slice(key.indexOf(':')+1),prefix=textKey.slice(0,2).toLowerCase().replace(/[^a-z0-9]/g,'_');
  const target=load(`lookup/${prefix}.json`)[key];assert(target,key);
  assert(load(target.json).entries.some(r=>r.namespace+':'+r.key===key));
 }
 assert.equal(fs.existsSync(path.join(root,'index.md')),false,'Must stay a custom HTML blog post');
});

test('Theme follows system changes, respects manual choice and returns to system',()=>{
 let onChange,stored;const classes=new Set();const media={matches:true,addEventListener:(_,fn)=>{onChange=fn}};
 const document={documentElement:{style:{},dataset:{},classList:{toggle:(key,on)=>on?classes.add(key):classes.delete(key)}}};
 const window={};const context={document,window,matchMedia:()=>media,localStorage:{getItem:()=>stored,setItem:(_,v)=>{stored=v}}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'preferences.js'),'utf8'),context);
 assert.equal(document.documentElement.style.colorScheme,'dark');media.matches=false;onChange();assert(classes.has('light'));
 window.stellarTheme.set('dark');assert(!classes.has('light'));media.matches=false;onChange();assert(!classes.has('light'));assert.equal(stored,'dark');
 window.stellarTheme.set('system');assert(classes.has('light'));media.matches=true;onChange();assert(!classes.has('light'));
 window.stellarTheme.set('light');assert(classes.has('light'));assert.equal(stored,'light');
 vm.runInNewContext(fs.readFileSync(path.join(root,'preferences.js'),'utf8'),context);assert(classes.has('light'));
});
