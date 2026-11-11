/* Arcana Atlas V4 — lousa e reconhecimento heurístico 100% local.
   Não é OCR nem IA: compara formas normalizadas com a tipografia hebraica do navegador.
   A pontuação é orientativa, não uma comprovação de caligrafia correta. */
(() => {
'use strict';
const W=640,H=460,N=64,PAD=8;
const fontList=['Arial','Times New Roman','Segoe UI'];
const referenceCache=new Map();
const onCanvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
function setup(canvas,onUpdate){
  canvas.width=W;canvas.height=H;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  let strokes=[],current=null,pointer=null;
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#fffefa';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#16273b';ctx.fillStyle='#16273b';ctx.lineWidth=17;ctx.lineJoin='round';ctx.lineCap='round';
    for(const stroke of strokes){
      if(!stroke.length)continue;
      ctx.beginPath();ctx.moveTo(stroke[0][0]*W,stroke[0][1]*H);
      if(stroke.length===1){ctx.arc(stroke[0][0]*W,stroke[0][1]*H,8.5,0,Math.PI*2);ctx.fill();continue;}
      for(let i=1;i<stroke.length;i++)ctx.lineTo(stroke[i][0]*W,stroke[i][1]*H);
      ctx.stroke();
    }
    if(onUpdate)onUpdate(strokes.length,strokes.some(s=>s.length>1));
  }
  function point(e){const r=canvas.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];}
  canvas.addEventListener('pointerdown',e=>{
    if(e.button!==0&&e.pointerType==='mouse')return;
    e.preventDefault();pointer=e.pointerId;current=[point(e)];strokes.push(current);canvas.setPointerCapture(e.pointerId);draw();
  });
  canvas.addEventListener('pointermove',e=>{
    if(pointer!==e.pointerId||!current)return;
    e.preventDefault();const p=point(e),last=current[current.length-1];
    // Avoid hundreds of nearly identical points on slow touchscreens.
    if(Math.hypot((p[0]-last[0])*W,(p[1]-last[1])*H)>=1.5){current.push(p);draw();}
  });
  function finish(e){if(pointer!==e.pointerId)return;pointer=null;current=null;draw();}
  canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);canvas.addEventListener('lostpointercapture',()=>{pointer=null;current=null;});
  draw();
  return {
    clear(){strokes=[];pointer=null;current=null;draw();},
    undo(){strokes.pop();pointer=null;current=null;draw();},
    empty(){return !strokes.length||strokes.every(s=>s.length<2);},
    snapshot(){return canvas.toDataURL('image/png');},
    strokes(){return strokes.map(s=>s.map(p=>[...p]));},
    canvas
  };
}
function getInk(canvas, source='drawing'){
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const {data,width,height}=ctx.getImageData(0,0,canvas.width,canvas.height);
  const mask=new Uint8Array(width*height);
  let x0=width,y0=height,x1=-1,y1=-1,pixels=0;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const i=y*width+x,k=i*4;
    // The user's strokes are dark blue on a warm light background.
    // Reference canvases use opaque near-black ink on a white background.
    const ink=source==='drawing'?data[k]<125&&data[k+1]<125&&data[k+2]<155:(data[k+3]>90&&data[k]<145);
    if(ink){mask[i]=1;pixels++;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  }
  if(x1<0||pixels<25)return null;
  return {mask,width,height,box:{x0,y0,x1,y1},pixels};
}
function normalizedMask(canvas,kind){
  const raw=getInk(canvas,kind);if(!raw)return null;
  const {x0,y0,x1,y1}=raw.box;
  const bw=x1-x0+1,bh=y1-y0+1;
  const out=onCanvas(N,N),ctx=out.getContext('2d',{willReadFrequently:true});
  const scale=Math.min((N-PAD*2)/bw,(N-PAD*2)/bh);
  const dx=(N-bw*scale)/2,dy=(N-bh*scale)/2;
  // Pixelated image scaling would destroy thin handwritten strokes.
  ctx.imageSmoothingEnabled=true;ctx.drawImage(canvas,x0,y0,bw,bh,dx,dy,bw*scale,bh*scale);
  const result=new Uint8Array(N*N),data=ctx.getImageData(0,0,N,N).data;
  let filled=0;
  for(let i=0;i<result.length;i++){
    const k=i*4;
    const ink=kind==='drawing'?data[k+3]>75&&data[k]<175&&data[k+1]<175:(data[k+3]>60&&data[k]<175);
    result[i]=ink?1:0;filled+=result[i];
  }
  if(filled<10)return null;
  return {mask:result,filled,bboxRatio:bw/bh,widthRaw:bw,heightRaw:bh};
}
// Zhang–Suen thinning removes differences in brush width before comparison.
function skeletonize(src){
  let a=Uint8Array.from(src),changed=true,turn=0;
  while(changed&&turn++<45){
    changed=false;
    for(let phase=0;phase<2;phase++){
      const remove=[];
      for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){
        const i=y*N+x;if(!a[i])continue;
        const p2=a[i-N],p3=a[i-N+1],p4=a[i+1],p5=a[i+N+1],p6=a[i+N],p7=a[i+N-1],p8=a[i-1],p9=a[i-N-1];
        const n=p2+p3+p4+p5+p6+p7+p8+p9;
        if(n<2||n>6)continue;
        const z=(!p2&&p3)+(!p3&&p4)+(!p4&&p5)+(!p5&&p6)+(!p6&&p7)+(!p7&&p8)+(!p8&&p9)+(!p9&&p2);
        if(z!==1)continue;
        if(phase===0){if(p2*p4*p6||p4*p6*p8)continue;}
        else if(p2*p4*p8||p2*p6*p8)continue;
        remove.push(i);
      }
      if(remove.length){changed=true;for(const i of remove)a[i]=0;}
    }
  }
  return a;
}
function distanceMap(mask){
  const d=new Float32Array(N*N);for(let i=0;i<d.length;i++)d[i]=mask[i]?0:1000;
  const diag=1.41421356;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const i=y*N+x;if(x)d[i]=Math.min(d[i],d[i-1]+1);
    if(y){d[i]=Math.min(d[i],d[i-N]+1);if(x)d[i]=Math.min(d[i],d[i-N-1]+diag);if(x<N-1)d[i]=Math.min(d[i],d[i-N+1]+diag);}
  }
  for(let y=N-1;y>=0;y--)for(let x=N-1;x>=0;x--){
    const i=y*N+x;if(x<N-1)d[i]=Math.min(d[i],d[i+1]+1);
    if(y<N-1){d[i]=Math.min(d[i],d[i+N]+1);if(x<N-1)d[i]=Math.min(d[i],d[i+N+1]+diag);if(x)d[i]=Math.min(d[i],d[i+N-1]+diag);}
  }
  return d;
}
function points(mask){const p=[];for(let i=0;i<mask.length;i++)if(mask[i])p.push(i);return p;}
function profile(raw){const skeleton=skeletonize(raw.mask);return {points:points(skeleton),distance:distanceMap(skeleton),shape:raw.bboxRatio,filled:raw.filled};}
function template(glyph,font){
  const cacheKey=glyph+'|'+font;
  if(referenceCache.has(cacheKey))return referenceCache.get(cacheKey);
  const c=onCanvas(480,480),ctx=c.getContext('2d');
  ctx.fillStyle='#080808';ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction='rtl';
  ctx.font=`360px "${font}"`;ctx.fillText(glyph,240,236);
  const ink=normalizedMask(c,'template');
  const value=ink?profile(ink):null;referenceCache.set(cacheKey,value);return value;
}
function compare(a,b){
  if(!a||!b||!a.points.length||!b.points.length)return 0;
  const avg=(indices,dist)=>indices.reduce((sum,i)=>sum+Math.min(dist[i],16),0)/indices.length;
  const a2b=avg(a.points,b.distance),b2a=avg(b.points,a.distance);
  const near=(indices,dist)=>indices.filter(i=>dist[i]<3.1).length/indices.length;
  const coverage=(near(a.points,b.distance)+near(b.points,a.distance))/2;
  const shapePenalty=Math.min(1,Math.abs(Math.log(Math.max(.05,a.shape)/Math.max(.05,b.shape)))/1.6);
  return Math.max(0,Math.min(100,100*(0.67*Math.exp(-(a2b+b2a)/9.4)+0.33*coverage)-9*shapePenalty));
}
function evaluate(pad,glyph){
  const ink=normalizedMask(pad.canvas,'drawing');
  if(!ink)return {ok:false,score:0,verdict:'Lousa sem traços suficientes',details:'Desenhe o símbolo antes de avaliar.'};
  if(ink.widthRaw<20||ink.heightRaw<16||ink.pixels<45)return {ok:false,score:0,verdict:'Desenho pequeno demais',details:'Faça a letra maior e mais legível no centro da lousa.'};
  const drawn=profile(ink);
  const scores=fontList.map(font=>compare(drawn,template(glyph,font)));
  const score=Math.round(Math.max(...scores));
  const ok=score>=68;
  const verdict=score>=83?'Muito parecido!':score>=68?'Boa aproximação!':score>=52?'Você está chegando perto':'Formato ainda diferente';
  const details=ok?'O contorno se aproxima do modelo. Confira as pequenas diferenças abaixo.':'Compare a sua forma com o modelo e tente novamente na próxima rodada. A escrita manual pode variar da fonte impressa.';
  return {ok,score,verdict,details};
}
window.ARCA_DRAW=Object.freeze({setup,evaluate});
})();
