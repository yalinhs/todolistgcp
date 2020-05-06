//jsversion:6

exports.getDate=function (){
  let today = new Date();
  let options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
return today.toLocaleDateString("ja-JP", options);

};

exports.getDay= function (){
  let today = new Date();
  let options = {
    weekday: 'long',
  };
return today.toLocaleDateString("ja-JP", options);

};
