//日历图

import * as d3 from "d3";

var gg;
var tooltip;

function calendarChart(data){
    var g = d3.select("svg")
    .append("g")
    .attr("calss","calendar");

    gg=g;
    //console.log(data);
    var  width=(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth);
    var  height=(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight)*0.98;
    //console.log(height);
    var cellSize = height/32; //一格占用大小

    var monthRange = d3.range(d3.min(data,d => d.month),d3.max(data,d => d.month)+1);//生成月份序列
    //console.log('monthRange',monthRange);
       
    var radius = d3.scaleSqrt()
    .domain([0,d3.max(data,d=>d.new)])
    .range([0,cellSize/2-2]);

    g.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",27*cellSize)
    .attr("height",27*cellSize)
    .attr("fill","rgba(255,255,255,0.9)");
  //创建画布
    var svg = g
        .attr("width", width)
        .attr("height", height)
        .attr("transform",`translate(${width/2-13.5*cellSize},150)`);
    //  Tooltip
    tooltip=d3.select("body")
    .append("div")
    .attr("class","tooltip")
    .attr("id","tooltip2");

    var legend = ["确诊","无症状","新增"];
    //绘制注解，图例
    svg.selectAll(".textLe")
    .data(legend)
    .enter()
    .append("text")
    .text(d=>d)
    .attr("font-size",cellSize/1.5)
    .attr("fill","#555")
    .attr("text-anchor","middle")
    .attr("x",0)
    .attr("y",(d,i)=>cellSize*3.5+cellSize*9*i)
    .attr("writing-mode","vertical-rl")
    .attr("letter-spacing",2)
    .attr("pointer-events","none");

    var color = [{"color":"rgba(255,219,153,0.8)","range":"部分检测（学校抽检）"},{"color":"rgba(255,153,153,0.8)","range":"全市大筛"}];
    var legendColor = g.append("g").attr("transform",`translate(${cellSize*20},${-cellSize*3.5})`).selectAll(".legendColor")
    .data(color)
    .enter();
    legendColor
    .append("rect")
    .attr("x",0)
    .attr("y",(d,i)=>cellSize*i)
    .attr("width",cellSize-4)
    .attr("height",cellSize-4)
    .attr("cx",2)
    .attr("cy",2)
    .attr("fill",d=>d.color);
    legendColor.append("text")
    .attr("x",cellSize+1)
    .attr("y",(d,i)=>cellSize*i)
    .attr("dy",cellSize/1.5)
    .attr("font-size",cellSize/1.5)
    .text(d=>d.range);
    

    drawCalendar(data,"confirm",0);
    drawCalendar(data,"no",1);
    drawCalendar(data,"new",2);

    //绘制
    function drawCalendar(data,strSel,lineIndex){
        //字体大小
        var fontSize = cellSize/2;
        //绘制各日历
        var eachCalendar = svg.selectAll(".eachCalendar").data(monthRange).enter().append("g")
        .attr("transform",(d,i)=>{
            var x = (i % 3) * cellSize * 9;
            var y = lineIndex * cellSize * 9;
            //console.log(x,y);
            return `translate(${x},${y})`;
        })
        .attr("width",cellSize*9)
        .attr("height",cellSize*8);
        //绘制月份
        eachCalendar.append("text")
        .attr("x",cellSize*4.5)
        .attr("y",0)
        .attr("dy",-cellSize/2+fontSize/2)
        .text(d=>{return d+"月";})
        .attr("text-anchor","middle")
        .attr("fill","#000")
        .attr("font-size",fontSize)
        .attr("pointer-events","none");
        //绘制星期
        eachCalendar.selectAll(".legend")
        .data(["日", "一", "二", "三", "四", "五", "六"])
        .enter()
        .append("text")
        .attr("class", "mono")
        .text(d=>d)
        .attr("x", (d, i)=>cellSize * (i+1.5))
        .attr("y", cellSize)
        .attr("dy",-cellSize/2+fontSize/2)
        .attr("fill","#000")
        .attr("font-size",fontSize)
        .attr("text-anchor","middle")
        .attr("pointer-events","none");
        //绘制横线
        eachCalendar.selectAll(".rLine")
        .data(d3.range(8))
        .enter()
        .append("line")
        .attr("x1",cellSize)
        .attr("y1",(d,i)=>cellSize*(0+i))
        .attr("x2",cellSize*8)
        .attr("y2",(d,i)=>cellSize*(0+i))
        .attr("stroke","rgba(0,0,0,1)")
        .attr("fill","#555");
        //绘制竖线
        eachCalendar.selectAll(".cLine")
        .data(d3.range(8))
        .enter()
        .append("line")
        .attr("x1",(d,i)=>cellSize*(1+i))
        .attr("y1",cellSize*0)
        .attr("x2",(d,i)=>cellSize*(1+i))
        .attr("y2",cellSize*7)
        .attr("stroke","rgba(0,0,0,1)")
        .attr("fill","#555");

        //按月拆分数组
        let dataArr = [];
        data.map(mapItem => {
            if (dataArr.length == 0) {
            dataArr.push({ month: mapItem.month, List: [mapItem] })
            } else {
            let res = dataArr.some(item=> {//判断相同日期，有就添加到当前项
            if (item.month == mapItem.month) {
                item.List.push(mapItem)
                return true
            }
            })
            if (!res) {//如果没找相同日期添加一个新对象
                dataArr.push({ month: mapItem.month, List: [mapItem] })
            }
            }
        })
        //console.log("dataarr",dataArr)

        //绘制日期
        var eachDate = eachCalendar.selectAll(".eachDate")
        .data((d,i)=>{
            //console.log(dataArr[i].List);
            return dataArr[i].List;
        });
        
        eachDate.enter()
        .append("rect")
        .attr("x",(d,i)=>cellSize*(1+d.day)+2)
        .attr("y",(d,i)=>cellSize*d.hour+2)
        .attr("width",cellSize-4)
        .attr("height",cellSize-4)
        .attr("fill",d=>{
            if(d.range)
                return "rgba(255,0,0,0.8)";
            else
                return "rgba(255,165,0,0.8)";
        })
        .attr("opacity",0.5)
        .on("mousemove",function(ev,d){
            //console.log(d);
            tooltip.html(()=>{
                console.log(d);
                var tiptip;
                if(strSel == "new")
                    tiptip = "日期："+d.date+" 日"+"<br/>"+"新增："+d.new+" 例";
                else if(strSel == "confirm")
                    tiptip = "日期："+d.date+" 日"+"<br/>"+"确诊："+d.confirm+" 例";
                else if(strSel == "no")
                    tiptip = "日期："+d.date+" 日"+"<br/>"+"无症状："+d.no+" 例";
                if(d.range)
                    tiptip = tiptip + "<br/>" + "全市大筛";
                return tiptip;
            })
            .style("visibility","visible")
            .style("left", (window.event.pageX + 25) + "px")
            .style("top", (window.event.pageY - 10) + "px")
          })
          .on("mouseout",function(ev,d){
            d3.select(this)
              .attr("stroke-width","1px")
            tooltip.style('visibility', 'hidden')
          });
        
        eachDate.enter()
        .append("circle")
        .attr("cx",(d,i)=>cellSize*(1.5+d.day))
        .attr("cy",(d,i)=>cellSize*(0.5+d.hour)+1)
        .attr("r",d=>{
            if(strSel == "new")
                return radius(d.new);
            else if(strSel == "confirm")
                return radius(d.confirm);
            else if(strSel == "no")
                return radius(d.no);
        })
        .attr("fill","gray")
        .attr("opacity",0.6)
        .attr("pointer-events","none");
        
       g.attr("opacity",0);
       g.transition()
       .duration(500)
       .attr("opacity",1); 

    };
}

//删除
function calendarDel(){
    console.log(gg);
    if(gg === undefined)return;
    gg.transition()
    .duration(500)
    .attr("opacity",0)
    .remove();
    tooltip.remove();
}

export {calendarChart,calendarDel};