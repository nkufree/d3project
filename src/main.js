//阿里云的中国地图有缺陷，有的地区边界不封闭，后来在github上面找到一个中国地图
import ChinaJson from "./assets/china.geojson";
import d3project from "./d3project.js";
import * as d3 from "d3";

//导入地图数据
d3.json(ChinaJson).then((data,error)=>{
  if(error)
  {
    console.log(error);
  }
  else
  {
    console.log(data);
    d3project(data);
  }
  });
