import { useEffect, useRef } from 'react';
import type { EChartsOption, SeriesOption } from 'echarts';
export type ChartKind = 'line' | 'bar' | 'donut' | 'radar' | 'gauge' | 'stack';
export function Chart({kind = 'line', variant = 0, tall = false, subject = ''}: {kind?:ChartKind; variant?:number; tall?:boolean; subject?:string}) {
 const ref = useRef<HTMLDivElement>(null);
 useEffect(() => {
  let cancelled=false; let dispose: (() => void) | undefined;
  async function render() {
   const echarts = await import('echarts');
   if(cancelled || !ref.current) return;
   const el=ref.current;
   const css=getComputedStyle(document.documentElement);
   const colors=['--primary','--chart-blue','--success','--warning','--chart-violet'].map(k=>css.getPropertyValue(k).trim());
   const colorAt=(i:number)=>colors[i] ?? css.getPropertyValue('--primary').trim();
   const muted=css.getPropertyValue('--muted-foreground').trim(); const border=css.getPropertyValue('--border').trim();
   const chart=echarts.init(el);
   const base: EChartsOption={color:colors,backgroundColor:'transparent',textStyle:{fontFamily:'Noto Sans SC',color:muted,fontSize:10},tooltip:{trigger:kind==='line'||kind==='bar'||kind==='stack'?'axis':'item',backgroundColor:css.getPropertyValue('--popover').trim(),borderColor:border,textStyle:{color:css.getPropertyValue('--foreground').trim(),fontSize:11}},animationDuration:900};
   const a=[260,310,285,390,360,420,385,460,425,490,465,510].map(v=>v+variant*17);
   const b=[210,260,230,310,290,355,320,365,340,405,390,425].map(v=>v+variant*10);
   let specific:EChartsOption={};
   if(kind==='line'||kind==='bar'||kind==='stack') {
    const names=kind==='stack'?['分选系统','输送系统','其他设备']:subject.includes('煤质')?['灰分 %','水分 %']:subject.includes('环境')?['粉尘 mg/m³','噪声 dB']:subject.includes('负载')?['主电机负载 %','辅助电机负载 %']:subject.includes('能效')?['实际电耗','目标电耗']:kind==='bar'?['实际产量','计划产量']:['原煤入洗量','精煤产量'];
    const series=names.map((name,i):SeriesOption=>{
     const values=kind==='bar'?(i===0?a:b).slice(0,6):i===0?a:i===1?b:b.map(v=>Math.round(v*.3));
     const data=subject.includes('煤质')?values.map(v=>+(v/40).toFixed(2)):subject.includes('环境')?values.map(v=>+(v/(i===0?450:7)).toFixed(2)):subject.includes('负载')?values.map(v=>+(v/6).toFixed(1)):values;
     if(kind==='line')return {name,type:'line',smooth:true,symbol:'none',data,lineStyle:{width:2},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:colorAt(i)},{offset:1,color:'transparent'}]),opacity:.14}};
     return {name,type:'bar',barMaxWidth:14,...(kind==='stack'?{stack:'energy'}:{}),data,itemStyle:{borderRadius:[3,3,0,0],color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:colorAt(i)},{offset:1,color:css.getPropertyValue('--secondary').trim()}])}};
    });
    specific={legend:{top:0,right:0,itemWidth:10,itemHeight:5,textStyle:{color:muted,fontSize:10},data:names},grid:{top:38,left:40,right:12,bottom:25},xAxis:{type:'category',data:kind==='bar'?['一班','二班','三班','四班','五班','六班']:['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],axisLine:{lineStyle:{color:border}},axisTick:{show:false},axisLabel:{fontSize:9,color:muted}},yAxis:{type:'value',splitLine:{lineStyle:{color:border,type:'dashed'}},axisLabel:{color:muted,fontSize:9}},series};
   } else if(kind==='donut') {
    const equipment=variant===1; const energy=subject.includes('能源'); const environment=subject.includes('环保');
    const data=equipment?[{name:'完好',value:98.6},{name:'待维护',value:1.4}]:energy?[{name:'分选',value:44},{name:'输送',value:30},{name:'回收',value:15},{name:'辅助',value:11}]:environment?[{name:'正常',value:99.8},{name:'检修',value:.2}]:[{name:'精煤',value:68.5},{name:'中煤',value:18.2},{name:'矸石',value:13.3}];
    specific={legend:{bottom:3,left:'center',itemWidth:7,itemHeight:7,textStyle:{color:muted,fontSize:10}},title:{text:equipment?'98.6%':energy?'44.0%':environment?'99.8%':'68.5%',subtext:equipment?'设备完好率':energy?'分选系统占比':environment?'正常运行率':'精煤产率',left:'center',top:'32%',textStyle:{color:colorAt(0),fontFamily:'Barlow',fontSize:29,fontWeight:600},subtextStyle:{color:muted,fontSize:10}},series:[{type:'pie',radius:['55%','72%'],center:['50%','45%'],label:{show:false},itemStyle:{borderWidth:4,borderColor:css.getPropertyValue('--background').trim(),borderRadius:3},data}]};
   } else if(kind==='radar') {
    specific={legend:{bottom:0,itemWidth:8,itemHeight:6,textStyle:{color:muted,fontSize:10}},radar:{center:['50%','46%'],radius:'63%',axisName:{color:muted,fontSize:10},indicator:['灰分','水分','硫分','发热量','回收率','稳定性'].map(name=>({name,max:100})),splitArea:{areaStyle:{color:['transparent',css.getPropertyValue('--muted').trim()]}},axisLine:{lineStyle:{color:border}},splitLine:{lineStyle:{color:border}}},series:[{type:'radar',symbolSize:3,lineStyle:{width:2},data:[{name:'实时指标',value:[86,78,92,89,84,94],areaStyle:{opacity:.2}},{name:'目标指标',value:[75,85,80,80,90,85],areaStyle:{opacity:.06}}]}]};
   } else {
    specific={series:[{type:'gauge',startAngle:210,endAngle:-30,radius:'88%',progress:{show:true,width:14},axisLine:{lineStyle:{width:14,color:[[1,border]]}},axisTick:{show:false},splitLine:{show:false},axisLabel:{show:false},pointer:{show:false},anchor:{show:false},title:{offsetCenter:[0,'40%'],color:muted,fontSize:11},detail:{offsetCenter:[0,'0%'],formatter:'{value}%',fontFamily:'Barlow',fontSize:36,color:colorAt(2)},data:[{value:96.8,name:'分选准确率'}]}]};
   }
   chart.setOption({...base,...specific},{notMerge:true});
   const observer=new ResizeObserver(()=>chart.resize()); observer.observe(el);
   dispose=()=>{observer.disconnect();chart.dispose();};
  }
  void render(); return()=>{cancelled=true;dispose?.();};
 },[kind,variant,subject]);
 return <div ref={ref} className={`chart ${tall?'chart-tall':''}`} aria-label={`${kind}数据图表`} />;
}
