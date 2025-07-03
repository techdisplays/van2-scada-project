 this.init=function(svg,component,properties,values){
    var elementRect=component.getElementsByTagName('rect');
    var elre=elementRect[0];
    //var bbox=elre.getBBox();
     var bbox=this.myscada.myscadaGetBoundingBox(elre,component);
    
    while (component.hasChildNodes()) {
        component.removeChild(component.lastChild);
      }
      
      var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject' );
	foreignObject.setAttribute("transform","translate(0 0)");
	var body = document.createElement('div'); // you cannot create bodies with .apend("<body />") for some reason
         $(body).css("height", bbox.height);
        $(body).css("width", bbox.width);
	var canvas = document.createElement('canvas');
        $(body).append(canvas);
      
	//$(body).css("overflow", 'hidden');
	$(foreignObject).attr('x', bbox.x).attr('y', bbox.y).attr("width", (bbox.width+1)).attr("height", (bbox.height+1)).append(body);

        $(foreignObject).appendTo(component);
      
   var opacity=parseInt(properties.list[19].value)/100;
   
   var groups=[]; //zjistime kolik ma uzivatel skupin
   for (var i=0;i<values.list.length;i++)
   {
       var hod=values.list[i].parameters.list[3].value;
       if (groups.indexOf(hod) === -1)
       {
           groups.push(hod);
       }
   }
   
   var data= {
            datasets: []
        };
        
        this.dataToDataset={};
                
       var labels=[];         
       for (var j=0;j<groups.length;j++)
       {     
            var backgroundColor=[];
            var d=[];
            var o={};
            var lang=this.myscada.getLanguage();
            for (var i=0;i<values.list.length;i++)
            {
                if (values.list[i].parameters.list[3].value===groups[j])
                {
                this.dataToDataset[i]=j;
             
                var desc=values.list[i].parameters.list[1].value;
                var ooo=values.list[i].parameters.list[1];
                if (ooo.translations && ooo.translations[lang]!==undefined)
                {
                    desc=ooo.translations[lang];
                }
                
                
                if (j===0) labels.push(desc); 
                var hex=values.list[i].parameters.list[2].value;
                hex = hex.replace('#','');
                 var r = parseInt(hex.substring(0,2), 16);
                 var g = parseInt(hex.substring(2,4), 16);
                 var b = parseInt(hex.substring(4,6), 16);
                 var c = 'rgba('+r+','+g+','+b+','+opacity+')';
                backgroundColor.push(c);
                d.push(i);
                }
            }

            o.data=d;
            o.backgroundColor=backgroundColor;
            o.label=groups[j];
            data.datasets.push(o); 
        }   
        data.labels=labels;
   
   
    this.groupCount=groups.length;

       
    var typ='pie';
    var type=properties.list[0].value; //TYP GRAFU
    if (type.startsWith('0'))
    {
        typ='bar';
    }
    else if (type.startsWith('1'))
    {
        typ='pie';
    }
    else if (type.startsWith('2'))
    {
        typ='doughnut';
    }
    else if (type.startsWith('3'))
    {
        typ='polarArea';
    }
    else if (type.startsWith('4'))
    {
        typ='radar';
    }
    else if (type.startsWith('5'))
    {
        typ='horizontalBar';
    }
    
    
    this.animateTime=0;
    if (properties.list[6].value==='1') //ANIMATION
    {
        this.animateTime=parseInt(properties.list[7].value); //ANIMATION TIME
        
    }
    var opt={
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {enabled: false},
        legend: {labels:{fontSize: parseInt(properties.list[4].value)}}, //LEGEND FONT SIZE
        animation: {duration: this.animateTime},
        scales: {
		xAxes: [{
			gridLines: {},
                        ticks:{}
			}],
		yAxes: [{
			gridLines: {},
			ticks: {
			}
			}]
		}
        };
        
    if (type.startsWith('0') || type.startsWith('5'))
    {
    var stacked=properties.list[20].value;
    if (stacked.startsWith("1"))
    {
        opt.scales.yAxes[0].stacked=true;
        opt.scales.xAxes[0].stacked=true;
    }
    
    var autoscale=properties.list[8].value;
    
    if (autoscale.startsWith("0"))
    {
        var minis=properties.list[9].value;
        if (isNaN(minis))
        {
          this.minis = minis;
        }
        else
        {
            if (typ==='horizontalBar')
            {
                this.typ='horizontalBar';
            opt.scales.xAxes[0].ticks.min=parseFloat(minis);
            //opt.scales.xAxes[0].ticks.max=parseFloat(maxis);    
            }
            else
            {
            opt.scales.yAxes[0].ticks.min=parseFloat(minis);
            //opt.scales.yAxes[0].ticks.max=parseFloat(maxis);
            }
        }
        
        var maxis=properties.list[10].value;
        if (isNaN(maxis))
        {
          this.maxis = maxis;
        }
        else
        {
            if (typ==='horizontalBar')
            {
            //opt.scales.xAxes[0].ticks.min=parseFloat(minis);
            opt.scales.xAxes[0].ticks.max=parseFloat(maxis);    
            }
            else
            {
            //opt.scales.yAxes[0].ticks.min=parseFloat(minis);
            opt.scales.yAxes[0].ticks.max=parseFloat(maxis);
            }
        }
        
        
    }
    
    var grid=properties.list[12].value;
    
    if (grid.startsWith("0"))
    {
        opt.scales.xAxes[0].gridLines.display=false;
        opt.scales.yAxes[0].gridLines.display=false;
    }
    
    var border=properties.list[18].value;
    if (border.startsWith("0"))
    {
        opt.scales.xAxes[0].gridLines.drawBorder=false;
        opt.scales.yAxes[0].gridLines.drawBorder=false;
    }
    
    opt.scales.xAxes[0].gridLines.color=properties.list[13].value; //grid color
    opt.scales.yAxes[0].gridLines.color=properties.list[13].value; //grid color
    
    if (properties.list[14].value.startsWith("0")) 
    {
         opt.scales.xAxes[0].gridLines.drawTicks=false;
         opt.scales.yAxes[0].gridLines.drawTicks=false;
     }
    
    if (properties.list[15].value.length>0) 
    {   
     opt.scales.xAxes[0].ticks.fontFamily=properties.list[15].value; //font family grid
     opt.scales.yAxes[0].ticks.fontFamily=properties.list[15].value; //font family grid
    }
    
    if (properties.list[11].value.startsWith("1")) 
    {   
        if (typ==='horizontalBar')
        {
        opt.scales.xAxes[0].ticks.beginAtZero=true;  
        }
        else
        {
        opt.scales.yAxes[0].ticks.beginAtZero=true;
        }
    }
    
     opt.scales.xAxes[0].ticks.fontSize=parseFloat(properties.list[16].value); //font family grid
     opt.scales.yAxes[0].ticks.fontSize=parseFloat(properties.list[16].value); //font family grid
 
     opt.scales.xAxes[0].ticks.fontColor=properties.list[17].value; //font family grid
     opt.scales.yAxes[0].ticks.fontColor=properties.list[17].value; //font family grid
     
     }
     else
     {
         delete(opt.scales);
     }
     
     if (properties.list[34].value.startsWith('1') ) opt.scales.xAxes[0].display=false;
     if (properties.list[35].value.startsWith('1') ) opt.scales.yAxes[0].display=false;
     if (properties.list[36].value.startsWith('1') )
     {
         opt.scales.xAxes[0].ticks.callback=function (data)
         {
           
             var h=Math.floor(data/60/60)+"";
                    if (h.length<2) h="0"+h;
                    var m=Math.floor((data-h*60*60)/60)+"";
                    if (m.length<2) m="0"+m;
                    var s=data-h*60*60-m*60+"";
                    if (s.length<2) s="0"+s;
                    return h+":"+m+":"+s;
         }
     }
     
     if (properties.list[37].value.startsWith('1') )
     {
         for (var x=0;x<opt.scales.yAxes.length;x++)
         {
         opt.scales.yAxes[x].ticks.callback=function (data)
         {
        
             var h=Math.floor(data/60/60)+"";
                    if (h.length<2) h="0"+h;
                    var m=Math.floor((data-h*60*60)/60)+"";
                    if (m.length<2) m="0"+m;
                    var s=data-h*60*60-m*60+"";
                    if (s.length<2) s="0"+s;
                    return h+":"+m+":"+s;
         }
        }
     }
     
    var fonttype=properties.list[3].value; //FONT FAMILY
    if (fonttype.length>0)
    {
        opt.legend.labels.fontFamily=fonttype;
    }
    
    var fontcolor=properties.list[5].value; //FONT COLOR
    if (fontcolor.length>0)
    {
        opt.legend.labels.fontColor=fontcolor;
    }
    
        if (properties.list[1].value==='1') //Legend ON/OFF
       {
       opt.legend.display = true; 
       }
       else
       {
       opt.legend.display = false; 
       }

      if (properties.list[2].value.startsWith('0') ) opt.legend.position='top';
      if (properties.list[2].value.startsWith('1') ) opt.legend.position='left';
      if (properties.list[2].value.startsWith('2') ) opt.legend.position='right';
      if (properties.list[2].value.startsWith('3') ) opt.legend.position='bottom';
    
            var datadesc=properties.list[21].value;
            
            
      
          
            opt.plugins={};
            opt.plugins.datalabels={};
            opt.plugins.datalabels.display=false;
            
            if (datadesc==="1")
            {
            opt.plugins.datalabels.display=true;
            
            
            var fonttype3=properties.list[22].value;
            var fontsize3=properties.list[23].value;
            var fontcolor3=properties.list[24].value;
            var opacity3=properties.list[25].value;
           // var padding3=properties.list[26].value;
            var rotation3=properties.list[27].value;
            var anchor3=properties.list[28].value;
            var decplaces=parseInt(properties.list[29].value);
            
            opt.plugins.datalabels.color= fontcolor3;
           // opt.plugins.datalabels.formatter=Math.round;
           
            var unit3=properties.list[30].value;
            
            var showaspercent=properties.list[31].value;
            var showastime=properties.list[32].value;
           
            opt.plugins.datalabels.formatter=function (data,b)
            {
                //showastime
               
              
                if (showaspercent==="1")
                {
                    var k=0;
                    for (var i=0;i<b.dataset.data.length;i++)
                    {
                        k=k+b.dataset.data[i];
                    }
                    var ddd=100*data/k;
                    var r=ddd.toFixed(decplaces)+unit3;
                    return r;
                }
                else if (showastime==="1")
                {
                    var h=Math.floor(data/60/60)+"";
                    if (h.length<2) h="0"+h;
                    var m=Math.floor((data-h*60*60)/60)+"";
                    if (m.length<2) m="0"+m;
                    var s=data-h*60*60-m*60+"";
                    if (s.length<2) s="0"+s;
                    return h+":"+m+":"+s;
                }
                else
                {
                    var r=data.toFixed(decplaces)+unit3;
                    return r;
                }
            }.bind(this);
            
            
            
            if (anchor3.startsWith('0') ) opt.plugins.datalabels.anchor='center';
            if (anchor3.startsWith('1') ) opt.plugins.datalabels.anchor='start';
            if (anchor3.startsWith('2') ) opt.plugins.datalabels.anchor='end';
                
            if (type.startsWith('0') || type.startsWith('5'))
                {
                opt.plugins.datalabels.anchor='end';
                }
                
            opt.plugins.datalabels.font={};
            if (fonttype3.length>0) opt.plugins.datalabels.font.family=fonttype3;
            opt.plugins.datalabels.font.size=parseInt(fontsize3);
            opt.plugins.datalabels.opacity=Math.round(parseInt(opacity3)/100);
            if (properties.list[26].value.startsWith('0') ) opt.plugins.datalabels.padding='top';
            if (properties.list[26].value.startsWith('1') ) opt.plugins.datalabels.padding='rigth';
            if (properties.list[26].value.startsWith('2') ) opt.plugins.datalabels.padding='bottom';
            if (properties.list[26].value.startsWith('3') ) opt.plugins.datalabels.padding='left';
            opt.plugins.datalabels.rotation=0-parseInt(rotation3);
            
            require(['chartjsplugins/chartjs-plugin-datalabels'], function () {
           
                this.objekt = new Chart(canvas, {
                type: typ, 
                data: data,
                options: opt
                });
                
                component.objekt=this.objekt;
                this.objekt.setDataLabels=this.setDatasetLabels;
                
            }.bind(this));
            
            }
            else
            {
                this.objekt = new Chart(canvas, {
                type: typ, 
                data: data,
                options: opt
                });
                component.objekt=this.objekt;
                this.objekt.setDataLabels=this.setDatasetLabels;
            }
            
            
    
 };


this.setDatasetLabels=function(data){
    var o=this.data.labels=data;

}

this.datarefresh=function(data){
    
    
    if (this.minis!==undefined)
    {
        var minis=this.myscada.getTagValue(this.minis);
       
        if (minis!=null && minis!=this.minisValue)
        {
            this.minisValue=minis;
            if (this.typ==='horizontalBar')
            {
            this.objekt.config.options.scales.xAxes[0].ticks.min=parseFloat(minis);
            }
            else
            {
            this.objekt.config.options.scales.yAxes[0].ticks.min=parseFloat(minis);
            }
        }
    }
    
        if (this.maxis!==undefined)
    {
        var maxis=this.myscada.getTagValue(this.maxis);
         
        if (maxis!=null && maxis!=this.maxisValue)
        {
            this.maxisValue=maxis;
            if (this.typ==='horizontalBar')
            {
            this.objekt.config.options.scales.xAxes[0].ticks.max=parseFloat(maxis);
            }
            else
            {
            this.objekt.config.options.scales.yAxes[0].ticks.max=parseFloat(maxis);
            }
        }
    }
    
  
    
    for (var k=0;k<this.groupCount;k++)
    {
        var d=[];
        for (var i=0;i<data.length;i++)
        {
            if (this.dataToDataset[i]===k)
            {
                if (data[i].length>0)
                {
                var dd=data[i][0];
                d.push(dd);
                }
                else
                    d.push(0);
            }
        }
        this.objekt.data.datasets[k].data=d;
    }
    
    this.objekt.update();
 };


this.remove=function(){
    delete (this.objekt);
 };
