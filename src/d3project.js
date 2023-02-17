//地图+交互

import * as d3 from "d3";
import {calendarChart,calendarDel} from "./calendarChart.js";
import shenzhen from "./assets/shenzhen.csv";
import tianjin from "./assets/tianjin.csv";
import guangzhou from "./assets/guangzhou.csv";
import shanghai from "./assets/shanghai.csv";
import beijing from "./assets/beijing.csv";
import {allCityd3,lineDel} from "./allCityd3.js";
import allCity from "./allCity.js";
import chinaDay from "./assets/chinaday.csv";
import * as echarts from 'echarts/core';
import { GraphicComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

function d3project(data){
  var isScaled = 0;
  var live = 0;
  var selectId = -1;
  var dur = 500;
  var  width=(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth);
  //console.log(width);
  var  height=(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight)*0.98;
  var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height); 
  var covid=[31,37,38,321,2074,10678,1111,44,12185,12,59,782,0,676,1350,295,366,1722,1545,79,2451,381,521,35,11,243,305,1075,43,448,712,35995,112,8427721]
  var linear = d3.scaleLinear()
    .domain([990,90000])
    .range([0,255]);
  
  //设置南海位置
  var nanhai = document.getElementById("nanhai").style;
  nanhai.x = width - 200;
  nanhai.y = height - 200;  
  //按钮图片
  var mybutton = d3.select("#mybutton");

  var color=['#f7f7f7','#ffe5db','#ff9985','#f57567','#e64546','#b80909'];

  console.log(color);

  var title = d3.select("body").append("div");
  title.attr("id","aTitle")
  .attr("style",`position:absolute;top:0px;left:0px;width:${width}px;height:100px;`);
  //标题动画
  titleAnimation();
  
  //定义地图的投影
  var projection = d3.geoMercator()
            .center([107, 31])
            .scale(height*1.175)
            .translate([width/2, height/2]);
  
  //定义地形路径生成器
  var geoPath = d3.geoPath()
      .projection(projection); //设定投影
                  
  //console.log(geoPath); 
  //颜色比例尺
  var scaleColor = d3.scaleOrdinal()
              .domain(d3.range(data.features.length))
              .range(d3.schemeCategory10);

 var groups = svg.append("g").attr("transform",`translate(0,${width/10})`);

  var tooltip=d3.select("body")
            .append("div")
            .attr("class","tooltip");

  //绘制图例
  var legends = groups.append("g")
  .attr("class","legend")
  .attr("transform",`translate(${width/5},${height*3/5})`);
  legends.append("text")
  .attr("x",0)
  .attr("y",color.length*12+12)
  .attr("font-size",10)
  .text("2022年12月11日全国各省现有确诊量")
  .attr("font-weight","bold");
  var legend=legends.selectAll(".legende")
  .data(color)
  .enter()
  .append("g");
  legend.append("rect")
  .attr("x",0)
  .attr("y",(d,i)=>(color.length-i-1)*12)
  .attr("width",10)
  .attr("height",10)
  .attr("rx",2)
  .attr("ry",2)
  .attr("fill",d=>d)
  .on("click",function(ev,d){
    console.log("d",d);
    var that = this;
    groups.selectAll("path").filter(function(){
      if(this.getAttribute("id") == d)
        return true;
    })
    .attr("fill",function(){
      //console.log(this);
      if(this.getAttribute("fill") == d)
      {
        that.setAttribute("fill","#cccccc")
        return "#fff";
      }
      else
      {
        that.setAttribute("fill",d);
        return this.getAttribute("id");
      }

    });
    
  });
  legend.append("text")
  .attr("x",15)
  .attr("y",(d,i)=>(color.length-i)*12)
  .attr("id",(d,i)=>{
    console.log(d);
    return d.slice(1);
  })
  .attr("dy",-3.5)
  .attr("font-size",10)
  .text((d,i)=>{
    console.log(Math.pow(10,i-1));
    if(i == 0)
      return "0";
    else if(i == 5)
      return "≥10000"
    else
      return Math.pow(10,i-1).toString()+"~"+(Math.pow(10,i)-1).toString();
  });


groups.selectAll("path")
  .data(data.features)
  .enter()
  .append("path")
  .attr("class","province")
  .attr("id",function(d,i){
    //console.log(d);
    if(covid[i]<1)
      return color[0];
    else if(covid[i]<9)
      return color[1];
    else if(covid[i]<99)
      return color[2];
    else if(covid[i]<999)
      return color[3];
    else if(covid[i]<9999)
      return color[4];
    else
      return color[5];

  })
  .attr("stroke","#333")
  .attr("stroke-width","1px")
  .attr("info",(d,i)=>covid[i])
  .attr("fill",function(d,i){
    //console.log(d);
    if(covid[i]<1)
      return color[0];
    else if(covid[i]<9)
      return color[1];
    else if(covid[i]<99)
      return color[2];
    else if(covid[i]<999)
      return color[3];
    else if(covid[i]<9999)
      return color[4];
    else
      return color[5];

  })
  .attr("opacity",1)
  .attr("d",(d,i)=>geoPath(d))  //使用路径生成器
  .on("mousemove",function(ev,d){
    //console.log(i);
    if(isScaled)
    return;
    const change=d3.select(this)
      .attr("stroke-width","2px")
    var t=change.attr("info")
    tooltip.html(d.properties.name+"<br/>"+"现有确诊量："+t)
            .style("visibility","visible")
            .style("left", (window.event.clientX + 35) + "px")
            .style("top", (window.event.clientY) + "px")

  })
  .on("mouseout",function(d,i){
    //console.log(i);
    d3.select(this)
      .attr("stroke-width","1px")
    tooltip.style('visibility', 'hidden')
  })
  .on("click",function(ev,d){
    //console.log("ev",ev);
      clickMap(ev,d);
      if(!isScaled)
      {
        live = 0;
        d3.select(".changeMap")
        .text("全国疫情概况");
        clickMap(ev,d);
      }
    });
    
  function clickMap(ev,d){
    d3.selectAll(".allDt").remove();
    if(isScaled)
      isScaled = !isScaled;
    if(!isScaled)
      {
        selectId = -1;
        document.getElementById("nanhai").style.visibility = "visible";
      }
    groups.selectAll("path")
    .transition()
    .duration(dur)
    .attr("transform",(d)=>{
      console.log(isScaled);
      if(isScaled)
        return `translate(0,${-width/15}) scale(0.15)`;
      else
        return `translate(0,0) scale(1)`;
    });

    groups.selectAll(".cityName")
    .transition()
    .duration(dur)
    .attr("opacity",1)
    .delay(dur);

    groups.selectAll(".city")
    .transition()
    .duration(dur)
    .attr("opacity",1)
    .delay(dur);

    svg.select("#selectCityName")
    .transition()
    .duration(dur)
    .attr("opacity",0)
    .remove();

    legends.transition()
    .duration(dur)
    .attr("opacity",1)
    .delay(dur);

    lineDel();
    calendarDel();
  }

  var points = data.points.features;
  var coor = function(d){
    //console.log("d",d);
    var lngLat = d.geometry.coordinates;
    //console.log("lngLat",lngLat);
    var coor = projection(lngLat);
    //console.log("coor",coor);
    return coor;
  }
  

  //绘制各城市的点
  groups.selectAll('circle')
  .data(points)
  .join('circle')
  .attr("class","city")
  .attr("cx",function(d){
    //console.log(coor(d));
    return coor(d)[0];
  })
  .attr("cy",function(d){
    return coor(d)[1];
  })
  .attr("fill","#000")
  .attr("r",3)
  .on("click",function(ev,d){
    clickCity(ev,d);
  });
  function clickCity(ev,d){
    //console.log("ev",ev);
    if(isScaled) return;
    isScaled = !isScaled;
    console.log("click d",d);
    if(isScaled)
      {
        selectId = d.properties.id;
        document.getElementById("nanhai").style.visibility = "hidden";
      }
    else
      {
        selectId = -1;
        document.getElementById("nanhai").style.visibility = "visible";
      }
    groups.selectAll("path")
    .transition()
    .duration(dur)
    .attr("transform",(d)=>{
      //console.log(isScaled);
      if(isScaled)
        return `translate(0,${-width/15}) scale(0.15)`;
      else
        return `translate(0,0) scale(1)`;
    });

    groups.selectAll(".cityName")
    .transition()
    .duration(dur/2)
    .attr("opacity",0);

    groups.selectAll(".city")
    .transition()
    .duration(dur/2)
    .attr("opacity",0);

    legends.transition()
    .duration(dur/2)
    .attr("opacity",0);

    var selectCityName = svg.append("text")
    .attr("id","selectCityName")
    .text(d.properties.name)
    .attr("x",width/2)
    .attr("y",100)
    .attr("text-anchor","middle")
    .attr("font-size",25)
    .attr("opacity",0);

    selectCityName.transition()
    .duration(dur)
    .attr("opacity",1);

    var citySelect;
    if(d.properties.name == "深圳")
    {
      citySelect = shenzhen;
      //console.log("深圳");
    }
    else if(d.properties.name == "天津")
    {
      citySelect = tianjin;
      //console.log("天津");
    }
    else if(d.properties.name == "广州")
    {
      citySelect = guangzhou;
      //console.log("广州");
    }
    else if(d.properties.name == "上海")
    {
      citySelect = shanghai;
      //console.log("上海");
    }
    else if(d.properties.name == "北京")
    {
      citySelect = beijing;
      //console.log("北京");
    }

    //绘制月历图
    d3.csv(citySelect,function(d,_,columns){
      //console.log("d",d);
      //console.log("columns",columns);
      var reg = /(\d{1,2})月(\d{1,2})日/;
      d.month = d[columns[0]].replace(reg,"$1");//d[columns[0]]即d.date，格式为 m月d日
      d.day = d[columns[0]].replace(reg,"$2");
      d.date = d.day;
      //计算该天为该月的第几周，存为d.hour
      let temptTime = new Date(2022,d.month-1,d.day);
      //console.log("temp",temptTime);
      let weekday = temptTime.getDay() || 7
      temptTime.setDate(temptTime.getDate() - weekday + 1 + 5)
      let firstDay = new Date(temptTime.getFullYear(), d.month-1, 1)
      let dayOfWeek = firstDay.getDay()
      let spendDay = 1
      if (dayOfWeek != 0) {
        spendDay = 7 - dayOfWeek + 1
      }
      firstDay = new Date(temptTime.getFullYear(), d.month-1, 1 + spendDay)
      let dd = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000)
      let result = Math.ceil(dd / 7)
      d.hour =  result + 1;
      //console.log(d.month,d.day,d.hour);
      //将d.day改为星期
      var tDate = new Date(2022,d.month-1,d.day);
      d.day = tDate.getDay();
      if(d.day == 0)
        d.hour = d.hour + 1;
      if(d.range == "全市")
        d.range = 1;
      else if(d.range == "部分")
        d.range = 0;
      return{
        month:+d.month,//月
        day:+d.day,//星期
        date:+d.date,//日期
        hour: +d.hour,//该月第几周
        confirm:+d.confirm,//确诊
        no:+d.no,//无症状
        new:+d.new,//新增
        range:+d.range//大筛
      }
    }).then ((data,error) => {
      if(error)
      {
        console.log(error);
      }
      else
      {
        //console.log(data);
        calendarChart(data);  
      }
    });
  }
 
  //绘制各城市的名称
  groups.selectAll('.text')
  .data(points)
  .enter()
  .append("text")
  .attr("class","cityName")
  .text((d,i)=>d.properties.name)
  .attr("text-anchor","start")
  .attr("fill","#000")
  .attr("font-size","14px")
  .attr("transform",function(d){
    var x=coor(d)[0] + 4;
    var y=coor(d)[1] + 3;
    return `translate(${x},${y})`;
  })
  .attr('font-weight','bold')
  .on("click",function(ev,d){
    clickCity(ev,d);
  })
  .style("cursor","default");//让鼠标移动到字上的时候不会变成text样式

  //绘制按钮
  mybutton.attr("x",width/80)
  .attr("y",width/10)
  .attr("width",width/11)
  .attr("height",width/30)
  .on("click",(ev,d)=>{
    live = !live;
    if(live)
      {
        map2city(ev,d);
        d3.select(".changeMap")
        .text("部分城市详情");
      }
    else
      {
        d3.select(".changeMap")
        .text("全国疫情概况");
        clickMap(ev,d);
      }
  });

  //绘制折线图
  map2line();
  function map2line()
  {
    if(isScaled)
    {
      svg.select("#selectCityName")
      .transition()
      .duration(dur)
      .attr("opacity",0)
      .remove();
      lineDel();
      calendarDel();
    }
    isScaled = 1;
    //console.log("click d",d);
    document.getElementById("nanhai").style.visibility = "hidden";
    groups.selectAll("path")
    .attr("transform",(d)=>{
      //console.log(isScaled);
      if(isScaled)
        return `translate(0,${-width/15}) scale(0.15)`;
      else
        return `translate(0,0) scale(1)`;
    });

    groups.selectAll(".cityName")
    .attr("opacity",0);

    legends.attr("opacity",0);

    groups.selectAll(".city")
    .attr("opacity",0);
    //console.log("点击");
    d3.csv(chinaDay).then((data,error)=>{
      if(error)
      {
        console.log(error);
      }
      else
      {
        console.log(data);
        allCityd3(data);
      }
      });

  }
  function map2city(ev,d){
    if(isScaled)
    {
      svg.select("#selectCityName")
      .transition()
      .duration(dur)
      .attr("opacity",0)
      .remove();
      lineDel();
      calendarDel();
    }
    isScaled = 1;
    //console.log("click d",d);
    document.getElementById("nanhai").style.visibility = "hidden";
    groups.selectAll("path")
    .transition()
    .duration(dur)
    .attr("transform",(d)=>{
      //console.log(isScaled);
      if(isScaled)
        return `translate(0,${-width/15}) scale(0.15)`;
      else
        return `translate(0,0) scale(1)`;
    });

    groups.selectAll(".cityName")
    .transition()
    .duration(dur/2)
    .attr("opacity",0);

    groups.selectAll(".city")
    .transition()
    .duration(dur/2)
    .attr("opacity",0);

    legends.transition()
    .duration(dur/2)
    .attr("opacity",0);

    d3.selectAll(".allDt").remove();

    var allDt = d3.select("body")
    .append("div")
    .attr("class","allDt")
    .attr("style",`position: absolute;width: ${width-width/8}px;height:500px;float: left;background-color: rgba(255, 255, 255, 0.6);z-index:999;left:${width/8}px;top:150px;opacity:0`);

    allDt
    .append("div")
    .attr("id","main")
    .attr("style","width: 50%;height:500px;float: left;background-color: rgba(255, 255, 255, 0.6);");

    allDt
    .append("div")
    .attr("id","main1")
    .attr("style","width: 50%;height:500px;float: left;background-color: rgba(255, 255, 255, 0.6);");
    allCity();
    d3.select(".allDt")
    .transition()
    .duration(dur)
    .delay(dur)
    .style("opacity",1);

  }

  svg.append("text")
  .attr("class","changeMap")
  .attr("transform",`translate(${width/17},${width/10+width/60+width/240})`)
  .text("全国疫情概况")
  .attr("font-size",width/100)
  .attr("text-anchor","middle")
  .style("cursor","default")
  .attr("fill","black")
  .attr("font-weight","bold")
  .attr("pointer-events","none");
}

function titleAnimation(){
echarts.use([GraphicComponent, CanvasRenderer]);
var chartDom = document.getElementById('aTitle');
var myChart = echarts.init(chartDom);
var option;

option = {
  graphic: {
    elements: [
      {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: '新冠疫情大数据报告',
          fontSize: 35,
          fontWeight: 'bold',
          lineDash: [0, 200],
          lineDashOffset: 0,
          fill: 'transparent',
          stroke: '#000',
          lineWidth: 1
        },
        keyframeAnimation: {
          duration: 10000,
          loop: true,
          keyframes: [
            {
              percent: 0.2,
              style: {
                fill: 'transparent',
                lineDashOffset: 200,
                lineDash: [200, 0]
              }
            },
            {
              // Stop for a while.
              percent: 2,
              style: {
                fill: 'transparent'
              }
            },
            {
              percent: 0.4,
              style: {
                fill: 'black'
              }
            }
          ]
        }
      }
    ]
  }
};

option && myChart.setOption(option);
}
  
  export default d3project;