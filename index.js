'use strict';
const { Client } = require('discord.js');
let fetch = require('node-fetch');
require('dotenv').config();
const {
    token
  } = process.env.DISCORD_TOKEN // use the require method
const client = new Client();

async function getRawData(URL){
    let response= await fetch(URL);
    let data=await response.text();
    return data;
}

//取得單屬性的屬性相剋
const type=["一般","格鬥","飛行","毒","地面","岩石","蟲","幽靈","鋼","火","水","草","電","超能力","冰","龍","惡","妖精"];
function getType1(keywords){
    let q=[];
    if(keywords===type[0]){
        q=[1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];//一般
    }else if(keywords===type[1]){
        q=[1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 2];//格鬥
    }else if(keywords===type[2]){
        q=[1, 0.5, 1, 1, 0, 2, 0.5, 1, 1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1];//飛行
    }else if(keywords===type[3]){
        q=[1, 0.5, 1, 0.5, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 2, 1, 1, 1, 0.5];//毒
    }else if(keywords===type[4]){
        q=[1, 1, 1, 0.5, 1, 0.5, 1, 1, 1, 1, 2, 2, 0, 1, 2, 1, 1, 1];//地面
    }else if(keywords===type[5]){
        q=[0.5, 2, 0.5, 0.5, 2, 1, 1, 1, 2, 0.5, 2, 2, 1, 1, 1, 1, 1, 1];//岩石
    }else if(keywords===type[6]){
        q=[1, 0.5, 2, 1, 0.5, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1, 1, 1, 1];//蟲
    }else if(keywords===type[7]){
        q=[0, 0, 1, 0.5, 1, 1, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1];//幽靈
    }else if(keywords===type[8]){
        q=[0.5, 2, 0.5, 0, 2, 0.5, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 1, 0.5];//鋼
    }else if(keywords===type[9]){
        q=[1, 1, 1, 1, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 0.5, 1, 1, 0.5];//火
    }else if(keywords===type[10]){
        q=[1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 2, 2, 1, 0.5, 1, 1, 1];//水
    }else if(keywords===type[11]){
        q=[1, 1, 2, 2, 0.5, 1, 2, 1, 1, 2, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1];//草
    }else if(keywords===type[12]){
        q=[1, 1, 0.5, 1, 2, 1, 1, 1, 0.5, 1, 1, 1, 0.5, 1, 1, 1, 1, 1];//電
    }else if(keywords===type[13]){
        q=[1, 0.5, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 0.5, 1, 1, 2, 1];//超能力
    }else if(keywords===type[14]){
        q=[1, 2, 1, 1, 1, 2, 1, 1, 2, 2, 1, 1, 1, 1, 0.5, 1, 1, 1];//冰
    }else if(keywords===type[15]){
        q=[1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 1, 2, 2, 1, 2];//龍
    }else if(keywords===type[16]){
        q=[1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 0, 1, 1, 0.5, 2];//惡
    }else if(keywords===type[17]){
        q=[1, 0.5, 1, 2, 1, 1, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0.5, 1];//妖精
    }else
        return;
    return q;
}

//取得雙屬性的屬性相剋
function getType2(keywords1,keywords2){
    let type1=getType1(keywords1);
    let type2=getType1(keywords2);
    if(type1!=null & type2!=null){
        let typeWeak=[];
        for(let i=0; i<type1.length; i++){
            typeWeak[i]=type1[i]*type2[i];
        }
        return typeWeak;
    }else
        return;
}

//找尋寶可夢百科該寶可夢的頁面
async function searchPokeWikiPage(keywords) {
  try{
      const wikiURL="https://wiki.52poke.com/zh-hant/%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%88%97%E8%A1%A8%EF%BC%88%E6%8C%89%E5%85%A8%E5%9B%BD%E5%9B%BE%E9%89%B4%E7%BC%96%E5%8F%B7%EF%BC%89";
      const constWikiData = await getRawData(wikiURL);
      let data = constWikiData;
      let index_top = data.search(`title="${keywords}"></span></a>`);
      data = data.substr(index_top);
      index_top = data.search('<a href="/wiki') + 14;
      let index_bottom = data.search('" title=');
      data = data.substr(index_top, index_bottom - index_top);
      if(data!=""){
      let URL= "https://wiki.52poke.com/zh-hant" + data;
      const constdata = await getRawData(URL);
      //<a href="/wiki/%E7%81%AB%E6%81%90%E9%BE%99" title="火恐龍">火恐龍</a>
      return constdata;
      }else
          return;
      
  }
  catch (e){
      console.log(e);
  }
  
}

//找尋種族值
async function searchBaseStats(keywords){
  let data = await searchPokeWikiPage(keywords);
  if( data != null){
      let blank=0;
      let i= 0;
      let q=[];
      let index_top="";
      let formChangeData=data;
      let index_bottom="";
      let formChangeType=[];
      let t="";
      while(blank<20){
          index_top=formChangeData.search(`<div class="tabbertab" title="`)+30;
          formChangeData=formChangeData.substr(index_top);
          index_bottom = formChangeData.search(`">\n<table class="bg`);
          if(index_bottom < 100 && index_top != 29){  
              formChangeType[i]= formChangeData.substr(0, index_bottom);
              i++;
          }else{
              blank++;
          }
      }
      if(formChangeType.length!=0){
          for(let i=0;i<formChangeType.length;i++){
              for(let j=0;j<7;j++){
                  index_top = data.search(`<div style="float:right">`)+25;
                  data = data.substr(index_top);
                  index_bottom = data.search('</div>');
                  let baseStats = data.substr(0, index_bottom);
                  q[j] = baseStats;
              }
              t+=`${formChangeType[i]} => HP:${q[0]}, 攻擊:${q[1]}, 防禦:${q[2]}, 特攻:${q[3]}, 特防:${q[4]}, 速度:${q[5]}, 總和:${q[6]}\n`;
          }
      }else{
          for(let i=0;i<7;i++){
              index_top = data.search(`<div style="float:right">`)+25;
              data = data.substr(index_top);
              index_bottom = data.search('</div>');
              let baseStats = data.substr(0, index_bottom);
              q[i] = baseStats;
          }
          t= `HP:${q[0]}, 攻擊:${q[1]}, 防禦:${q[2]}, 特攻:${q[3]}, 特防:${q[4]}, 速度:${q[5]}, 總和:${q[6]}`;
      }
      return t;

  }
  else{
      return;
  }
}

//找尋捕獲率
async function searchCatchPR(keywords){
  let data = await searchPokeWikiPage(keywords);
  if( data != null){
      let catchPR=[];
      let index_top = data.search(`">捕獲率</a>`);
      data = data.substr(index_top);
      index_top = data.search(`bw-1">`)+6; 
      let index_bottom = data.search(`<small>`);
      catchPR[0] = data.substr(index_top, index_bottom-index_top);
      index_top = data.search(`普通的精靈球在滿體力下的捕獲率">`)+17;
      index_bottom = data.search(`</span>`);
      catchPR[1] = data.substr(index_top, index_bottom-index_top);
      return catchPR;
  }
  else
      return;
}

//搜尋寶可夢的特性
async function searchAbility(keywords){
  let data = await searchPokeWikiPage(keywords);
  if( data != null){
      let abilityData=data;
      let index_top="";
      let index_top_last="";
      let index_bottom="";
      let formChangeData="";
      let formChange=[];
      //判斷該寶可夢有幾個型態變化
      for(let i=0;i<6;i++){
          index_top=data.search(`_toggler_hide-form6">`)+21;
          index_top_last=data.search(`_toggler_show-form6">`)+21;
          if(index_top!=20){
              data=data.substr(index_top);
              index_bottom=data.search("\n</th></tr>");
              formChangeData=data.substr(0,index_bottom);
              if(formChangeData!="")
                  formChange[i]=formChangeData;
          }else if(index_top_last!=20){
              data=data.substr(index_top_last);
              index_bottom=data.search("\n</th></tr>");
              formChangeData=data.substr(0,index_bottom);
              if(formChangeData!="")
                  formChange[i]=formChangeData;
          }
      }
      //如果有型態變化，就用迴圈把每個型態的特性都找出來
      if(formChange.length!=0){
          let title=`${keywords}有${formChange.length}種型態\n\n`;
          let t="";
          let t2="";
          let abilityCheak=[];
          let tempArray=[];
          for(let i=0;i<formChange.length;i++){
              let ability=[];
              index_top=abilityData.search(`title="特性">特性</a></b>`)+25;
              abilityData=abilityData.substr(index_top);
              index_bottom=abilityData.search(`</td></tr></tbody></table>`);
              let tempData=abilityData.substr(0,index_bottom);
              index_top=tempData.search(`（特性）">`)+6;
              let j=0;
              do{
                  tempData=tempData.substr(index_top);
                  index_bottom=tempData.search(`</a>`);
                  ability[j]=tempData.substr(0,index_bottom);
                  tempArray[j]=tempData.substr(0,index_bottom);
                  index_top=tempData.search(`（特性）">`)+6;
                  j++;
              }while(index_top!=5);
              t=`${formChange[i]} 特性為`;
              for(let i=0;i<ability.length;i++){
                  t+=ability[i]+"、";
              }
              t2+=t.substring(0, t.length-1);
              t2+="\n\n";
              for(let i=0;i<ability.length;i++){
                  //如果有重複，印一次就好
                  let temp=await searchAbilityDetail(ability[i]);
                  if(t2.search(temp)===-1)
                      t2+=temp+"\n";
              }
              abilityCheak[i]=ability;
          }
          return title+t2;
      }//如果該寶可夢沒有型態變化，就只找一次特性
      else{
          let ability=[];
          index_top=data.search(`title="特性">特性</a></b>`)+25;
          data=data.substr(index_top);
          index_bottom=data.search(`</td></tr></tbody></table>`);
          data=data.substr(0,index_bottom);
          index_top=data.search(`（特性）">`)+6;
          let i=0;
          do{
              data=data.substr(index_top);
              index_bottom=data.search(`</a>`);
              ability[i]=data.substr(0,index_bottom);
              index_top=data.search(`（特性）">`)+6;
              i++;
          }while(index_top!=5);
          let t=`${keywords}的特性為`;
          for(let i=0;i<ability.length;i++){
              t+=ability[i]+"、";
          }
          let t2=t.substring(0, t.length-1);
          t2+="\n\n";
          for(let i=0;i<ability.length;i++){
              t2+=await searchAbilityDetail(ability[i]);
          }
          return t2;
      }
  }else
      return;
}

//搜尋特性的詳細資料
async function searchAbilityDetail(keywords){
  let URL="https://wiki.52poke.com/zh-hant/"+keywords+"（特性）";
  let data=await getRawData(URL);
  let index_top=data.search(`對戰中</span></h3>`);
  let index_bottom="";
  let t="";
  if(index_top!=-1){
      t+="對戰中：";
      data=data.substr(index_top);
      index_top=data.search(`<p>`)+3;
      index_bottom=data.search(`<span id=`);
      let tempData=data.substr(index_top,index_bottom-index_top);
      index_bottom=tempData.search(`<a href=`);
      while(index_bottom!=-1){
          t+=tempData.substr(0,index_bottom);
          index_top=tempData.search(`">`)+2;
          tempData=tempData.substr(index_top);
          index_bottom=tempData.search(`</a>`);
          t+=tempData.substr(0,index_bottom);
          index_top=tempData.search(`</a>`)+4;
          tempData=tempData.substr(index_top);
          index_bottom=tempData.search(`<a href=`);
      }
      t+=tempData;
  }
  index_top=data.search(`對戰外</span></h3>`);
  if(index_top!=-1){
      t+="對戰外：";
      data=data.substr(index_top);
      index_top=data.search(`<p>`)+3;
      index_bottom=data.search(`<span id=`);
      let tempData=data.substr(index_top,index_bottom-index_top);
      index_bottom=tempData.search(`<a href=`);
      while(index_bottom!=-1){
          t+=tempData.substr(0,index_bottom);
          index_top=tempData.search(`">`)+2;
          tempData=tempData.substr(index_top);
          index_bottom=tempData.search(`</a>`);
          t+=tempData.substr(0,index_bottom);
          index_top=tempData.search(`</a>`)+4;
          tempData=tempData.substr(index_top);
          index_bottom=tempData.search(`<a href=`);
      }
      t+=tempData;
  }
  //把說明文裡面不必要的符號刪除
  for(let i=0;i<20;i++){
      t=t.replace("\n","");
      t=t.replace("<p>","");
      t=t.replace("</p>","");
      t=t.replace("<li>","");
      t=t.replace("</li>","");
      t=t.replace("<ul>","");
      t=t.replace("</ul>","");
      t=t.replace("<h3>","");
      t=t.replace("<h2>","");
      t=t.replace("</sup>&#8260;<sub>","/");
      t=t.replace("</sub>","");
      t=t.replace("<sup>","");
      t=t.replace("</sup>","");
      t=t.replace("<b>","");
      t=t.replace("</b>","");
      t=t.replace('<span class="t-绿宝石">E</span>',"（綠寶石）");
  }
  if(t!=""){
      return `${keywords}的效果\n${t}\n\n`;
  }else
      return;
}

//把官方寶可夢圖鑑上的簡易資料抓下來
async function searchPokedexNumber(keywords){
  const pokedexURL=`https://tw.portal-pokemon.com/play/pokedex/${keywords}`;
  let data=await getRawData(pokedexURL);
  let errJU=data.search(`<div class="page-other__heading">Page not found!</div>`);
  if(errJU ===-1){
      //取得寶可夢的名稱
      let index_top=data.search(`pokemon-slider__main-name size-35">`)+35;
      data=data.substr(index_top);
      let index_bottom=data.search(`</p>`);
      let pokeName=data.substr(0,index_bottom);

      //取得寶可夢的副名稱(如果有)
      index_top=data.search(`pokemon-slider__main-subname size-20">`)+38;
      data=data.substr(index_top);
      index_bottom=data.search(`</p>`);
      let pokeSubName=data.substr(0,index_bottom);
      if(pokeSubName!="")
          pokeSubName=`(${pokeSubName})`;

      //取得寶可夢形象圖的連結
      index_top=data.search('<img class="pokemon-img__front"')+37;
      data=data.substr(index_top);
      index_bottom=data.search(`">`);
      let imgURL=data.substr(0,index_bottom);
      imgURL=`https://tw.portal-pokemon.com${imgURL}`;

      //取得寶可夢的屬性
      index_top=data.search(`pokemon-type__title size-20">`);
      index_bottom=data.search(`<div class="pokemon-main__bottom-left">`);
      let typeData=data.substr(index_top,index_bottom-index_top);
      let pokeType="";
      index_top=typeData.search(`<span>`)+6;
      do{
          typeData=typeData.substr(index_top);
          index_bottom=typeData.search(`</span>`);
          pokeType+=typeData.substr(0,index_bottom)+"、";
          index_top=typeData.search(`<span>`)+6;
      }while(index_top!=5);
      let pokeType2=pokeType.substring(0, pokeType.length-1);
      /*if(index_top!=5){
          index_bottom=typeData.search(`</span>`);
          pokeType[1]=typeData.substr(index_top,index_bottom-index_top);
      }*/

      //取得寶可夢的弱點屬性
      index_top=data.search(`pokemon-weakness__title size-20">`);
      index_bottom=data.search(`<div class="pokemon-main__right">`);
      let typeWeakData=data.substr(index_top,index_bottom-index_top);
      let typeWeak="";
      index_top=typeWeakData.search(`<!-- <span>`)+11;
      do{
          typeWeakData=typeWeakData.substr(index_top);
          index_bottom=typeWeakData.search(`</span>`);
          typeWeak+=typeWeakData.substr(0,index_bottom)+"、";
          index_top=typeWeakData.search(`<!-- <span>`)+11;
      }while(index_top!=10);
      let typeWeak2=typeWeak.substring(0, typeWeak.length-1);

      //取得身高
      index_top=data.search(`pokemon-info__value size-14">`)+29;
      data=data.substr(index_top);
      index_bottom=data.search(`</span>`);
      let height=data.substr(0,index_bottom);

      //取得分類
      index_top=data.search(`pokemon-info__value size-14"><span>`)+35;
      data=data.substr(index_top);
      index_bottom=data.search(`</span></span>`);
      let pokeClass=data.substr(0,index_bottom);

      //取得體重
      index_top=data.search(`pokemon-info__value size-14">`)+29;
      data=data.substr(index_top);
      index_bottom=data.search(`</span>`);
      let weight=data.substr(0,index_bottom);

      //取得性別
      index_top=data.search(`pokemon-info__value size-14">`)+29;
      data=data.substr(index_top);
      index_bottom=data.search(`pokemon-info__title size-14">特性</span>`);
      let genderData=data.substr(0,index_bottom);
      let male=genderData.search(`icon_male.png`);
      let female=genderData.search(`icon_female.png`);
      if(female!=-1 && male!=-1)
          genderData="公／母";
      else if(female===-1 && male!=-1)
          genderData="只有公的";
      else if(female!=-1 && male===-1)
          genderData="只有母的";
      else
          genderData="無性別";

      //取得簡易特性
      index_top=data.search(`<transition name="pokemon-info__fade">`)+38;
      data=data.substr(index_top);
      index_bottom=data.search(`</transition>`);
      let AbilityData=data.substr(0,index_bottom);
      let Ability="";
      index_top=AbilityData.search(`pokemon-info__value--title size-18">`)+36;
      do{
          AbilityData=AbilityData.substr(index_top);
          index_bottom=AbilityData.search(`</span>`);
          Ability+=AbilityData.substr(0,index_bottom)+"、";
          index_top=AbilityData.search(`pokemon-info__value--title size-18">`)+36;
      }while(index_top!=35);
      let Ability2=Ability.substring(0, Ability.length-1);
      if(Ability2==="")
          Ability2="無";

      //取得圖鑑介紹(版本隨機)
      index_top=data.search(`pokemon-story__title size-20">圖鑑版本</span>`)+45;
      data=data.substr(index_top);
      index_bottom=data.search(`pokemon-stats__status-wrapper">`);
      let pokeStory=data.substr(0,index_bottom);
      index_top=pokeStory.search(`<span>`)+6;
      let storyA=[];
      let i=0;
      do{
          pokeStory=pokeStory.substr(index_top);
          index_bottom=pokeStory.search(`</span>`);
          storyA[i]=pokeStory.substr(0,index_bottom);
          index_top=pokeStory.search(`<span>`)+6;
          i++;
      }while(index_top!=5);
      let story="";
      let Random=Math.random()*100;
      if(storyA.length===3){
          if(Random >= 67)
              story=storyA[2];
          else if(Random>=33 && Random<67)
              story=storyA[1];
          else
              story=storyA[0];
      }else if(storyA.length===2){
          if(Random>50)
              story=storyA[1];
          else
              story=storyA[0];
      }else
          story=storyA[0];


      let t=`編號${keywords} ${pokeName}${pokeSubName}\n${imgURL}\n屬性：${pokeType2}\n弱點：${typeWeak2}\n分類：${pokeClass}\n身高：${height} ｜體重：${weight}\n特性：${Ability2} ｜性別：${genderData}\n簡介：${story}`;
      return t;
  }else
      return;
}

//搜尋同一隻寶可夢的不同樣子
async function searchStyle(keywords){
  const pokedexURL=`https://tw.portal-pokemon.com/play/pokedex/${keywords}`;
  let data=await getRawData(pokedexURL);
  let errJU=data.search(`<div class="page-other__heading">Page not found!</div>`);
  if(errJU===-1){
      let styleName=[];
      let countA=[];
      let i=0;
      let index_top=data.search(`pokemon-style-box__name size-16">`)+33;
      while(index_top!=32){
          data=data.substr(index_top);
          let index_bottom=data.search(`</span>`);
          let name=data.substr(0,index_bottom);
          index_top=data.search(`pokemon-style-box__subname size-14">`)+36;
          data=data.substr(index_top);
          index_bottom=data.search(`</span>`);
          let subName=data.substr(0,index_bottom);
          if(subName!="")
              name+=`（${subName}）`;
          styleName[i]=name;
          countA[i]=`${i}`;
          i++;
          index_top=data.search(`pokemon-style-box__name size-16">`)+33;
      }
      if(styleName.length!=0)
          return [styleName,countA];
      else
          return;
  }else
      return;
}

//用寶可夢百科的全國圖鑑當依據，搜尋寶可夢的圖鑑編號
async function pokeNameToNumber(keywords){
  const wikiURL="https://wiki.52poke.com/zh-hant/%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%88%97%E8%A1%A8%EF%BC%88%E6%8C%89%E5%85%A8%E5%9B%BD%E5%9B%BE%E9%89%B4%E7%BC%96%E5%8F%B7%EF%BC%89";
  let data = await getRawData(wikiURL);
  let index_top=data.search(`" title="${keywords}">`)-100;
  if(index_top!=-101){
      data=data.substr(index_top);
      index_top=data.search(`<td>#`)+5;
      let index_bottom=data.search(`\n</td>\n<td><a href`);
      data=data.substr(index_top,index_bottom-index_top);
      return data;
  }
  return;
}

//把名字轉換成編號，再丟回給官方圖鑑印下詳細資料
async function searchPokedexName(keywords){
  let data=await pokeNameToNumber(keywords);
  data=await searchPokedexNumber(data);
  return data;
}

//尋找寶可夢的屬性
async function getTypeName(keywords){
  let data=await pokeNameToNumber(keywords);
  if(data!=null){
      let URL="https://tw.portal-pokemon.com/play/pokedex/"+data;
      data=await getRawData(URL);
      let index_top=data.search(`pokemon-type__title size-20">`);
      if(index_top!=-1){
        let index_bottom=data.search(`<div class="pokemon-main__bottom-left">`);
        data=data.substr(index_top,index_bottom-index_top);
        let pokeType=[];
        index_top=data.search(`<span>`)+6;
        let i=0;
        do{
            data=data.substr(index_top);
            index_bottom=data.search(`</span>`);
            pokeType[i]=data.substr(0,index_bottom);
            index_top=data.search(`<span>`)+6;
            i++;
        }while(index_top!=5);
        return pokeType;
      }else
        return;
  }else{
    return;
  }
}

// 當 Bot 接收到訊息時的事件
client.on('message', async (msg) => {

    if (msg.content === "!寶可夢指令"){
        msg.channel.send("以下為機器人支援的寶可夢相關指令\n"+
        "!寶可夢+名稱　!編號+圖鑑編號　=>　查詢寶可夢基本資料\n"+
        "!屬性(屬性名稱1,屬性名稱2)　!屬性+單屬性　!屬性+寶可夢　=>　查詢屬性相剋\n"+
        "!種族值+寶可夢　=>　查詢種族值\n!捕獲率+寶可夢　=>　查詢捕獲率\n"+
        "!特性+特性名稱　!特性+寶可夢　=>　查詢特性詳細資料（半成品）\n"+
        "以上指令'+'符號僅是為了方便閱讀，輸入時請無視\n\n"+
        "抓取的資料來源：寶可夢百科(https://wiki.52poke.com/)\n以及 寶可夢官網(https://tw.portal-pokemon.com/)\n"+
        "如果有查不到最新第九世代資料的問題，代表官網還沒更新，所以沒有資料\n\n");
      }
    
      if(msg.content.includes("!特性") && msg.content.includes("寶可夢相關指令")===false){
        let keywords=msg.content.replace("!特性","");
        let data=await searchAbility(keywords);
        if(data!=null){
            msg.channel.send(data);
        }else{
            data=await searchAbilityDetail(keywords);
            if(data!=null)
                msg.channel.send(data);
            else
                msg.channel.send("特性或是寶可夢名稱輸入錯誤！");
        }
      }
    
      if(msg.content.includes("!屬性(")  && msg.content.includes("格式輸入錯誤")===false && msg.content.includes("寶可夢相關指令")===false ){
        msg.content = msg.content.replace("!屬性(", "");
        msg.content = msg.content.replace(")", "");
        let q = msg.content.split(",");
        let typeWeak=[];
        let t=`這隻寶可夢的屬性相剋\n`;
        if(q.length!=2){
            msg.channel.send("格式輸入錯誤，格式為: !屬性(屬性名稱1,屬性名稱2) 或是在!屬性後面接單屬性");
        }else if(q[0]===q[1]){
            msg.channel.send("輸入屬性重複！");
        }else{
            typeWeak=getType2(q[0],q[1]);
            if(typeWeak!=null ){
                for(let i=0;i<type.length;i++){
                    t+=`${type[i]}:${typeWeak[i]}倍, `;
                }
                msg.channel.send(t);
            }else
                msg.channel.send("屬性輸入錯誤，請檢查屬性名稱是否有誤（一般/格鬥/飛行/毒/地面/岩石/蟲/幽靈/鋼/火/水/草/電/超能力/冰/龍/惡/妖精）");
        }
      }
    
      if(msg.content.includes("!屬性") && msg.content.includes("!屬性(")===false && msg.content.includes("寶可夢相關指令")===false){
        let typeWeak = msg.content.replace("!屬性", "");
        let button=false;
        for(let i=0;i<type.length;i++){
            if(typeWeak===type[i]){
                button=true;
            }
        }
        if(button!=true){
            let q=[];
            let Name=typeWeak;
            q= await getTypeName(typeWeak);
            if(q!=null){
              if(q.length===2){
                typeWeak=getType2(q[0],q[1]);
                let t=`${Name}的屬性為${q[0]}和${q[1]} 屬性相剋如下\n`;
                for(let i=0;i<type.length;i++){
                    t+=`${type[i]}:${typeWeak[i]}倍, `;
                }
                msg.channel.send(t);
              }else{
                typeWeak=getType1(q[0]);
                let t=`${Name}的屬性為${q[0]} 屬性相剋如下\n`;
                for(let i=0;i<type.length;i++){
                    t+=`${type[i]}:${typeWeak[i]}倍, `;
                }
                msg.channel.send(t);
              }
            }else
              msg.channel.send("寶可夢名稱或是屬性輸入有誤！\n（一般/格鬥/飛行/毒/地面/岩石/蟲/幽靈/鋼/火/水/草/電/超能力/冰/龍/惡/妖精）");
        }else{
            let t=`這隻寶可夢的屬性相剋\n`;
            typeWeak=getType1(typeWeak);
            for(let i=0;i<type.length;i++){
                t+=`${type[i]}:${typeWeak[i]}倍, `;
            }
            msg.channel.send(t);
        }
      }
    
      if(msg.content.includes("!種族值") && msg.content.includes("寶可夢相關指令")===false){
        msg.content = msg.content.replace("!種族值", "");
        let keywords= msg.content;
        let t = await searchBaseStats(keywords);
        if( t != null){
            msg.channel.send(`${keywords}種族值如下\n${t}`);
        }
        else
            msg.channel.send("寶可夢名稱輸入有誤！");
      }
    
      if(msg.content.includes("!捕獲率") && msg.content.includes("寶可夢相關指令")===false){
        msg.content = msg.content.replace("!捕獲率", "");
        let keywords= msg.content;
        let catchPR = await searchCatchPR(keywords);
        if( catchPR != null){
            msg.channel.send(`捕獲率:${catchPR[0]}(${catchPR[1]})`);
            msg.channel.send("括號後的機率為一般精靈球在滿體力下的捕捉率");
        }
        else
            msg.channel.send("寶可夢名稱輸入有誤！");
      }
    
      if(msg.content.includes("!編號") && msg.content.includes("寶可夢相關指令")===false){
        msg.content = msg.content.replace("!編號", "");
        let keywords = msg.content;
        let pokeDex = await searchPokedexNumber(keywords);
        if(pokeDex!=null && msg.content.includes("_")===false){
            msg.channel.send(pokeDex);
            let styleData=await searchStyle(keywords);
            if(styleData!=null){
                const filter = (m) =>
                    m.author.id === msg.author.id && styleData[1].indexOf(m.content)!=-1;
                let t=`這隻寶可夢還有${styleData[0].length-1}種型態，輸入對應編號可取得詳細資訊，若超過30秒未回應將自動終止。\n`;
                for(let i=1;i<styleData[0].length;i++){
                    t+=`${styleData[1][i]}:${styleData[0][i]} `;
                }
                msg.channel.send(t);
                const collector = msg.channel.createMessageCollector(filter, {max: 1, time: 30000});
                collector.on("collect", async (msg2) => {
                    if(msg2.content==="1"){
                        let data=await searchPokedexNumber(keywords+"_1");
                        msg.channel.send(data);
                    }else if(msg2.content==="2"){
                        let data=await searchPokedexNumber(keywords+"_2");
                        msg.channel.send(data);
                    }else if(msg2.content==="3"){
                        let data=await searchPokedexNumber(keywords+"_3");
                        msg.channel.send(data);
                    }else if(msg2.content==="4"){
                        let data=await searchPokedexNumber(keywords+"_4");
                        msg.channel.send(data);
                    }else if(msg2.content==="5"){
                        let data=await searchPokedexNumber(keywords+"_5");
                        msg.channel.send(data);
                    }else 
                        collector.stop('time');
                });
                collector.on("end", (collected, reason) => {
                    if ( reason === 'time') {
                        msg.channel.send("超過30秒，終止等待");
                    }
                    //console.log("stop");
                });
    
            }
        }
        else
            msg.channel.send("圖鑑編號輸入有誤！");
    }
    
    if(msg.content.includes("!寶可夢") && msg.content.includes("寶可夢相關指令")===false &&　msg.content!="!寶可夢指令"){
        msg.content = msg.content.replace("!寶可夢","");
        let keywords= msg.content;
        let pokeDex= await searchPokedexName(keywords);
        if(pokeDex!=null){
            msg.channel.send(pokeDex);
            let number=await pokeNameToNumber(keywords);
            let styleData=await searchStyle(number);
            if(styleData!=null){
                const filter = (m) =>
                    m.author.id === msg.author.id && styleData[1].indexOf(m.content)!=-1;
                let t=`這隻寶可夢還有${styleData[0].length-1}種型態，輸入對應編號可取得詳細資訊，若超過30秒未回應將自動終止。\n`;
                for(let i=1;i<styleData[0].length;i++){
                    t+=`${styleData[1][i]}:${styleData[0][i]} `;
                }
                msg.channel.send(t);
                const collector = msg.channel.createMessageCollector(filter, {max: 1, time: 30000});
                collector.on("collect", async (msg2) => {
                    if(msg2.content==="1"){
                        let data=await searchPokedexNumber(number+"_1");
                        msg.channel.send(data);
                    }else if(msg2.content==="2"){
                        let data=await searchPokedexNumber(number+"_2");
                        msg.channel.send(data);
                    }else if(msg2.content==="3"){
                        let data=await searchPokedexNumber(number+"_3");
                        msg.channel.send(data);
                    }else if(msg2.content==="4"){
                        let data=await searchPokedexNumber(number+"_4");
                        msg.channel.send(data);
                    }else if(msg2.content==="5"){
                        let data=await searchPokedexNumber(number+"_5");
                        msg.channel.send(data);
                    }else 
                        collector.stop('time');
                });
                collector.on("end", (collected, reason) => {
                    if ( reason === 'time') {
                        msg.channel.send("超過30秒，終止等待");
                    }
                    //console.log("stop");
                });
    
            }
        }
        else
            msg.channel.send("寶可夢名稱輸入有誤！");
    }    

});

// 連上線時的事件
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("輸入 !寶可夢指令");
});

client.login(token);