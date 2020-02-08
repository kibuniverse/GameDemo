var row = 10;   // 行数
var col = 10;   // 列数
var countMax = 10;  //最大的地雷数
var isFirstOpen = true;
var time1=null;
var time = document.getElementById('time');
function stop(){
   return false;
}
document.oncontextmenu=stop;

var elements = init_elements();  

//初始化得到扫雷盘的二维数组
function init_elements() {
	var box = document.getElementById('box');
	let grid = '';
	for (let i = 0; i < row; i++) {
		grid += '<tr>'
		for(let j = 0; j < col; j++) {
			grid += '<td><span class="blocks" onmousedown="element_click('+ i +', '+ j +', event)" backgroundColor="white";></span></td>';
		}
		grid += '<tr>';
	}
	box.innerHTML = grid;

	//控制扫雷盘的二维数组
	var elements = new Array();
	var blocks = document.getElementsByClassName('blocks');
	//初始化属性
	for (let i = 0; i < blocks.length; i++) {
		blocks[i].isMine = false;
		blocks[i].count = 0;
	}
	//将所有的放个放个存入二维数组elements中
	for( let i = 0; i < blocks.length; i++) {
		if (i % col === 0) {
			elements.push(new Array());
		}
		blocks[i].count = 0;
		elements[parseInt(i / col)].push(blocks[i]);
	}
	return elements;
}

function element_click(i, j, e){
	if(!time1) {
		timebegin();
	}
	console.log(i + ','+ j);
	if (elements[i][j].isOpen) {
		return;
	}
	if (e.button === 0) {
		//鼠标左键打开该方格
		if(isFirstOpen) {
			isFirstOpen = false;
			createMine(i, j);
		}
		open_element(i, j);
		isOver();
	}
	else if (e.button === 2) {  //鼠标右键事件
		elements[i][j].innerHTML === '🔺'? elements[i][j].innerHTML = '': elements[i][j].innerHTML = '🔺';
	}
}

//生成地雷函数
function createMine(i, j) {
	let count = 0;
	while(count < countMax) {
		im = parseInt(Math.random() * row);
		jm = parseInt(Math.random() * col);
		if(im != i && im != j && !elements[im][jm].isMine) {
			elements[im][jm].isMine = true;
			count++;
			// 让该9宫格内的地雷数字+1
			for (let a = im - 1; a < im + 2; a++) {
				for (let b = jm - 1; b < jm + 2; b++) {
					//判断是否越界
					if (b > -1 && a > -1 && b < col && a < row) {
						elements[a][b].count++;
					}
				}
			}
		}
	}
}

//打开方格
function open_element(i, j) {
	elements[i][j].style.background = '#ccc';
	elements[i][j].isOpen = true;
	if(elements[i][j].isMine) {
		for(let a = 0; a < row; a++) {
			for(let b = 0; b < col; b++) {
				if(elements[a][b].isMine) {
					elements[a][b].style.background = '#ccc';
					elements[a][b].innerHTML = '🧨';
				}
			}
		}
		clearInterval(time1);
		alert('这是一个雷，你完了!');
	}
	//如果没有雷则不显示
	else if(!elements[i][j].count) {
		chainReact(i, j);
	}
	else {
		elements[i][j].innerHTML = elements[i][j].count;
	}
}

//连锁反映
function chainReact(i, j) {
	for(let a = i - 1; a < i + 2; a ++) {
		for(let b = j - 1; b < j + 2; b ++) {
			if(a > -1 && b > -1 && a < row && b < col && !elements[a][b].isOpen && !elements[a][b].isMine) {
				//递归打开方格
				open_element(a, b);
			}
		}
	}
}

//结束函数
function isOver () {
	for (let i = 0; i < row; i++) {
		for (let j = 0; j < col; j++) {
			// 如果某个方格没有被打开而且不是地雷
			if(!elements[i][j].isOpen && !elements[i][j].isMine) {
				return;
			}
		}
	}
	clearInterval(time1);
	alert('你赢了！用时' + time.innerHTML);
}

//时间函数
function timebegin() {
	time.innerHTML = '0s';
	time1 = setInterval(function () {
		time.innerHTML = parseInt(time.innerHTML) + 1 + 's';
	}, 1000);
}
